import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { symbols } = req.query;
  
  if (!symbols) {
    return res.status(400).json({ error: 'Symbols parameter is required' });
  }

  const symbolArray = Array.isArray(symbols) ? symbols : symbols.split(',');
  
  try {
    const quotes = await Promise.all(
      symbolArray.map(async (symbol) => {
        try {
          const response = await fetch(
            `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`,
            {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
              }
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          if (data.chart?.result?.[0]) {
            const result = data.chart.result[0];
            const meta = result.meta;
            const indicators = result.indicators.quote[0];
            
            const currentPrice = meta.regularMarketPrice;
            const previousClose = meta.previousClose;
            const change = currentPrice - previousClose;
            const changePercent = (change / previousClose) * 100;

            return {
              symbol: symbol.toUpperCase(),
              currentPrice,
              change,
              changePercent,
              previousClose,
              open: indicators.open[0] || currentPrice,
              high: indicators.high[0] || currentPrice,
              low: indicators.low[0] || currentPrice,
              volume: indicators.volume[0] || 0,
              marketCap: meta.marketCap,
              peRatio: meta.trailingPE,
              dividendYield: meta.trailingAnnualDividendYield,
              lastUpdated: new Date()
            };
          }
          return null;
        } catch (error) {
          console.error(`Error fetching quote for ${symbol}:`, error);
          return null;
        }
      })
    );

    const validQuotes = quotes.filter(Boolean);
    
    res.status(200).json({
      success: true,
      quotes: validQuotes,
      count: validQuotes.length,
      total: symbolArray.length
    });
  } catch (error) {
    console.error('Stock quotes API error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch stock quotes',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 