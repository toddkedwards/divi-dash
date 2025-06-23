// Phase 3: Advanced Real-time Alerts Service
// Comprehensive notification system for dividend events, price movements, and portfolio changes

export interface Alert {
  id: string;
  type: 'price' | 'dividend' | 'news' | 'rebalance' | 'risk' | 'opportunity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  symbol?: string;
  targetValue?: number;
  currentValue?: number;
  change?: number;
  changePercent?: number;
  timestamp: Date;
  isRead: boolean;
  actionable: boolean;
  actions?: AlertAction[];
  expiresAt?: Date;
}

export interface AlertAction {
  id: string;
  label: string;
  type: 'buy' | 'sell' | 'rebalance' | 'research' | 'dismiss';
  icon: string;
}

export interface AlertRule {
  id: string;
  name: string;
  type: Alert['type'];
  conditions: AlertCondition[];
  isActive: boolean;
  createdAt: Date;
  triggeredCount: number;
  lastTriggered?: Date;
}

export interface AlertCondition {
  field: string;
  operator: 'gt' | 'lt' | 'eq' | 'change_gt' | 'change_lt';
  value: number;
  timeframe?: '1d' | '1w' | '1m' | '3m';
}

export interface AlertSettings {
  enablePushNotifications: boolean;
  enableEmailNotifications: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  severityFilter: Alert['severity'][];
  typeFilter: Alert['type'][];
  maxAlertsPerDay: number;
}

class AlertsService {
  private static instance: AlertsService;
  private alerts: Alert[] = [];
  private rules: AlertRule[] = [];
  private settings: AlertSettings;
  private subscribers: ((alert: Alert) => void)[] = [];

  constructor() {
    this.settings = this.getDefaultSettings();
    this.initializeDefaultRules();
    this.startMonitoring();
  }

  static getInstance(): AlertsService {
    if (!AlertsService.instance) {
      AlertsService.instance = new AlertsService();
    }
    return AlertsService.instance;
  }

  // Alert Management
  getAlerts(filters?: { 
    unreadOnly?: boolean; 
    type?: Alert['type']; 
    severity?: Alert['severity'];
    limit?: number;
  }): Alert[] {
    let filteredAlerts = [...this.alerts];

    if (filters?.unreadOnly) {
      filteredAlerts = filteredAlerts.filter(alert => !alert.isRead);
    }

    if (filters?.type) {
      filteredAlerts = filteredAlerts.filter(alert => alert.type === filters.type);
    }

    if (filters?.severity) {
      filteredAlerts = filteredAlerts.filter(alert => alert.severity === filters.severity);
    }

    // Sort by timestamp (newest first)
    filteredAlerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    if (filters?.limit) {
      filteredAlerts = filteredAlerts.slice(0, filters.limit);
    }

    return filteredAlerts;
  }

  markAsRead(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.isRead = true;
    }
  }

  markAllAsRead(): void {
    this.alerts.forEach(alert => alert.isRead = true);
  }

  dismissAlert(alertId: string): void {
    this.alerts = this.alerts.filter(a => a.id !== alertId);
  }

  // Rule Management
  getRules(): AlertRule[] {
    return [...this.rules];
  }

  addRule(rule: Omit<AlertRule, 'id' | 'createdAt' | 'triggeredCount'>): AlertRule {
    const newRule: AlertRule = {
      ...rule,
      id: `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      triggeredCount: 0
    };

    this.rules.push(newRule);
    return newRule;
  }

  updateRule(ruleId: string, updates: Partial<AlertRule>): boolean {
    const ruleIndex = this.rules.findIndex(r => r.id === ruleId);
    if (ruleIndex >= 0) {
      this.rules[ruleIndex] = { ...this.rules[ruleIndex], ...updates };
      return true;
    }
    return false;
  }

  deleteRule(ruleId: string): boolean {
    const initialLength = this.rules.length;
    this.rules = this.rules.filter(r => r.id !== ruleId);
    return this.rules.length < initialLength;
  }

  // Monitoring
  async checkAlerts(holdings: any[]): Promise<Alert[]> {
    const newAlerts: Alert[] = [];

    for (const holding of holdings) {
      // Price alerts
      const priceAlerts = await this.checkPriceAlerts(holding);
      newAlerts.push(...priceAlerts);

      // Dividend alerts
      const dividendAlerts = await this.checkDividendAlerts(holding);
      newAlerts.push(...dividendAlerts);

      // Volume alerts
      const volumeAlerts = await this.checkVolumeAlerts(holding);
      newAlerts.push(...volumeAlerts);
    }

    // Portfolio-wide alerts
    const portfolioAlerts = await this.checkPortfolioAlerts(holdings);
    newAlerts.push(...portfolioAlerts);

    // Add new alerts
    newAlerts.forEach(alert => this.addAlert(alert));

    return newAlerts;
  }

  private async checkPriceAlerts(holding: any): Promise<Alert[]> {
    const alerts: Alert[] = [];
    const currentPrice = holding.currentPrice;
    const previousPrice = holding.previousPrice || currentPrice;
    const change = currentPrice - previousPrice;
    const changePercent = (change / previousPrice) * 100;

    // Significant price movement
    if (Math.abs(changePercent) >= 5) {
      alerts.push({
        id: `price_${holding.symbol}_${Date.now()}`,
        type: 'price',
        severity: Math.abs(changePercent) >= 10 ? 'high' : 'medium',
        title: `${holding.symbol} Price ${changePercent > 0 ? 'Surge' : 'Drop'}`,
        message: `${holding.symbol} ${changePercent > 0 ? 'gained' : 'lost'} ${Math.abs(changePercent).toFixed(2)}% (${change > 0 ? '+' : ''}$${change.toFixed(2)})`,
        symbol: holding.symbol,
        currentValue: currentPrice,
        change,
        changePercent,
        timestamp: new Date(),
        isRead: false,
        actionable: true,
        actions: [
          { id: 'research', label: 'Research', type: 'research', icon: '🔍' },
          { id: 'buy_more', label: 'Buy More', type: 'buy', icon: '📈' },
          { id: 'sell_some', label: 'Take Profits', type: 'sell', icon: '💰' }
        ]
      });
    }

    // Check custom price rules
    const priceRules = this.rules.filter(rule => 
      rule.type === 'price' && 
      rule.isActive
    );

    for (const rule of priceRules) {
      if (this.evaluateConditions(rule.conditions, { 
        price: currentPrice, 
        change: changePercent,
        symbol: holding.symbol 
      })) {
        alerts.push(this.createRuleAlert(rule, holding));
      }
    }

    return alerts;
  }

  private async checkDividendAlerts(holding: any): Promise<Alert[]> {
    const alerts: Alert[] = [];

    // Mock dividend announcements
    if (Math.random() < 0.1) { // 10% chance for demo
      const dividendAmount = 0.25 + Math.random() * 2; // $0.25 - $2.25
      alerts.push({
        id: `dividend_${holding.symbol}_${Date.now()}`,
        type: 'dividend',
        severity: 'medium',
        title: `${holding.symbol} Dividend Announcement`,
        message: `${holding.symbol} declared a quarterly dividend of $${dividendAmount.toFixed(2)} per share`,
        symbol: holding.symbol,
        currentValue: dividendAmount,
        timestamp: new Date(),
        isRead: false,
        actionable: true,
        actions: [
          { id: 'calculate_income', label: 'Calculate Income', type: 'research', icon: '🧮' },
          { id: 'add_calendar', label: 'Add to Calendar', type: 'research', icon: '📅' }
        ]
      });
    }

    return alerts;
  }

  private async checkVolumeAlerts(holding: any): Promise<Alert[]> {
    const alerts: Alert[] = [];

    // Mock unusual volume
    if (Math.random() < 0.05) { // 5% chance for demo
      const volumeIncrease = 150 + Math.random() * 300; // 150-450% increase
      alerts.push({
        id: `volume_${holding.symbol}_${Date.now()}`,
        type: 'news',
        severity: 'medium',
        title: `${holding.symbol} Unusual Volume`,
        message: `${holding.symbol} trading volume is ${volumeIncrease.toFixed(0)}% above average`,
        symbol: holding.symbol,
        timestamp: new Date(),
        isRead: false,
        actionable: true,
        actions: [
          { id: 'check_news', label: 'Check News', type: 'research', icon: '📰' },
          { id: 'analyze', label: 'Analyze', type: 'research', icon: '📊' }
        ]
      });
    }

    return alerts;
  }

  private async checkPortfolioAlerts(holdings: any[]): Promise<Alert[]> {
    const alerts: Alert[] = [];
    const totalValue = holdings.reduce((sum, h) => sum + (h.shares * h.currentPrice), 0);

    // Portfolio value milestone
    const milestones = [10000, 25000, 50000, 100000, 250000, 500000, 1000000];
    const nearestMilestone = milestones.find(m => m > totalValue && m - totalValue < totalValue * 0.05);
    
    if (nearestMilestone) {
      alerts.push({
        id: `milestone_${Date.now()}`,
        type: 'opportunity',
        severity: 'low',
        title: 'Portfolio Milestone Approaching',
        message: `Your portfolio is approaching $${nearestMilestone.toLocaleString()}! Currently at $${totalValue.toLocaleString()}`,
        currentValue: totalValue,
        targetValue: nearestMilestone,
        timestamp: new Date(),
        isRead: false,
        actionable: false
      });
    }

    // Rebalancing alert
    if (Math.random() < 0.2) { // 20% chance for demo
      alerts.push({
        id: `rebalance_${Date.now()}`,
        type: 'rebalance',
        severity: 'medium',
        title: 'Portfolio Rebalancing Suggested',
        message: 'Your portfolio allocation has drifted from target. Consider rebalancing.',
        timestamp: new Date(),
        isRead: false,
        actionable: true,
        actions: [
          { id: 'view_allocation', label: 'View Allocation', type: 'research', icon: '📊' },
          { id: 'rebalance_now', label: 'Rebalance', type: 'rebalance', icon: '⚖️' }
        ]
      });
    }

    return alerts;
  }

  private evaluateConditions(conditions: AlertCondition[], data: any): boolean {
    return conditions.every(condition => {
      const value = data[condition.field];
      
      switch (condition.operator) {
        case 'gt': return value > condition.value;
        case 'lt': return value < condition.value;
        case 'eq': return value === condition.value;
        case 'change_gt': return data.change > condition.value;
        case 'change_lt': return data.change < condition.value;
        default: return false;
      }
    });
  }

  private createRuleAlert(rule: AlertRule, holding: any): Alert {
    rule.triggeredCount++;
    rule.lastTriggered = new Date();

    return {
      id: `rule_${rule.id}_${Date.now()}`,
      type: rule.type,
      severity: 'medium',
      title: rule.name,
      message: `Custom alert triggered for ${holding.symbol}`,
      symbol: holding.symbol,
      timestamp: new Date(),
      isRead: false,
      actionable: true
    };
  }

  private addAlert(alert: Alert): void {
    // Check if within quiet hours
    if (this.isQuietHours()) {
      alert.severity = 'low'; // Reduce severity during quiet hours
    }

    // Check daily limit
    const today = new Date().toDateString();
    const todayAlerts = this.alerts.filter(a => a.timestamp.toDateString() === today);
    
    if (todayAlerts.length >= this.settings.maxAlertsPerDay) {
      return; // Skip if daily limit reached
    }

    this.alerts.unshift(alert);
    
    // Notify subscribers
    this.subscribers.forEach(callback => callback(alert));

    // Auto-expire old alerts
    this.cleanupExpiredAlerts();
  }

  private isQuietHours(): boolean {
    if (!this.settings.quietHours.enabled) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const start = this.parseTime(this.settings.quietHours.start);
    const end = this.parseTime(this.settings.quietHours.end);

    if (start <= end) {
      return currentTime >= start && currentTime <= end;
    } else {
      return currentTime >= start || currentTime <= end;
    }
  }

  private parseTime(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private cleanupExpiredAlerts(): void {
    const now = new Date();
    this.alerts = this.alerts.filter(alert => 
      !alert.expiresAt || alert.expiresAt > now
    );

    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(0, 100);
    }
  }

  // Settings
  getSettings(): AlertSettings {
    return { ...this.settings };
  }

  updateSettings(updates: Partial<AlertSettings>): void {
    this.settings = { ...this.settings, ...updates };
  }

  // Subscription
  subscribe(callback: (alert: Alert) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index >= 0) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  // Monitoring
  private startMonitoring(): void {
    // Check for alerts every 5 minutes
    setInterval(() => {
      // In a real app, this would check actual portfolio data
      console.log('Checking for alerts...');
    }, 5 * 60 * 1000);
  }

  private getDefaultSettings(): AlertSettings {
    return {
      enablePushNotifications: true,
      enableEmailNotifications: false,
      quietHours: {
        enabled: true,
        start: '22:00',
        end: '07:00'
      },
      severityFilter: ['medium', 'high', 'critical'],
      typeFilter: ['price', 'dividend', 'news', 'rebalance', 'risk'],
      maxAlertsPerDay: 20
    };
  }

  private initializeDefaultRules(): void {
    // Default price movement rules
    this.rules = [
      {
        id: 'price_drop_10',
        name: 'Significant Price Drop',
        type: 'price',
        conditions: [
          { field: 'change', operator: 'change_lt', value: -10 }
        ],
        isActive: true,
        createdAt: new Date(),
        triggeredCount: 0
      },
      {
        id: 'price_gain_15',
        name: 'Strong Price Gain',
        type: 'price',
        conditions: [
          { field: 'change', operator: 'change_gt', value: 15 }
        ],
        isActive: true,
        createdAt: new Date(),
        triggeredCount: 0
      }
    ];
  }

  // Utility methods for generating demo alerts
  generateDemoAlerts(): void {
    const demoAlerts: Alert[] = [
      {
        id: 'demo_1',
        type: 'price',
        severity: 'high',
        title: 'AAPL Strong Performance',
        message: 'Apple Inc. gained 8.5% following strong quarterly earnings',
        symbol: 'AAPL',
        currentValue: 182.50,
        change: 14.25,
        changePercent: 8.5,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isRead: false,
        actionable: true,
        actions: [
          { id: 'research', label: 'Research', type: 'research', icon: '🔍' },
          { id: 'take_profits', label: 'Take Profits', type: 'sell', icon: '💰' }
        ]
      },
      {
        id: 'demo_2',
        type: 'dividend',
        severity: 'medium',
        title: 'KO Dividend Increase',
        message: 'Coca-Cola increased quarterly dividend by 4% to $0.46 per share',
        symbol: 'KO',
        currentValue: 0.46,
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        isRead: false,
        actionable: true,
        actions: [
          { id: 'calculate_income', label: 'Calculate Income', type: 'research', icon: '🧮' }
        ]
      },
      {
        id: 'demo_3',
        type: 'rebalance',
        severity: 'medium',
        title: 'Portfolio Rebalancing Needed',
        message: 'Technology sector is now 45% of portfolio, above 40% target',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        isRead: true,
        actionable: true,
        actions: [
          { id: 'rebalance', label: 'Rebalance Now', type: 'rebalance', icon: '⚖️' }
        ]
      }
    ];

    demoAlerts.forEach(alert => this.alerts.push(alert));
  }
}

export default AlertsService; 