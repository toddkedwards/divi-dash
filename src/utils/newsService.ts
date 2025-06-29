export interface NewsArticle {
  id: string;
  headline: string;
  summary: string;
  url: string;
  source: string;
  datetime: number;
  symbol?: string;
  image?: string;
  sentiment?: SentimentScore;
  category?: NewsCategory;
  relevanceScore?: number;
  isDividendRelated?: boolean;
  impactScore?: number;
  dividendSafetyAlert?: DividendSafetyAlert;
  marketImpact?: MarketImpact;
  socialSentiment?: SocialSentiment;
}

export interface SentimentScore {
  score: number; // -1 to 1 (negative to positive)
  confidence: number; // 0 to 1
  label: 'negative' | 'neutral' | 'positive';
  reasoning?: string;
  aiConfidence?: number; // AI model confidence
  keyPhrases?: string[];
  emotionScore?: {
    fear: number;
    greed: number;
    optimism: number;
    pessimism: number;
  };
}

export interface NewsCategory {
  primary: string;
  secondary?: string;
  tags: string[];
  urgencyLevel?: 'low' | 'medium' | 'high' | 'urgent';
  marketRelevance?: number; // 0 to 1
}

export interface DividendSafetyAlert {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  alertType: 'cut' | 'suspension' | 'reduction' | 'warning' | 'positive';
  confidence: number;
  reasoning: string;
  timeFrame?: string;
  historicalContext?: string;
}

export interface MarketImpact {
  expectedVolatility: number; // 0 to 1
  sectorImpact: string[];
  priceImpact: 'bullish' | 'bearish' | 'neutral';
  timeHorizon: 'immediate' | 'short-term' | 'long-term';
  confidenceLevel: number;
}

export interface SocialSentiment {
  mentions: number;
  sentiment: SentimentScore;
  trendingScore: number; // 0 to 100
  platforms: {
    reddit?: { score: number; mentions: number };
    twitter?: { score: number; mentions: number };
    stocktwits?: { score: number; mentions: number };
  };
}

export interface MarketSentiment {
  overall: SentimentScore;
  bySymbol: Record<string, SentimentScore>;
  trendingTopics: string[];
  dividendSentiment: SentimentScore;
  sectorSentiment?: Record<string, SentimentScore>;
  marketFear?: number; // 0 to 100 (VIX-like indicator)
  newsFlow?: {
    volume: number;
    sentiment: SentimentScore;
    urgency: number;
  };
}

const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

// Enhanced dividend-related keywords with risk indicators
const DIVIDEND_KEYWORDS = [
  'dividend', 'dividends', 'payout', 'yield', 'distribution', 'quarterly payment',
  'ex-dividend', 'record date', 'payment date', 'dividend increase', 'dividend cut',
  'dividend suspension', 'dividend growth', 'dividend aristocrat', 'dividend king',
  'special dividend', 'dividend reinvestment', 'drip', 'income', 'shareholder return'
];

const DIVIDEND_RISK_KEYWORDS = {
  high: ['cut', 'suspend', 'eliminate', 'reduce', 'slash', 'cancel'],
  medium: ['review', 'evaluate', 'consider', 'pressure', 'challenge', 'uncertain'],
  positive: ['increase', 'raise', 'boost', 'grow', 'expand', 'special', 'extra']
};

// Enhanced sentiment keywords with emotional context
const POSITIVE_KEYWORDS = [
  'increase', 'raised', 'boost', 'growth', 'strong', 'beat', 'exceed', 'outperform',
  'bullish', 'optimistic', 'record', 'milestone', 'success', 'improvement', 'expansion',
  'profitable', 'revenue growth', 'earnings beat', 'upgraded', 'breakthrough', 'stellar',
  'outstanding', 'impressive', 'robust', 'solid', 'resilient', 'momentum'
];

const NEGATIVE_KEYWORDS = [
  'cut', 'reduce', 'suspend', 'eliminate', 'decline', 'drop', 'fall', 'miss',
  'disappoint', 'bearish', 'pessimistic', 'loss', 'downgrade', 'concern', 'risk',
  'uncertainty', 'volatility', 'recession', 'crisis', 'bankruptcy', 'struggle',
  'weakness', 'deteriorate', 'plunge', 'collapse', 'warning', 'cautious'
];

const FEAR_KEYWORDS = [
  'panic', 'crash', 'collapse', 'crisis', 'fear', 'worry', 'anxiety', 'selloff',
  'plummet', 'nosedive', 'turmoil', 'chaos', 'meltdown', 'disaster'
];

const GREED_KEYWORDS = [
  'surge', 'skyrocket', 'boom', 'rally', 'euphoria', 'mania', 'frenzy',
  'explosive', 'meteoric', 'soar', 'breakout', 'momentum'
];

class NewsService {
  private cache = new Map<string, { data: NewsArticle[]; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private sentimentCache = new Map<string, SentimentScore>();

  async getNews(symbol?: string, limit = 20): Promise<NewsArticle[]> {
    const cacheKey = symbol || 'general';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data.slice(0, limit);
    }

    try {
      let news: any[] = [];
      
      if (symbol) {
        // Get company-specific news
        news = await this.fetchCompanyNews(symbol);
      } else {
        // Get general market news
        news = await this.fetchGeneralNews();
      }

      const processedNews = await this.processNewsArticles(news, symbol);
      
      this.cache.set(cacheKey, {
        data: processedNews,
        timestamp: Date.now()
      });

      return processedNews.slice(0, limit);
    } catch (error) {
      console.error('Error fetching news:', error);
      return cached?.data.slice(0, limit) || [];
    }
  }

  async getDividendNews(symbols: string[] = [], limit = 15): Promise<NewsArticle[]> {
    const allNews: NewsArticle[] = [];
    
    // Get news for each symbol
    for (const symbol of symbols.slice(0, 10)) { // Limit to avoid API rate limits
      try {
        const symbolNews = await this.getNews(symbol, 5);
        allNews.push(...symbolNews);
      } catch (error) {
        console.error(`Error fetching news for ${symbol}:`, error);
      }
    }

    // Get general dividend-related news
    const generalNews = await this.getNews(undefined, 10);
    allNews.push(...generalNews);

    // Filter for dividend-related articles and remove duplicates
    const dividendNews = allNews
      .filter(article => this.isDividendRelated(article))
      .filter((article, index, self) => 
        index === self.findIndex(a => a.url === article.url)
      )
      .sort((a, b) => b.datetime - a.datetime)
      .slice(0, limit);

    return dividendNews;
  }

  async getMarketSentiment(symbols: string[] = []): Promise<MarketSentiment> {
    const allNews = await Promise.all(
      symbols.map(symbol => this.getNews(symbol, 5))
    );

    const flatNews = allNews.flat();
    const overall = this.calculateOverallSentiment(flatNews);
    
    const bySymbol: Record<string, SentimentScore> = {};
    for (let i = 0; i < symbols.length; i++) {
      bySymbol[symbols[i]] = this.calculateOverallSentiment(allNews[i] || []);
    }

    const dividendNews = flatNews.filter(article => this.isDividendRelated(article));
    const dividendSentiment = this.calculateOverallSentiment(dividendNews);

    const trendingTopics = this.extractTrendingTopics(flatNews);

    return {
      overall,
      bySymbol,
      trendingTopics,
      dividendSentiment
    };
  }

  private async fetchCompanyNews(symbol: string): Promise<any[]> {
    const now = new Date();
    const from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10); // 7 days ago
    const to = now.toISOString().slice(0, 10);
    
    const response = await fetch(
      `${FINNHUB_BASE_URL}/company-news?symbol=${encodeURIComponent(symbol)}&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`
    );
    
    if (!response.ok) throw new Error(`Failed to fetch news for ${symbol}`);
    return response.json();
  }

  private async fetchGeneralNews(): Promise<any[]> {
    const response = await fetch(
      `${FINNHUB_BASE_URL}/news?category=general&token=${FINNHUB_API_KEY}`
    );
    
    if (!response.ok) throw new Error('Failed to fetch general news');
    return response.json();
  }

  private async processNewsArticles(rawNews: any[], symbol?: string): Promise<NewsArticle[]> {
    return rawNews.map((article, index) => {
      const processed: NewsArticle = {
        id: `${article.datetime}-${article.headline?.replace(/[^a-zA-Z0-9]/g, '')}-${index}`,
        headline: article.headline || 'No headline',
        summary: article.summary || '',
        url: article.url || '',
        source: article.source || 'Unknown',
        datetime: article.datetime * 1000, // Convert to milliseconds
        symbol: symbol,
        image: article.image,
        sentiment: this.analyzeSentiment(article.headline, article.summary),
        category: this.categorizeNews(article.headline, article.summary),
        relevanceScore: this.calculateRelevanceScore(article, symbol),
        isDividendRelated: this.isDividendRelated(article)
      };

      return processed;
    }).filter(article => (article.relevanceScore || 0) > 0.3) // Filter low relevance articles
      .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
  }

  private analyzeSentiment(headline: string, summary: string): SentimentScore {
    const text = `${headline} ${summary}`.toLowerCase();
    
    const positiveMatches = POSITIVE_KEYWORDS.filter(keyword => 
      text.includes(keyword)
    ).length;
    
    const negativeMatches = NEGATIVE_KEYWORDS.filter(keyword => 
      text.includes(keyword)
    ).length;
    
    const totalMatches = positiveMatches + negativeMatches;
    
    if (totalMatches === 0) {
      return {
        score: 0,
        confidence: 0.3,
        label: 'neutral'
      };
    }
    
    const score = totalMatches > 0 ? 
      (positiveMatches - negativeMatches) / totalMatches : 0;
    
    const confidence = Math.min(totalMatches / 5, 1); // Max confidence with 5+ matches
    
    let label: 'negative' | 'neutral' | 'positive';
    if (score > 0.2) label = 'positive';
    else if (score < -0.2) label = 'negative';
    else label = 'neutral';
    
    return {
      score: Math.max(-1, Math.min(1, score)), // Clamp between -1 and 1
      confidence,
      label,
      reasoning: this.getSentimentReasoning(positiveMatches, negativeMatches)
    };
  }

  private getSentimentReasoning(positive: number, negative: number): string {
    if (positive > negative) {
      return `${positive} positive indicators found`;
    } else if (negative > positive) {
      return `${negative} negative indicators found`;
    }
    return 'Neutral sentiment indicators';
  }

  private categorizeNews(headline: string, summary: string): NewsCategory {
    const text = `${headline} ${summary}`.toLowerCase();
    
    const categories = {
      'earnings': ['earnings', 'quarterly', 'eps', 'revenue', 'profit'],
      'dividends': DIVIDEND_KEYWORDS,
      'acquisitions': ['acquisition', 'merger', 'takeover', 'bought', 'acquired'],
      'partnerships': ['partnership', 'collaboration', 'alliance', 'joint venture'],
      'leadership': ['ceo', 'cfo', 'executive', 'management', 'appointed', 'resigned'],
      'products': ['product', 'launch', 'release', 'innovation', 'technology'],
      'regulatory': ['fda', 'sec', 'regulation', 'compliance', 'approval'],
      'market': ['market', 'sector', 'industry', 'economy', 'fed', 'inflation']
    };
    
    let primaryCategory = 'general';
    let maxScore = 0;
    
    for (const [category, keywords] of Object.entries(categories)) {
      const score = keywords.filter(keyword => text.includes(keyword)).length;
      if (score > maxScore) {
        maxScore = score;
        primaryCategory = category;
      }
    }
    
    const tags = Object.entries(categories)
      .filter(([_, keywords]) => keywords.some(keyword => text.includes(keyword)))
      .map(([category]) => category);
    
    return {
      primary: primaryCategory,
      tags
    };
  }

  private calculateRelevanceScore(article: any, symbol?: string): number {
    let score = 0.5; // Base relevance
    
    const text = `${article.headline} ${article.summary}`.toLowerCase();
    
    // Higher relevance for dividend-related content
    if (this.isDividendRelated(article)) {
      score += 0.3;
    }
    
    // Higher relevance for specific symbols
    if (symbol && text.includes(symbol.toLowerCase())) {
      score += 0.2;
    }
    
    // Higher relevance for recent articles
    const hoursOld = (Date.now() - article.datetime * 1000) / (1000 * 60 * 60);
    if (hoursOld < 24) score += 0.1;
    else if (hoursOld < 72) score += 0.05;
    
    // Higher relevance for major sources
    const majorSources = ['reuters', 'bloomberg', 'wsj', 'cnbc', 'marketwatch'];
    if (majorSources.some(source => article.source?.toLowerCase().includes(source))) {
      score += 0.1;
    }
    
    return Math.min(1, score);
  }

  private isDividendRelated(article: NewsArticle | any): boolean {
    const text = `${article.headline} ${article.summary}`.toLowerCase();
    return DIVIDEND_KEYWORDS.some(keyword => text.includes(keyword));
  }

  private calculateOverallSentiment(articles: NewsArticle[]): SentimentScore {
    if (articles.length === 0) {
      return { score: 0, confidence: 0, label: 'neutral' };
    }
    
    const weightedScores = articles
      .filter(article => article.sentiment)
      .map(article => ({
        score: article.sentiment!.score,
        weight: article.sentiment!.confidence * (article.relevanceScore || 1)
      }));
    
    if (weightedScores.length === 0) {
      return { score: 0, confidence: 0, label: 'neutral' };
    }
    
    const totalWeight = weightedScores.reduce((sum, item) => sum + item.weight, 0);
    const weightedAverage = weightedScores.reduce((sum, item) => 
      sum + (item.score * item.weight), 0) / totalWeight;
    
    const confidence = Math.min(totalWeight / articles.length, 1);
    
    let label: 'negative' | 'neutral' | 'positive';
    if (weightedAverage > 0.1) label = 'positive';
    else if (weightedAverage < -0.1) label = 'negative';
    else label = 'neutral';
    
    return {
      score: weightedAverage,
      confidence,
      label
    };
  }

  private extractTrendingTopics(articles: NewsArticle[]): string[] {
    const topicCounts = new Map<string, number>();
    
    articles.forEach(article => {
      article.category?.tags.forEach(tag => {
        topicCounts.set(tag, (topicCounts.get(tag) || 0) + 1);
      });
    });
    
    return Array.from(topicCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic]) => topic);
  }

  async getEnhancedNews(symbol?: string, limit = 20): Promise<NewsArticle[]> {
    const news = await this.getNews(symbol, limit);
    
    // Enhance each article with advanced analysis
    const enhancedNews = await Promise.all(
      news.map(async article => await this.enhanceArticle(article))
    );

    return enhancedNews.sort((a, b) => (b.impactScore || 0) - (a.impactScore || 0));
  }

  async getDividendSafetyAlerts(symbols: string[]): Promise<NewsArticle[]> {
    const allNews: NewsArticle[] = [];
    
    for (const symbol of symbols) {
      const symbolNews = await this.getEnhancedNews(symbol, 10);
      const alertNews = symbolNews.filter(article => 
        article.dividendSafetyAlert && 
        ['medium', 'high', 'critical'].includes(article.dividendSafetyAlert.riskLevel)
      );
      allNews.push(...alertNews);
    }

    return allNews
      .sort((a, b) => this.getRiskScore(b) - this.getRiskScore(a))
      .slice(0, 20);
  }

  private async enhanceArticle(article: NewsArticle): Promise<NewsArticle> {
    const enhanced = { ...article };
    
    // Add advanced sentiment analysis
    enhanced.sentiment = this.getAdvancedSentiment(article.headline, article.summary);
    
    // Add dividend safety analysis
    if (article.isDividendRelated) {
      enhanced.dividendSafetyAlert = this.analyzeDividendSafety(article);
    }
    
    // Add market impact analysis
    enhanced.marketImpact = this.analyzeMarketImpact(article);
    
    // Calculate impact score
    enhanced.impactScore = this.calculateImpactScore(enhanced);
    
    // Add social sentiment (simulated for now)
    enhanced.socialSentiment = await this.getSocialSentiment(article.symbol);
    
    return enhanced;
  }

  private getAdvancedSentiment(headline: string, summary: string): SentimentScore {
    const text = `${headline} ${summary}`.toLowerCase();
    
    // Basic sentiment analysis
    const basic = this.analyzeSentiment(headline, summary);
    
    // Emotional analysis
    const fearScore = FEAR_KEYWORDS.filter(word => text.includes(word)).length / FEAR_KEYWORDS.length;
    const greedScore = GREED_KEYWORDS.filter(word => text.includes(word)).length / GREED_KEYWORDS.length;
    
    // Extract key phrases
    const keyPhrases = this.extractKeyPhrases(text);
    
    // AI confidence simulation (would be replaced with actual AI model)
    const aiConfidence = this.simulateAIConfidence(text, basic.score);
    
    return {
      ...basic,
      aiConfidence,
      keyPhrases,
      emotionScore: {
        fear: fearScore,
        greed: greedScore,
        optimism: basic.score > 0 ? basic.confidence : 0,
        pessimism: basic.score < 0 ? basic.confidence : 0
      }
    };
  }

  private analyzeDividendSafety(article: NewsArticle): DividendSafetyAlert {
    const text = `${article.headline} ${article.summary}`.toLowerCase();
    
    // Check for risk indicators
    let riskLevel: DividendSafetyAlert['riskLevel'] = 'low';
    let alertType: DividendSafetyAlert['alertType'] = 'positive';
    let confidence = 0.5;
    let reasoning = 'Standard dividend news';

    // High risk indicators
    const highRiskCount = DIVIDEND_RISK_KEYWORDS.high.filter(word => text.includes(word)).length;
    if (highRiskCount > 0) {
      riskLevel = 'critical';
      alertType = 'cut';
      confidence = Math.min(0.9, 0.7 + (highRiskCount * 0.1));
      reasoning = `Potential dividend cut detected: ${DIVIDEND_RISK_KEYWORDS.high.filter(word => text.includes(word)).join(', ')}`;
    }

    // Medium risk indicators
    const mediumRiskCount = DIVIDEND_RISK_KEYWORDS.medium.filter(word => text.includes(word)).length;
    if (mediumRiskCount > 0 && riskLevel === 'low') {
      riskLevel = 'medium';
      alertType = 'warning';
      confidence = 0.6 + (mediumRiskCount * 0.1);
      reasoning = `Dividend under review: ${DIVIDEND_RISK_KEYWORDS.medium.filter(word => text.includes(word)).join(', ')}`;
    }

    // Positive indicators
    const positiveCount = DIVIDEND_RISK_KEYWORDS.positive.filter(word => text.includes(word)).length;
    if (positiveCount > 0) {
      riskLevel = 'low';
      alertType = 'positive';
      confidence = 0.7 + (positiveCount * 0.1);
      reasoning = `Positive dividend news: ${DIVIDEND_RISK_KEYWORDS.positive.filter(word => text.includes(word)).join(', ')}`;
    }

    return {
      riskLevel,
      alertType,
      confidence: Math.min(0.95, confidence),
      reasoning,
      timeFrame: this.extractTimeFrame(text),
      historicalContext: this.getHistoricalContext(article.symbol)
    };
  }

  private analyzeMarketImpact(article: NewsArticle): MarketImpact {
    const text = `${article.headline} ${article.summary}`.toLowerCase();
    
    // Analyze volatility indicators
    const volatilityWords = ['volatile', 'swing', 'spike', 'drop', 'surge', 'crash'];
    const volatilityScore = volatilityWords.filter(word => text.includes(word)).length / volatilityWords.length;
    
    // Determine price impact
    let priceImpact: MarketImpact['priceImpact'] = 'neutral';
    if (article.sentiment?.score && article.sentiment.score > 0.3) {
      priceImpact = 'bullish';
    } else if (article.sentiment?.score && article.sentiment.score < -0.3) {
      priceImpact = 'bearish';
    }
    
    // Sector impact analysis
    const sectorKeywords = {
      'technology': ['tech', 'software', 'ai', 'cloud', 'digital'],
      'healthcare': ['health', 'pharma', 'drug', 'medical', 'biotech'],
      'finance': ['bank', 'financial', 'credit', 'loan', 'insurance'],
      'energy': ['oil', 'gas', 'energy', 'renewable', 'solar'],
      'consumer': ['retail', 'consumer', 'brand', 'product']
    };
    
    const sectorImpact = Object.entries(sectorKeywords)
      .filter(([_, keywords]) => keywords.some(keyword => text.includes(keyword)))
      .map(([sector]) => sector);
    
    return {
      expectedVolatility: Math.min(1, volatilityScore * 2),
      sectorImpact,
      priceImpact,
      timeHorizon: this.determineTimeHorizon(text),
      confidenceLevel: article.sentiment?.confidence || 0.5
    };
  }

  private calculateImpactScore(article: NewsArticle): number {
    let score = 0.5; // Base score
    
    // Sentiment weight
    if (article.sentiment) {
      score += Math.abs(article.sentiment.score) * 0.3;
    }
    
    // Dividend safety weight
    if (article.dividendSafetyAlert) {
      const riskWeights = { low: 0.1, medium: 0.2, high: 0.3, critical: 0.4 };
      score += riskWeights[article.dividendSafetyAlert.riskLevel];
    }
    
    // Market impact weight
    if (article.marketImpact) {
      score += article.marketImpact.expectedVolatility * 0.2;
    }
    
    // Relevance weight
    score += (article.relevanceScore || 0) * 0.2;
    
    // Social sentiment weight
    if (article.socialSentiment) {
      score += (article.socialSentiment.trendingScore / 100) * 0.1;
    }
    
    return Math.min(1, score);
  }

  private async getSocialSentiment(symbol?: string): Promise<SocialSentiment> {
    // Simulated social sentiment data (would be replaced with actual social media APIs)
    return {
      mentions: Math.floor(Math.random() * 1000),
      sentiment: {
        score: (Math.random() - 0.5) * 2,
        confidence: Math.random(),
        label: Math.random() > 0.5 ? 'positive' : 'negative'
      },
      trendingScore: Math.floor(Math.random() * 100),
      platforms: {
        reddit: { score: Math.random(), mentions: Math.floor(Math.random() * 100) },
        twitter: { score: Math.random(), mentions: Math.floor(Math.random() * 200) },
        stocktwits: { score: Math.random(), mentions: Math.floor(Math.random() * 50) }
      }
    };
  }

  private extractKeyPhrases(text: string): string[] {
    // Simplified key phrase extraction
    const words = text.split(' ').filter(word => word.length > 4);
    const phrases: string[] = [];
    
    for (let i = 0; i < words.length - 1; i++) {
      if (words[i] && words[i + 1]) {
        phrases.push(`${words[i]} ${words[i + 1]}`);
      }
    }
    
    return phrases.slice(0, 5);
  }

  private simulateAIConfidence(text: string, sentimentScore: number): number {
    // Simulate AI model confidence based on text complexity and sentiment clarity
    const textComplexity = text.split(' ').length / 100;
    const sentimentClarity = Math.abs(sentimentScore);
    return Math.min(0.95, 0.5 + (sentimentClarity * 0.3) + (textComplexity * 0.2));
  }

  private extractTimeFrame(text: string): string {
    const timeFrames = {
      'immediate': ['today', 'now', 'immediate', 'urgent'],
      'short-term': ['week', 'month', 'quarter', 'soon'],
      'long-term': ['year', 'annual', 'future', 'long-term']
    };
    
    for (const [frame, keywords] of Object.entries(timeFrames)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return frame;
      }
    }
    
    return 'unspecified';
  }

  private getHistoricalContext(symbol?: string): string {
    // Simplified historical context (would be enhanced with actual historical data)
    if (!symbol) return 'No historical data available';
    return `${symbol} has maintained dividend payments for multiple years`;
  }

  private determineTimeHorizon(text: string): MarketImpact['timeHorizon'] {
    if (text.includes('immediate') || text.includes('today') || text.includes('now')) {
      return 'immediate';
    }
    if (text.includes('week') || text.includes('month') || text.includes('quarter')) {
      return 'short-term';
    }
    return 'long-term';
  }

  private getRiskScore(article: NewsArticle): number {
    if (!article.dividendSafetyAlert) return 0;
    
    const riskScores = { low: 1, medium: 2, high: 3, critical: 4 };
    return riskScores[article.dividendSafetyAlert.riskLevel] * article.dividendSafetyAlert.confidence;
  }
}

export const newsService = new NewsService(); 