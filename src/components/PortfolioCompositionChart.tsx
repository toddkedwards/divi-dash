'use client';

import React, { useState, useMemo } from 'react';
import {
  PieChart,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  Filter,
  Download,
  RefreshCw,
  Info
} from 'lucide-react';

interface Holding {
  symbol: string;
  name: string;
  shares: number;
  currentPrice: number;
  marketValue: number;
  sector: string;
  weight: number;
  dayChange: number;
  dayChangePercent: number;
  dividendYield: number;
  marketCap: string;
  country: string;
}

interface PortfolioCompositionChartProps {
  holdings: Holding[];
  totalValue: number;
  className?: string;
}

interface SectorData {
  sector: string;
  value: number;
  weight: number;
  holdings: Holding[];
  performance: number;
  color: string;
}

interface CountryData {
  country: string;
  value: number;
  weight: number;
  holdings: Holding[];
  color: string;
}

interface MarketCapData {
  category: string;
  value: number;
  weight: number;
  holdings: Holding[];
  color: string;
}

export default function PortfolioCompositionChart({ 
  holdings, 
  totalValue, 
  className = '' 
}: PortfolioCompositionChartProps) {
  const [viewType, setViewType] = useState<'sector' | 'holdings' | 'country' | 'marketCap'>('sector');
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

  // Color palettes for different chart types
  const sectorColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#06B6D4', '#F97316', '#84CC16', '#EC4899', '#6B7280'
  ];

  const countryColors = [
    '#1E40AF', '#DC2626', '#059669', '#D97706', '#7C3AED',
    '#0891B2', '#EA580C', '#65A30D', '#DB2777', '#4B5563'
  ];

  const marketCapColors = [
    '#2563EB', '#DC2626', '#059669', '#D97706'
  ];

  // Process data by sector
  const sectorData = useMemo(() => {
    const sectorMap = new Map<string, SectorData>();
    
    holdings.forEach((holding, index) => {
      const sector = holding.sector || 'Other';
      const existing = sectorMap.get(sector);
      
      if (existing) {
        existing.value += holding.marketValue;
        existing.weight += holding.weight;
        existing.holdings.push(holding);
        existing.performance = (existing.performance + holding.dayChangePercent) / 2;
      } else {
        sectorMap.set(sector, {
          sector,
          value: holding.marketValue,
          weight: holding.weight,
          holdings: [holding],
          performance: holding.dayChangePercent,
          color: sectorColors[index % sectorColors.length]
        });
      }
    });
    
    return Array.from(sectorMap.values()).sort((a, b) => b.value - a.value);
  }, [holdings]);

  // Process data by country
  const countryData = useMemo(() => {
    const countryMap = new Map<string, CountryData>();
    
    holdings.forEach((holding, index) => {
      const country = holding.country || 'Unknown';
      const existing = countryMap.get(country);
      
      if (existing) {
        existing.value += holding.marketValue;
        existing.weight += holding.weight;
        existing.holdings.push(holding);
      } else {
        countryMap.set(country, {
          country,
          value: holding.marketValue,
          weight: holding.weight,
          holdings: [holding],
          color: countryColors[index % countryColors.length]
        });
      }
    });
    
    return Array.from(countryMap.values()).sort((a, b) => b.value - a.value);
  }, [holdings]);

  // Process data by market cap
  const marketCapData = useMemo(() => {
    const getMarketCapCategory = (marketCap: string) => {
      if (!marketCap || typeof marketCap !== 'string') {
        return 'Small Cap (<$10B)';
      }
      const capValue = parseFloat(marketCap.replace(/[^\d.]/g, ''));
      if (marketCap.includes('B')) {
        if (capValue >= 200) return 'Large Cap (>$200B)';
        if (capValue >= 10) return 'Mid Cap ($10B-$200B)';
        return 'Small Cap (<$10B)';
      }
      return 'Small Cap (<$10B)';
    };
    
    const marketCapMap = new Map<string, MarketCapData>();
    
    holdings.forEach((holding, index) => {
      const category = getMarketCapCategory(holding.marketCap);
      const existing = marketCapMap.get(category);
      
      if (existing) {
        existing.value += holding.marketValue;
        existing.weight += holding.weight;
        existing.holdings.push(holding);
      } else {
        marketCapMap.set(category, {
          category,
          value: holding.marketValue,
          weight: holding.weight,
          holdings: [holding],
          color: marketCapColors[index % marketCapColors.length]
        });
      }
    });
    
    return Array.from(marketCapMap.values()).sort((a, b) => b.value - a.value);
  }, [holdings]);

  // Process individual holdings data
  const holdingsData = useMemo(() => {
    return holdings
      .map((holding, index) => ({
        ...holding,
        color: sectorColors[index % sectorColors.length]
      }))
      .sort((a, b) => b.marketValue - a.marketValue);
  }, [holdings]);

  const getCurrentData = () => {
    switch (viewType) {
      case 'sector': return sectorData;
      case 'country': return countryData;
      case 'marketCap': return marketCapData;
      case 'holdings': return holdingsData.slice(0, 10); // Top 10 holdings
      default: return sectorData;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // SVG Pie Chart Component
  const PieChartSVG = ({ data }: { data: any[] }) => {
    const radius = 100;
    const centerX = 120;
    const centerY = 120;
    
    let cumulativePercentage = 0;
    
    return (
      <svg width="240" height="240" viewBox="0 0 240 240">
        {data.map((item, index) => {
          const percentage = viewType === 'holdings' ? item.weight : (item.weight || (item.value / totalValue) * 100);
          const startAngle = (cumulativePercentage / 100) * 360;
          const endAngle = ((cumulativePercentage + percentage) / 100) * 360;
          
          const startAngleRad = (startAngle - 90) * (Math.PI / 180);
          const endAngleRad = (endAngle - 90) * (Math.PI / 180);
          
          const largeArcFlag = percentage > 50 ? 1 : 0;
          
          const x1 = centerX + radius * Math.cos(startAngleRad);
          const y1 = centerY + radius * Math.sin(startAngleRad);
          const x2 = centerX + radius * Math.cos(endAngleRad);
          const y2 = centerY + radius * Math.sin(endAngleRad);
          
          const pathData = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z'
          ].join(' ');
          
          cumulativePercentage += percentage;
          
          const isHovered = hoveredSegment === (item.sector || item.country || item.category || item.symbol);
          const isSelected = selectedSegment === (item.sector || item.country || item.category || item.symbol);
          
          return (
            <path
              key={index}
              d={pathData}
              fill={item.color}
              stroke="white"
              strokeWidth="2"
              opacity={isHovered || isSelected ? 1 : 0.8}
              className="cursor-pointer transition-all duration-200"
              style={{
                transform: isHovered || isSelected ? 'scale(1.05)' : 'scale(1)',
                transformOrigin: `${centerX}px ${centerY}px`
              }}
              onMouseEnter={() => setHoveredSegment(item.sector || item.country || item.category || item.symbol)}
              onMouseLeave={() => setHoveredSegment(null)}
              onClick={() => setSelectedSegment(
                selectedSegment === (item.sector || item.country || item.category || item.symbol) 
                  ? null 
                  : (item.sector || item.country || item.category || item.symbol)
              )}
            />
          );
        })}
        
        {/* Center label */}
        <text x={centerX} y={centerY - 5} textAnchor="middle" className="text-sm font-medium fill-gray-700">
          Total
        </text>
        <text x={centerX} y={centerY + 10} textAnchor="middle" className="text-xs fill-gray-600">
          {formatCurrency(totalValue)}
        </text>
      </svg>
    );
  };

  const currentData = getCurrentData();

  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Portfolio Composition</h3>
            <p className="text-sm text-gray-600">
              Asset allocation breakdown • {holdings.length} holdings
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title={isExpanded ? 'Minimize' : 'Maximize'}
            >
              {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Type Selector */}
        <div className="mt-4 flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'sector', label: 'By Sector', icon: PieChart },
            { id: 'holdings', label: 'Top Holdings', icon: BarChart3 },
            { id: 'country', label: 'By Country', icon: Eye },
            { id: 'marketCap', label: 'By Size', icon: TrendingUp }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setViewType(tab.id as any)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors text-sm ${
                viewType === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className={`grid ${isExpanded ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'} gap-6`}>
          {/* Chart */}
          <div className="flex items-center justify-center">
            <div className="relative">
              <PieChartSVG data={currentData} />
              
              {/* Hover tooltip */}
              {hoveredSegment && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap z-10">
                  {hoveredSegment}
                </div>
              )}
            </div>
          </div>

          {/* Legend and Details */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">
              {viewType === 'sector' && 'Sector Allocation'}
              {viewType === 'holdings' && 'Top Holdings'}
              {viewType === 'country' && 'Geographic Allocation'}
              {viewType === 'marketCap' && 'Market Cap Allocation'}
            </h4>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {currentData.map((item, index) => {
                const label = item.sector || item.country || item.category || item.symbol;
                const percentage = viewType === 'holdings' ? item.weight : (item.weight || (item.value / totalValue) * 100);
                const value = item.marketValue || item.value;
                const isSelected = selectedSegment === label;
                const isHovered = hoveredSegment === label;

                return (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                      isSelected || isHovered ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onMouseEnter={() => setHoveredSegment(label)}
                    onMouseLeave={() => setHoveredSegment(null)}
                    onClick={() => setSelectedSegment(isSelected ? null : label)}
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{label}</p>
                        
                        {viewType === 'holdings' && (
                          <div className="flex items-center space-x-2 text-xs text-gray-600">
                            <span>{item.shares} shares</span>
                            <span>•</span>
                            <span>{item.sector}</span>
                            {item.dayChangePercent !== undefined && (
                              <>
                                <span>•</span>
                                <span className={item.dayChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}>
                                  {item.dayChangePercent >= 0 ? '+' : ''}{formatPercentage(item.dayChangePercent)}
                                </span>
                              </>
                            )}
                          </div>
                        )}
                        
                        {viewType === 'sector' && item.holdings && (
                          <p className="text-xs text-gray-600">
                            {item.holdings.length} holdings
                            {item.performance !== undefined && (
                              <span className={`ml-2 ${item.performance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {item.performance >= 0 ? '+' : ''}{formatPercentage(item.performance)}
                              </span>
                            )}
                          </p>
                        )}
                        
                        {(viewType === 'country' || viewType === 'marketCap') && item.holdings && (
                          <p className="text-xs text-gray-600">
                            {item.holdings.length} holdings
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right flex-shrink-0">
                      <p className="font-medium text-gray-900">
                        {formatPercentage(percentage)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(value)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Segment Details */}
            {selectedSegment && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h5 className="font-medium text-blue-900 mb-2">{selectedSegment} Details</h5>
                
                {viewType === 'sector' && (
                  <div className="space-y-2">
                    {sectorData.find(s => s.sector === selectedSegment)?.holdings.map((holding) => (
                      <div key={holding.symbol} className="flex justify-between text-sm">
                        <span className="text-blue-800">{holding.symbol}</span>
                        <span className="text-blue-700">{formatPercentage(holding.weight)}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {viewType === 'country' && (
                  <div className="space-y-2">
                    {countryData.find(c => c.country === selectedSegment)?.holdings.map((holding) => (
                      <div key={holding.symbol} className="flex justify-between text-sm">
                        <span className="text-blue-800">{holding.symbol}</span>
                        <span className="text-blue-700">{formatPercentage(holding.weight)}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {viewType === 'marketCap' && (
                  <div className="space-y-2">
                    {marketCapData.find(m => m.category === selectedSegment)?.holdings.map((holding) => (
                      <div key={holding.symbol} className="flex justify-between text-sm">
                        <span className="text-blue-800">{holding.symbol}</span>
                        <span className="text-blue-700">{formatPercentage(holding.weight)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Holdings</p>
              <p className="text-lg font-bold text-gray-900">{holdings.length}</p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {viewType === 'sector' ? 'Sectors' : 
                 viewType === 'country' ? 'Countries' :
                 viewType === 'marketCap' ? 'Categories' : 'Showing'}
              </p>
              <p className="text-lg font-bold text-gray-900">{currentData.length}</p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">Largest Allocation</p>
              <p className="text-lg font-bold text-gray-900">
                {formatPercentage(
                  viewType === 'holdings' 
                    ? currentData[0]?.weight || 0 
                    : ((currentData[0]?.value || 0) / totalValue) * 100
                )}
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">Portfolio Value</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(totalValue)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 