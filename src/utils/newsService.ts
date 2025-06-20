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
}

export interface SentimentScore {
  score: number; // -1 to 1 (negative to positive)
  confidence: number; // 0 to 1
  label: 'negative' | 'neutral' | 'positive';
  reasoning?: string;
}

export interface NewsCategory {
  primary: string;
  secondary?: string;
  tags: string[];
}

export interface MarketSentiment {
  overall: SentimentScore;
  bySymbol: Record<string, SentimentScore>;
  trendingTopics: string[];
  dividendSentiment: SentimentScore;
}

const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

// Dividend-related keywords for filtering
const DIVIDEND_KEYWORDS = [
  'dividend', 'dividends', 'payout', 'yield', 'distribution', 'quarterly payment',
  'ex-dividend', 'record date', 'payment date', 'dividend increase', 'dividend cut',
  'dividend suspension', 'dividend growth', 'dividend aristocrat', 'dividend king',
  'special dividend', 'dividend reinvestment', 'drip', 'income', 'shareholder return'
];

// Sentiment analysis keywords
const POSITIVE_KEYWORDS = [
  'increase', 'raised', 'boost', 'growth', 'strong', 'beat', 'exceed', 'outperform',
  'bullish', 'optimistic', 'record', 'milestone', 'success', 'improvement', 'expansion',
  'profitable', 'revenue growth', 'earnings beat', 'upgraded'
];

const NEGATIVE_KEYWORDS = [
  'cut', 'reduce', 'suspend', 'eliminate', 'decline', 'drop', 'fall', 'miss',
  'disappoint', 'bearish', 'pessimistic', 'loss', 'downgrade', 'concern', 'risk',
  'uncertainty', 'volatility', 'recession', 'crisis', 'bankruptcy'
];

class NewsService {
  private cache = new Map<string, { data: NewsArticle[]; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

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
    return rawNews.map(article => {
      const processed: NewsArticle = {
        id: `${article.datetime}-${article.headline?.slice(0, 20)}`,
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
}

export const newsService = new NewsService(); 