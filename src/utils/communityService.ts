// Community Service for Phase 4: Social Platform Features
// Comprehensive forums, discussions, and social interaction management

export interface User {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  joinDate: Date;
  reputation: number;
  badgeCount: number;
  postCount: number;
  followersCount: number;
  followingCount: number;
  isVerified: boolean;
  isPro: boolean;
  location?: string;
  bio?: string;
  specialties: string[];
  portfolioPublic: boolean;
}

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  topicsCount: number;
  postsCount: number;
  lastActivity: Date;
  moderatorIds: string[];
  color: string;
  order: number;
  isPrivate: boolean;
}

export interface ForumTopic {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  authorId: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
  lastReplyAt: Date;
  repliesCount: number;
  viewsCount: number;
  upvotes: number;
  downvotes: number;
  isSticky: boolean;
  isLocked: boolean;
  isFeatured: boolean;
  tags: string[];
  relatedStocks: string[];
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

export interface ForumPost {
  id: string;
  topicId: string;
  authorId: string;
  author: User;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  parentPostId?: string;
  replyToUserId?: string;
  upvotes: number;
  downvotes: number;
  isEdited: boolean;
  attachments: Attachment[];
  mentionedUsers: string[];
  quotedPostId?: string;
  reactionCounts: { [emoji: string]: number };
  isModerator: boolean;
  isSolution: boolean;
}

export interface EditHistory {
  editedAt: Date;
  previousContent: string;
  reason?: string;
}

export interface Attachment {
  id: string;
  type: 'image' | 'file' | 'chart' | 'portfolio_screenshot';
  url: string;
  filename: string;
  size: number;
  thumbnailUrl?: string;
}

export interface PortfolioShare {
  id: string;
  userId: string;
  user: User;
  title: string;
  description: string;
  shareType: 'public' | 'friends' | 'followers';
  createdAt: Date;
  updatedAt: Date;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  portfolioSnapshot: PortfolioSnapshot;
  performanceMetrics: ShareableMetrics;
  commentary?: string;
  tags: string[];
  category: 'dividend_growth' | 'value' | 'growth' | 'balanced' | 'conservative' | 'aggressive';
}

export interface PortfolioSnapshot {
  totalValue: number;
  positionsCount: number;
  topHoldings: { symbol: string; name: string; weight: number; }[];
  sectorAllocation: { sector: string; percentage: number; }[];
  dividendYield: number;
  beta: number;
  peRatio: number;
  payoutRatio: number;
  snapshotDate: Date;
}

export interface ShareableMetrics {
  oneMonthReturn: number;
  threeMonthReturn: number;
  sixMonthReturn: number;
  oneYearReturn: number;
  threeYearReturn: number;
  totalReturn: number;
  dividendIncome: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  volatility: number;
}

export interface UserInteraction {
  userId: string;
  targetId: string;
  targetType: 'topic' | 'post' | 'portfolio' | 'user';
  interactionType: 'like' | 'upvote' | 'downvote' | 'follow' | 'bookmark' | 'share' | 'report';
  timestamp: Date;
  metadata?: any;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'reply' | 'mention' | 'follow' | 'like' | 'upvote' | 'new_topic' | 'portfolio_update' | 'achievement';
  title: string;
  message: string;
  fromUserId?: string;
  fromUser?: User;
  relatedId: string;
  relatedType: 'topic' | 'post' | 'portfolio' | 'user';
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'participation' | 'quality' | 'popularity' | 'portfolio' | 'consistency' | 'milestone';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  pointsValue: number;
  requirements: AchievementRequirement[];
}

export interface AchievementRequirement {
  type: 'post_count' | 'upvotes_received' | 'portfolio_return' | 'streak_days' | 'helpful_answers';
  threshold: number;
  timeframe?: 'day' | 'week' | 'month' | 'year' | 'all_time';
}

export interface UserAchievement {
  userId: string;
  achievementId: string;
  achievement: Achievement;
  earnedAt: Date;
  progress: number;
  isUnlocked: boolean;
}

export interface CommunityStats {
  totalUsers: number;
  activeUsers24h: number;
  activeUsers7d: number;
  totalTopics: number;
  totalPosts: number;
  totalPortfolioShares: number;
  avgReputationScore: number;
  topContributors: User[];
  trendingTopics: ForumTopic[];
  featuredPortfolios: PortfolioShare[];
}

export interface ActivityFeed {
  id: string;
  type: 'new_topic' | 'new_post' | 'portfolio_share' | 'achievement_earned' | 'user_joined';
  userId: string;
  user: User;
  timestamp: Date;
  content: string;
  relatedId?: string;
  relatedType?: string;
  metadata?: any;
}

export interface SearchResult {
  type: 'topic' | 'post' | 'user' | 'portfolio';
  id: string;
  title: string;
  excerpt: string;
  relevanceScore: number;
  author?: User;
  createdAt: Date;
  category?: string;
  tags?: string[];
}

export interface ModerationAction {
  id: string;
  moderatorId: string;
  moderator: User;
  targetId: string;
  targetType: 'topic' | 'post' | 'user';
  actionType: 'warning' | 'hide' | 'delete' | 'ban' | 'lock' | 'sticky' | 'feature';
  reason: string;
  duration?: number; // in hours
  timestamp: Date;
  isReversible: boolean;
  notes?: string;
}

export interface CommunityAnalytics {
  engagementMetrics: {
    dailyActiveUsers: number[];
    postsPerDay: number[];
    topicsPerDay: number[];
    averageResponseTime: number;
    userRetentionRate: number;
  };
  contentMetrics: {
    mostPopularCategories: { name: string; count: number; }[];
    averagePostLength: number;
    mostUsedTags: { tag: string; count: number; }[];
    sentiment: { positive: number; neutral: number; negative: number; };
  };
  userMetrics: {
    newUsersPerDay: number[];
    averageReputationGrowth: number;
    topContributorsByCategory: { [category: string]: User[] };
    userActivityDistribution: { [timeSlot: string]: number };
  };
}

export interface CommunityPost {
  id: string;
  authorId: string;
  author: {
    name: string;
    avatar: string;
    badge: 'rookie' | 'pro' | 'expert' | 'legend';
    verified: boolean;
    followers: number;
    portfolioValue?: number;
    joinDate: Date;
  };
  content: string;
  type: 'discussion' | 'analysis' | 'tip' | 'question' | 'milestone' | 'portfolio_share';
  timestamp: Date;
  likes: number;
  dislikes: number;
  comments: CommunityComment[];
  shares: number;
  bookmarks: number;
  views: number;
  tags: string[];
  category: 'general' | 'dividend_stocks' | 'reits' | 'etfs' | 'strategy' | 'analysis' | 'beginner';
  attachments?: PostAttachment[];
  isEdited: boolean;
  isPinned: boolean;
  isFeatured: boolean;
  moderationStatus: 'approved' | 'pending' | 'flagged' | 'removed';
  reactions: { [emoji: string]: number };
}

export interface CommunityComment {
  id: string;
  postId: string;
  authorId: string;
  author: {
    name: string;
    avatar: string;
    badge: 'rookie' | 'pro' | 'expert' | 'legend';
    verified: boolean;
  };
  content: string;
  timestamp: Date;
  likes: number;
  replies: CommunityReply[];
  isEdited: boolean;
  parentCommentId?: string;
}

export interface CommunityReply {
  id: string;
  commentId: string;
  authorId: string;
  author: {
    name: string;
    avatar: string;
    badge: 'rookie' | 'pro' | 'expert' | 'legend';
  };
  content: string;
  timestamp: Date;
  likes: number;
}

export interface PostAttachment {
  id: string;
  type: 'portfolio' | 'chart' | 'analysis' | 'image' | 'document' | 'spreadsheet';
  title: string;
  description?: string;
  url?: string;
  data: any;
  thumbnailUrl?: string;
}

export interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  type: 'monthly' | 'weekly' | 'quarterly' | 'special' | 'seasonal';
  category: 'portfolio' | 'research' | 'education' | 'engagement' | 'achievement';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  reward: {
    type: 'badge' | 'credit' | 'subscription' | 'feature' | 'recognition';
    value: string;
    amount?: number;
  };
  criteria: ChallengeCriteria[];
  participants: ChallengeParticipant[];
  startDate: Date;
  endDate: Date;
  maxParticipants?: number;
  progress?: number;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  rules: string[];
  prizes: ChallengePrize[];
  sponsoredBy?: string;
}

export interface ChallengeCriteria {
  id: string;
  description: string;
  type: 'post_count' | 'portfolio_value' | 'consistency' | 'engagement' | 'research_quality';
  target: number;
  unit: string;
  weight: number;
}

export interface ChallengeParticipant {
  userId: string;
  joinDate: Date;
  progress: { [criteriaId: string]: number };
  completed: boolean;
  rank?: number;
  submission?: any;
}

export interface ChallengePrize {
  rank: number;
  description: string;
  value: string;
  claimed: boolean;
  claimedBy?: string;
}

export interface CommunityMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  badge: 'rookie' | 'pro' | 'expert' | 'legend';
  verified: boolean;
  joinDate: Date;
  lastActive: Date;
  bio?: string;
  location?: string;
  website?: string;
  
  // Portfolio & Investment Info
  portfolioValue?: number;
  dividendIncome?: number;
  investmentStrategy?: string[];
  favoriteStocks?: string[];
  riskTolerance?: 'conservative' | 'moderate' | 'aggressive';
  
  // Community Stats
  posts: number;
  comments: number;
  likes: number;
  followers: number;
  following: number;
  reputation: number;
  
  // Achievements
  badges: CommunityBadge[];
  challengesCompleted: number;
  featuredPosts: number;
  
  // Settings
  privacy: {
    showPortfolioValue: boolean;
    showIncome: boolean;
    allowMessages: boolean;
    emailNotifications: boolean;
  };
  
  // Social
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
}

export interface CommunityBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedDate: Date;
  type: 'achievement' | 'participation' | 'milestone' | 'special' | 'moderator';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  category: 'strategy' | 'stock_focus' | 'risk_level' | 'experience' | 'geographic';
  type: 'public' | 'private' | 'invite_only';
  members: number;
  posts: number;
  admins: string[];
  moderators: string[];
  rules: string[];
  tags: string[];
  avatar?: string;
  banner?: string;
  createdDate: Date;
  isOfficial: boolean;
}

export interface SimpleCommunityAnalytics {
  totalMembers: number;
  activeMembers: number;
  newMembersToday: number;
  postsToday: number;
  commentsToday: number;
  totalPosts: number;
  totalComments: number;
  averageEngagement: number;
  topTags: { tag: string; count: number }[];
  membersByBadge: { [badge: string]: number };
  growthMetrics: {
    memberGrowth: number;
    engagementGrowth: number;
    contentGrowth: number;
  };
}

export interface NotificationSettings {
  email: {
    newFollower: boolean;
    postLiked: boolean;
    commentReply: boolean;
    mention: boolean;
    challengeUpdate: boolean;
    weeklyDigest: boolean;
  };
  inApp: {
    newFollower: boolean;
    postLiked: boolean;
    commentReply: boolean;
    mention: boolean;
    challengeUpdate: boolean;
    marketAlert: boolean;
  };
  push: {
    enabled: boolean;
    newFollower: boolean;
    importantUpdates: boolean;
    challengeReminders: boolean;
  };
}

class CommunityService {
  private static instance: CommunityService;
  private posts = new Map<string, CommunityPost>();
  private members = new Map<string, CommunityMember>();
  private challenges = new Map<string, CommunityChallenge>();
  private groups = new Map<string, CommunityGroup>();
  private notifications = new Map<string, any[]>();
  private analytics: CommunityAnalytics | null = null;
  private simpleAnalytics: SimpleCommunityAnalytics | null = null;

  static getInstance(): CommunityService {
    if (!CommunityService.instance) {
      CommunityService.instance = new CommunityService();
    }
    return CommunityService.instance;
  }

  // Posts Management
  async getPosts(filters?: {
    category?: string;
    type?: string;
    sortBy?: 'recent' | 'popular' | 'trending';
    limit?: number;
    offset?: number;
  }): Promise<CommunityPost[]> {
    // Mock implementation - in production would fetch from database
    const mockPosts = this.generateMockPosts();
    let filteredPosts = Array.from(mockPosts.values());

    // Apply filters
    if (filters?.category && filters.category !== 'all') {
      filteredPosts = filteredPosts.filter(post => post.category === filters.category);
    }

    if (filters?.type && filters.type !== 'all') {
      filteredPosts = filteredPosts.filter(post => post.type === filters.type);
    }

    // Apply sorting
    switch (filters?.sortBy) {
      case 'popular':
        filteredPosts.sort((a, b) => (b.likes + b.comments.length) - (a.likes + a.comments.length));
        break;
      case 'trending':
        filteredPosts.sort((a, b) => {
          const aScore = this.calculateTrendingScore(a);
          const bScore = this.calculateTrendingScore(b);
          return bScore - aScore;
        });
        break;
      default:
        filteredPosts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }

    // Apply pagination
    const limit = filters?.limit || 20;
    const offset = filters?.offset || 0;
    return filteredPosts.slice(offset, offset + limit);
  }

  async createPost(postData: Partial<CommunityPost>): Promise<CommunityPost> {
    const post: CommunityPost = {
      id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      authorId: postData.authorId || 'current_user',
      author: postData.author || this.generateMockAuthor(),
      content: postData.content || '',
      type: postData.type || 'discussion',
      timestamp: new Date(),
      likes: 0,
      dislikes: 0,
      comments: [],
      shares: 0,
      bookmarks: 0,
      views: 0,
      tags: postData.tags || [],
      category: postData.category || 'general',
      attachments: postData.attachments || [],
      isEdited: false,
      isPinned: false,
      isFeatured: false,
      moderationStatus: 'approved',
      reactions: {}
    };

    this.posts.set(post.id, post);
    return post;
  }

  async likePost(postId: string, userId: string): Promise<void> {
    const post = this.posts.get(postId);
    if (post) {
      post.likes += 1;
      this.posts.set(postId, post);
    }
  }

  async addComment(postId: string, commentData: Partial<CommunityComment>): Promise<CommunityComment> {
    const comment: CommunityComment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      postId,
      authorId: commentData.authorId || 'current_user',
      author: commentData.author || this.generateMockAuthor(),
      content: commentData.content || '',
      timestamp: new Date(),
      likes: 0,
      replies: [],
      isEdited: false,
      parentCommentId: commentData.parentCommentId
    };

    const post = this.posts.get(postId);
    if (post) {
      post.comments.push(comment);
      this.posts.set(postId, post);
    }

    return comment;
  }

  // Challenges Management
  async getChallenges(status?: string): Promise<CommunityChallenge[]> {
    const mockChallenges = this.generateMockChallenges();
    let filtered = Array.from(mockChallenges.values());

    if (status && status !== 'all') {
      filtered = filtered.filter(challenge => challenge.status === status);
    }

    return filtered.sort((a, b) => a.endDate.getTime() - b.endDate.getTime());
  }

  async joinChallenge(challengeId: string, userId: string): Promise<void> {
    const challenge = this.challenges.get(challengeId);
    if (challenge && challenge.status === 'active') {
      const participant: ChallengeParticipant = {
        userId,
        joinDate: new Date(),
        progress: {},
        completed: false
      };
      
      challenge.participants.push(participant);
      this.challenges.set(challengeId, challenge);
    }
  }

  async updateChallengeProgress(challengeId: string, userId: string, criteriaId: string, value: number): Promise<void> {
    const challenge = this.challenges.get(challengeId);
    if (challenge) {
      const participant = challenge.participants.find(p => p.userId === userId);
      if (participant) {
        participant.progress[criteriaId] = value;
        
        // Check if challenge is completed
        const allCriteriaMet = challenge.criteria.every(criteria => 
          (participant.progress[criteria.id] || 0) >= criteria.target
        );
        
        if (allCriteriaMet) {
          participant.completed = true;
        }
        
        this.challenges.set(challengeId, challenge);
      }
    }
  }

  // Members & Social Features
  async getMembers(sortBy: 'reputation' | 'newest' | 'portfolio_value' = 'reputation'): Promise<CommunityMember[]> {
    const mockMembers = this.generateMockMembers();
    let sorted = Array.from(mockMembers.values());

    switch (sortBy) {
      case 'newest':
        sorted.sort((a, b) => b.joinDate.getTime() - a.joinDate.getTime());
        break;
      case 'portfolio_value':
        sorted.sort((a, b) => (b.portfolioValue || 0) - (a.portfolioValue || 0));
        break;
      default:
        sorted.sort((a, b) => b.reputation - a.reputation);
    }

    return sorted;
  }

  async followUser(userId: string, targetUserId: string): Promise<void> {
    const user = this.members.get(userId);
    const target = this.members.get(targetUserId);
    
    if (user && target) {
      target.followers += 1;
      this.members.set(targetUserId, target);
      
      // Create notification for target user
      this.createNotification(targetUserId, {
        type: 'new_follower',
        message: `${user.name} started following you`,
        timestamp: new Date(),
        read: false
      });
    }
  }

  async getLeaderboard(timeframe: 'weekly' | 'monthly' | 'all_time' = 'all_time'): Promise<CommunityMember[]> {
    const members = await this.getMembers('reputation');
    
    // In production, would filter by timeframe
    return members.slice(0, 10);
  }

  // Groups & Communities
  async getGroups(category?: string): Promise<CommunityGroup[]> {
    const mockGroups = this.generateMockGroups();
    let filtered = Array.from(mockGroups.values());

    if (category && category !== 'all') {
      filtered = filtered.filter(group => group.category === category);
    }

    return filtered.sort((a, b) => b.members - a.members);
  }

  async joinGroup(groupId: string, userId: string): Promise<void> {
    const group = this.groups.get(groupId);
    if (group && group.type === 'public') {
      group.members += 1;
      this.groups.set(groupId, group);
    }
  }

  // Analytics & Insights
  async getCommunityAnalytics(): Promise<CommunityAnalytics> {
    if (!this.analytics) {
      this.analytics = this.generateMockAnalytics();
    }
    return this.analytics;
  }

  async getSimpleCommunityAnalytics(): Promise<SimpleCommunityAnalytics> {
    if (!this.simpleAnalytics) {
      this.simpleAnalytics = this.generateMockSimpleAnalytics();
    }
    return this.simpleAnalytics;
  }

  async getTrendingTags(limit: number = 10): Promise<{ tag: string; count: number; growth: number }[]> {
    // Mock trending tags with growth percentages
    return [
      { tag: 'dividend-growth', count: 234, growth: 15.2 },
      { tag: 'REIT-analysis', count: 189, growth: 8.7 },
      { tag: 'portfolio-review', count: 156, growth: 23.1 },
      { tag: 'yield-trap', count: 134, growth: -5.3 },
      { tag: 'aristocrats', count: 128, growth: 11.4 },
      { tag: 'tax-strategy', count: 98, growth: 18.9 },
      { tag: 'ETF-comparison', count: 87, growth: 6.2 },
      { tag: 'international-dividends', count: 76, growth: 32.1 },
      { tag: 'sector-rotation', count: 65, growth: 9.8 },
      { tag: 'DCA-strategy', count: 54, growth: 14.5 }
    ].slice(0, limit);
  }

  // Notifications
  async getNotifications(userId: string): Promise<any[]> {
    return this.notifications.get(userId) || [];
  }

  async markNotificationRead(userId: string, notificationId: string): Promise<void> {
    const userNotifications = this.notifications.get(userId) || [];
    const notification = userNotifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.notifications.set(userId, userNotifications);
    }
  }

  private createNotification(userId: string, notification: any): void {
    const userNotifications = this.notifications.get(userId) || [];
    userNotifications.unshift({
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...notification
    });
    this.notifications.set(userId, userNotifications.slice(0, 50)); // Keep last 50
  }

  // Helper Methods
  private calculateTrendingScore(post: CommunityPost): number {
    const age = (Date.now() - post.timestamp.getTime()) / (1000 * 60 * 60); // hours
    const engagement = post.likes + post.comments.length * 2 + post.shares * 3;
    return engagement / Math.pow(age + 1, 1.5); // Decay over time
  }

  private generateMockAuthor(): CommunityPost['author'] {
    const names = ['DividendKing87', 'YieldHunter', 'PortfolioBuilder', 'SmartInvestor', 'CashFlowQueen'];
    const badges: Array<'rookie' | 'pro' | 'expert' | 'legend'> = ['rookie', 'pro', 'expert', 'legend'];
    
    return {
      name: names[Math.floor(Math.random() * names.length)],
      avatar: `/api/placeholder/40/40`,
      badge: badges[Math.floor(Math.random() * badges.length)],
      verified: Math.random() > 0.7,
      followers: Math.floor(Math.random() * 5000),
      portfolioValue: Math.floor(Math.random() * 500000) + 50000,
      joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
    };
  }

  private generateMockPosts(): Map<string, CommunityPost> {
    const posts = new Map<string, CommunityPost>();
    
    const samplePosts = [
      {
        content: "Just reached $1000/month in dividend income! Here's my portfolio breakdown: 40% individual stocks (JNJ, KO, PG), 35% dividend ETFs (SCHD, VYM), 25% REITs. Took 5 years but consistency pays off! 🎉",
        type: 'milestone' as const,
        category: 'general' as const,
        tags: ['milestone', 'portfolio', 'dividend-income'],
        likes: 145,
        views: 892
      },
      {
        content: "Deep dive into REML: Why this monthly dividend REIT ETF might be worth considering despite the high expense ratio. Analysis of holdings, yield sustainability, and tax implications included.",
        type: 'analysis' as const,
        category: 'reits' as const,
        tags: ['REML', 'REIT-analysis', 'monthly-dividends'],
        likes: 89,
        views: 567
      },
      {
        content: "Beginner question: Should I prioritize high yield (6%+) or dividend growth when building my first portfolio? I'm 25 with a 40-year timeline.",
        type: 'question' as const,
        category: 'beginner' as const,
        tags: ['beginner', 'strategy', 'yield-vs-growth'],
        likes: 34,
        views: 234
      }
    ];

    samplePosts.forEach((sample, index) => {
      const post: CommunityPost = {
        id: `post_${index + 1}`,
        authorId: `user_${index + 1}`,
        author: this.generateMockAuthor(),
        content: sample.content,
        type: sample.type,
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        likes: sample.likes,
        dislikes: Math.floor(sample.likes * 0.1),
        comments: [],
        shares: Math.floor(sample.likes * 0.2),
        bookmarks: Math.floor(sample.likes * 0.3),
        views: sample.views,
        tags: sample.tags,
        category: sample.category,
        attachments: [],
        isEdited: false,
        isPinned: false,
        isFeatured: index === 0,
        moderationStatus: 'approved',
        reactions: { '👍': sample.likes, '❤️': Math.floor(sample.likes * 0.3) }
      };
      posts.set(post.id, post);
    });

    return posts;
  }

  private generateMockChallenges(): Map<string, CommunityChallenge> {
    const challenges = new Map<string, CommunityChallenge>();
    
    const sampleChallenges = [
      {
        title: "February Consistency Challenge",
        description: "Invest a minimum amount every week this month. Document your strategy and share your progress!",
        type: 'monthly' as const,
        category: 'portfolio' as const,
        difficulty: 'beginner' as const,
        participants: 1456,
        endDate: new Date(2024, 1, 29)
      },
      {
        title: "Dividend Research Week",
        description: "Share your best dividend stock analysis. Community votes on top 3 submissions!",
        type: 'weekly' as const,
        category: 'research' as const,
        difficulty: 'intermediate' as const,
        participants: 234,
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      }
    ];

    sampleChallenges.forEach((sample, index) => {
      const challenge: CommunityChallenge = {
        id: `challenge_${index + 1}`,
        title: sample.title,
        description: sample.description,
        type: sample.type,
        category: sample.category,
        difficulty: sample.difficulty,
        reward: {
          type: 'badge',
          value: 'Exclusive challenge badge + $50 brokerage credit'
        },
        criteria: [
          {
            id: 'participation',
            description: 'Active participation throughout challenge period',
            type: 'engagement',
            target: 100,
            unit: 'points',
            weight: 1
          }
        ],
        participants: Array.from({ length: sample.participants }, (_, i) => ({
          userId: `user_${i}`,
          joinDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          progress: { participation: Math.floor(Math.random() * 100) },
          completed: Math.random() > 0.7
        })),
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        endDate: sample.endDate,
        progress: 65,
        status: 'active',
        rules: ['Must be an active community member', 'Follow community guidelines', 'Document progress weekly'],
        prizes: [
          { rank: 1, description: 'Winner badge + $100 credit', value: '$100', claimed: false },
          { rank: 2, description: 'Runner-up badge + $50 credit', value: '$50', claimed: false },
          { rank: 3, description: 'Participant badge + $25 credit', value: '$25', claimed: false }
        ]
      };
      challenges.set(challenge.id, challenge);
    });

    return challenges;
  }

  private generateMockMembers(): Map<string, CommunityMember> {
    const members = new Map<string, CommunityMember>();
    
    const sampleMembers = [
      { name: 'DividendMaster', badge: 'legend' as const, portfolioValue: 425000, reputation: 2890 },
      { name: 'YieldHunter', badge: 'expert' as const, portfolioValue: 320000, reputation: 2456 },
      { name: 'CompoundKing', badge: 'expert' as const, portfolioValue: 275000, reputation: 2234 },
      { name: 'SmartInvestor', badge: 'pro' as const, portfolioValue: 180000, reputation: 1876 },
      { name: 'CashFlowQueen', badge: 'pro' as const, portfolioValue: 156000, reputation: 1654 }
    ];

    sampleMembers.forEach((sample, index) => {
      const member: CommunityMember = {
        id: `user_${index + 1}`,
        name: sample.name,
        email: `${sample.name.toLowerCase()}@example.com`,
        avatar: `/api/placeholder/50/50`,
        badge: sample.badge,
        verified: Math.random() > 0.5,
        joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        lastActive: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        portfolioValue: sample.portfolioValue,
        dividendIncome: Math.floor(sample.portfolioValue * 0.035 / 12),
        posts: Math.floor(Math.random() * 200) + 50,
        comments: Math.floor(Math.random() * 500) + 100,
        likes: Math.floor(Math.random() * 1000) + 200,
        followers: Math.floor(Math.random() * 3000) + 500,
        following: Math.floor(Math.random() * 500) + 100,
        reputation: sample.reputation,
        badges: [],
        challengesCompleted: Math.floor(Math.random() * 10) + 2,
        featuredPosts: Math.floor(Math.random() * 5),
        privacy: {
          showPortfolioValue: true,
          showIncome: true,
          allowMessages: true,
          emailNotifications: true
        }
      };
      members.set(member.id, member);
    });

    return members;
  }

  private generateMockGroups(): Map<string, CommunityGroup> {
    const groups = new Map<string, CommunityGroup>();
    
    const sampleGroups = [
      { name: 'Dividend Growth Investors', category: 'strategy' as const, members: 4567 },
      { name: 'REIT Enthusiasts', category: 'stock_focus' as const, members: 2345 },
      { name: 'Conservative Income', category: 'risk_level' as const, members: 1890 },
      { name: 'International Dividends', category: 'geographic' as const, members: 1234 }
    ];

    sampleGroups.forEach((sample, index) => {
      const group: CommunityGroup = {
        id: `group_${index + 1}`,
        name: sample.name,
        description: `A community for ${sample.name.toLowerCase()} focused discussions and sharing.`,
        category: sample.category,
        type: 'public',
        members: sample.members,
        posts: Math.floor(sample.members * 0.1),
        admins: [`user_1`],
        moderators: [`user_2`, `user_3`],
        rules: ['Be respectful', 'Stay on topic', 'No spam or self-promotion'],
        tags: sample.name.toLowerCase().split(' '),
        createdDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        isOfficial: index < 2
      };
      groups.set(group.id, group);
    });

    return groups;
  }

  private generateMockAnalytics(): CommunityAnalytics {
    return {
      engagementMetrics: {
        dailyActiveUsers: [3456, 3234, 3567, 3789, 3456],
        postsPerDay: [234, 189, 276, 298, 234],
        topicsPerDay: [45, 38, 52, 67, 45],
        averageResponseTime: 2.5,
        userRetentionRate: 85.7
      },
      contentMetrics: {
        mostPopularCategories: [
          { name: 'dividend_stocks', count: 1234 },
          { name: 'strategy', count: 987 },
          { name: 'reits', count: 756 },
          { name: 'analysis', count: 543 },
          { name: 'beginner', count: 432 }
        ],
        averagePostLength: 387,
        mostUsedTags: [
          { tag: 'dividend-growth', count: 234 },
          { tag: 'portfolio-review', count: 189 },
          { tag: 'REIT-analysis', count: 156 },
          { tag: 'strategy', count: 134 },
          { tag: 'beginner', count: 98 }
        ],
        sentiment: { positive: 72.3, neutral: 21.4, negative: 6.3 }
      },
      userMetrics: {
        newUsersPerDay: [45, 38, 52, 67, 45],
        averageReputationGrowth: 12.5,
        topContributorsByCategory: {},
        userActivityDistribution: {
          'morning': 25.4,
          'afternoon': 35.6,
          'evening': 28.9,
          'night': 10.1
        }
      }
    };
  }

  private generateMockSimpleAnalytics(): SimpleCommunityAnalytics {
    return {
      totalMembers: 12847,
      activeMembers: 3456,
      newMembersToday: 45,
      postsToday: 234,
      commentsToday: 567,
      totalPosts: 45678,
      totalComments: 123456,
      averageEngagement: 8.7,
      topTags: [
        { tag: 'dividend-growth', count: 234 },
        { tag: 'portfolio-review', count: 189 },
        { tag: 'REIT-analysis', count: 156 },
        { tag: 'strategy', count: 134 },
        { tag: 'beginner', count: 98 }
      ],
      membersByBadge: {
        rookie: 8456,
        pro: 3234,
        expert: 1098,
        legend: 59
      },
      growthMetrics: {
        memberGrowth: 12.5,
        engagementGrowth: 8.9,
        contentGrowth: 15.2
      }
    };
  }
}

export default CommunityService; 