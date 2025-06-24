"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, MessageCircle, Crown, Briefcase, TrendingUp, Building, 
  GraduationCap, Globe, Star, ThumbsUp, Eye, Clock, Pin, 
  MessageSquare, Heart, Share2, Filter, Search, ArrowUp,
  Award, Trophy, Zap, Calendar, Plus, BarChart3, Target, BookOpen,
  ThumbsDown, ArrowUpRight, CheckCircle, User, Percent, Bell,
  Shield, MoreHorizontal, Flame, Sparkles, Flag, Bookmark, Hash
} from 'lucide-react';
import CommunityService, {
  CommunityPost,
  CommunityChallenge,
  CommunityMember,
  CommunityGroup,
  SimpleCommunityAnalytics
} from '../utils/communityService';

interface CommunityHubProps {
  className?: string;
}

const getIconComponent = (iconName: string) => {
  const icons: { [key: string]: React.ComponentType<any> } = {
    MessageCircle,
    Crown,
    Briefcase,
    TrendingUp,
    Building,
    GraduationCap,
    Globe,
    Star,
  };
  return icons[iconName] || MessageCircle;
};

const getColorClasses = (color: string) => {
  const colorMap: { [key: string]: string } = {
    blue: 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800',
    gold: 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800',
    green: 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800',
    purple: 'border-purple-200 bg-green-50 dark:bg-purple-900/20 dark:border-purple-800',
    orange: 'border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800',
    emerald: 'border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-800',
    cyan: 'border-cyan-200 bg-cyan-50 dark:bg-cyan-900/20 dark:border-cyan-800',
    pink: 'border-pink-200 bg-pink-50 dark:bg-pink-900/20 dark:border-pink-800',
  };
  return colorMap[color] || colorMap.blue;
};

export default function CommunityHub({ className = '' }: CommunityHubProps) {
  const [activeTab, setActiveTab] = useState<'feed' | 'challenges' | 'leaderboard' | 'groups' | 'profile'>('feed');
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [challenges, setChallenges] = useState<CommunityChallenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<CommunityMember[]>([]);
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [analytics, setAnalytics] = useState<SimpleCommunityAnalytics | null>(null);
  const [trendingTags, setTrendingTags] = useState<{ tag: string; count: number; growth: number }[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'trending'>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  
  const [communityService] = useState(() => CommunityService.getInstance());

  useEffect(() => {
    loadCommunityData();
  }, [filterCategory, filterType, sortBy]);

  const loadCommunityData = async () => {
    setIsLoading(true);
    try {
      const [postsData, challengesData, leaderboardData, groupsData, analyticsData, tagsData] = await Promise.all([
        communityService.getPosts({ 
          category: filterCategory === 'all' ? undefined : filterCategory,
          type: filterType === 'all' ? undefined : filterType,
          sortBy,
          limit: 20 
        }),
        communityService.getChallenges(),
        communityService.getLeaderboard(),
        communityService.getGroups(),
        communityService.getSimpleCommunityAnalytics(),
        communityService.getTrendingTags(6)
      ]);

      setPosts(postsData);
      setChallenges(challengesData);
      setLeaderboard(leaderboardData);
      setGroups(groupsData);
      setAnalytics(analyticsData);
      setTrendingTags(tagsData);
    } catch (error) {
      console.error('Failed to load community data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      await communityService.likePost(postId, 'current_user');
      // Update local state
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1 }
          : post
      ));
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleJoinChallenge = async (challengeId: string) => {
    try {
      await communityService.joinChallenge(challengeId, 'current_user');
      // Update local state
      setChallenges(challenges.map(challenge => 
        challenge.id === challengeId 
          ? { 
              ...challenge, 
              participants: [...challenge.participants, {
                userId: 'current_user',
                joinDate: new Date(),
                progress: {},
                completed: false
              }]
            }
          : challenge
      ));
    } catch (error) {
      console.error('Failed to join challenge:', error);
    }
  };

  const handleFollowUser = async (userId: string) => {
    try {
      await communityService.followUser('current_user', userId);
      // Update local state
      setLeaderboard(leaderboard.map(member => 
        member.id === userId 
          ? { ...member, followers: member.followers + 1 }
          : member
      ));
    } catch (error) {
      console.error('Failed to follow user:', error);
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'rookie': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pro': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'expert': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'legend': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'rookie': return <Users className="w-3 h-3" />;
      case 'pro': return <Star className="w-3 h-3" />;
      case 'expert': return <Award className="w-3 h-3" />;
      case 'legend': return <Crown className="w-3 h-3" />;
      default: return <Users className="w-3 h-3" />;
    }
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'discussion': return 'bg-blue-100 text-blue-800';
      case 'analysis': return 'bg-purple-100 text-purple-800';
      case 'tip': return 'bg-green-100 text-green-800';
      case 'question': return 'bg-orange-100 text-orange-800';
      case 'milestone': return 'bg-yellow-100 text-yellow-800';
      case 'portfolio_share': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'discussion': return <MessageCircle className="w-4 h-4" />;
      case 'analysis': return <BarChart3 className="w-4 h-4" />;
      case 'tip': return <Zap className="w-4 h-4" />;
      case 'question': return <Target className="w-4 h-4" />;
      case 'milestone': return <Trophy className="w-4 h-4" />;
      case 'portfolio_share': return <Percent className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
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

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-lg border border-gray-200 p-8 ${className}`}>
        <div className="flex items-center justify-center">
          <Users className="w-8 h-8 text-purple-600 animate-pulse" />
          <span className="ml-3 text-lg text-gray-600">Loading community content...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Community Hub</h2>
              <p className="text-gray-600">
                Connect with {analytics?.totalMembers.toLocaleString()} dividend investors worldwide
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors relative">
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              )}
            </button>
            <button
              onClick={() => setShowNewPostModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Post</span>
            </button>
          </div>
        </div>

        {/* Community Stats Banner */}
        {analytics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-600 font-medium">Active Members</p>
                  <p className="text-xl font-bold text-blue-900">{formatNumber(analytics.activeMembers)}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-green-600 font-medium">Posts Today</p>
                  <p className="text-xl font-bold text-green-900">{analytics.postsToday}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-purple-600 font-medium">Engagement</p>
                  <p className="text-xl font-bold text-purple-900">{analytics.averageEngagement}%</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm text-orange-600 font-medium">New Today</p>
                  <p className="text-xl font-bold text-orange-900">{analytics.newMembersToday}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'feed', label: 'Community Feed', icon: MessageCircle, count: posts.length },
              { id: 'challenges', label: 'Challenges', icon: Trophy, count: challenges.filter(c => c.status === 'active').length },
              { id: 'leaderboard', label: 'Leaderboard', icon: Award, count: leaderboard.length },
              { id: 'groups', label: 'Groups', icon: Users, count: groups.length },
              { id: 'profile', label: 'My Profile', icon: User, count: 0 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-green-600' : ''}`} />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'feed' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Feed */}
            <div className="lg:col-span-3 space-y-6">
              {/* Filters */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="all">All Categories</option>
                      <option value="general">General</option>
                      <option value="dividend_stocks">Dividend Stocks</option>
                      <option value="reits">REITs</option>
                      <option value="etfs">ETFs</option>
                      <option value="strategy">Strategy</option>
                      <option value="analysis">Analysis</option>
                      <option value="beginner">Beginner</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="all">All Types</option>
                      <option value="discussion">Discussions</option>
                      <option value="analysis">Analysis</option>
                      <option value="tip">Tips & Advice</option>
                      <option value="question">Questions</option>
                      <option value="milestone">Milestones</option>
                      <option value="portfolio_share">Portfolio Shares</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="recent">Most Recent</option>
                      <option value="popular">Most Popular</option>
                      <option value="trending">Trending</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2 ml-auto">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search posts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-48"
                    />
                  </div>
                </div>
              </div>

              {/* Posts */}
              <div className="space-y-6">
                {posts.filter(post => 
                  searchQuery === '' || 
                  post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
                ).map((post) => (
                  <div key={post.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all">
                    {/* Post Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                          {post.author.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-900">{post.author.name}</span>
                            {post.author.verified && (
                              <Shield className="w-4 h-4 text-blue-500" />
                            )}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getBadgeColor(post.author.badge)}`}>
                              {getBadgeIcon(post.author.badge)}
                              <span className="capitalize">{post.author.badge}</span>
                            </span>
                          </div>
                          <div className="flex items-center space-x-3 text-sm text-gray-500 mt-1">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{formatTimeAgo(post.timestamp)}</span>
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getPostTypeColor(post.type)}`}>
                              {getPostTypeIcon(post.type)}
                              <span className="capitalize">{post.type.replace('_', ' ')}</span>
                            </div>
                            {post.isFeatured && (
                              <div className="flex items-center space-x-1 text-yellow-600">
                                <Flame className="w-3 h-3" />
                                <span className="text-xs font-medium">Featured</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="mb-4">
                      <p className="text-gray-800 leading-relaxed">{post.content}</p>
                    </div>

                    {/* Tags */}
                    {post.tags.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag, i) => (
                            <span key={i} className="px-2 py-1 bg-green-50 text-purple-700 rounded-full text-xs font-medium flex items-center space-x-1">
                              <Hash className="w-3 h-3" />
                              <span>{tag}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Post Metrics */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{formatNumber(post.views)} views</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{post.comments.length} comments</span>
                        </div>
                      </div>
                      <span>{post.category}</span>
                    </div>

                    {/* Post Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-6">
                        <button 
                          onClick={() => handleLikePost(post.id)}
                          className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <Heart className="w-4 h-4" />
                          <span className="text-sm font-medium">{formatNumber(post.likes)}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                          <MessageSquare className="w-4 h-4" />
                          <span className="text-sm font-medium">{post.comments.length}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
                          <Share2 className="w-4 h-4" />
                          <span className="text-sm font-medium">{post.shares}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-500 hover:text-green-600 transition-colors">
                          <Bookmark className="w-4 h-4" />
                          <span className="text-sm font-medium">{post.bookmarks}</span>
                        </button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                          <ThumbsUp className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                          <ThumbsDown className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-orange-600 transition-colors">
                          <Flag className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Trending Tags */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <span>Trending Topics</span>
                </h3>
                <div className="space-y-3">
                  {trendingTags.map((tag, index) => (
                    <div key={tag.tag} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">#{tag.tag}</span>
                        <span className={`text-xs font-medium ${
                          tag.growth > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {tag.growth > 0 ? '+' : ''}{tag.growth.toFixed(1)}%
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">{tag.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Contributors */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Award className="w-5 h-5 text-green-600" />
                  <span>Top Contributors</span>
                </h3>
                <div className="space-y-3">
                  {leaderboard.slice(0, 5).map((member, index) => (
                    <div key={member.id} className="flex items-center space-x-3">
                      <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-orange-500' :
                        'bg-green-600'
                      }`}>
                        {index < 3 ? <Crown className="w-3 h-3" /> : index + 1}
                      </div>
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {member.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.reputation} reputation</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Groups */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span>Popular Groups</span>
                </h3>
                <div className="space-y-3">
                  {groups.slice(0, 4).map((group) => (
                    <div key={group.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{group.name}</p>
                        <p className="text-xs text-gray-500">{formatNumber(group.members)} members</p>
                      </div>
                      <button className="px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 transition-colors">
                        Join
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Challenges</h3>
              <p className="text-gray-600 mb-4">
                Participate in challenges to improve your investing skills, earn rewards, and connect with other members.
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium">{challenges.filter(c => c.status === 'active').length} Active Challenges</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">{challenges.reduce((sum, c) => sum + c.participants.length, 0).toLocaleString()} Total Participants</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.map((challenge) => (
                <div key={challenge.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      challenge.status === 'active' ? 'bg-green-100 text-green-800' :
                      challenge.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {challenge.status}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        challenge.type === 'monthly' ? 'bg-purple-100 text-purple-800' :
                        challenge.type === 'weekly' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {challenge.type}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        challenge.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                        challenge.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        challenge.difficulty === 'advanced' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {challenge.difficulty}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-lg font-bold text-gray-900 mb-2">{challenge.title}</h4>
                  <p className="text-gray-600 text-sm mb-4">{challenge.description}</p>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Participants</span>
                      <span className="font-medium">{challenge.participants.length.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Ends</span>
                      <span className="font-medium">{challenge.endDate.toLocaleDateString()}</span>
                    </div>
                    {challenge.progress && (
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">{challenge.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ width: `${challenge.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-yellow-50 p-3 rounded-lg mb-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <Trophy className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">Reward</span>
                    </div>
                    <p className="text-sm text-yellow-700">{challenge.reward.value}</p>
                  </div>

                  <button 
                    onClick={() => handleJoinChallenge(challenge.id)}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                      challenge.status === 'active' 
                        ? 'bg-purple-600 text-white hover:bg-purple-700' 
                        : 'bg-gray-100 text-gray-600 cursor-not-allowed'
                    }`}
                    disabled={challenge.status !== 'active'}
                  >
                    {challenge.status === 'active' ? 'Join Challenge' : 
                     challenge.status === 'upcoming' ? 'Coming Soon' : 'Completed'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Leaderboard</h3>
              <p className="text-gray-600">
                Top contributors ranked by reputation, portfolio performance, and community engagement.
              </p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">Top Contributors</h4>
                  <select className="px-3 py-1 border border-gray-300 rounded text-sm">
                    <option>All Time</option>
                    <option>This Month</option>
                    <option>This Week</option>
                  </select>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {leaderboard.map((member, index) => (
                  <div key={member.id} className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-white ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-orange-500' :
                        'bg-green-600'
                      }`}>
                        {index < 3 ? <Crown className="w-5 h-5" /> : index + 1}
                      </div>
                      
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {member.name.slice(0, 2).toUpperCase()}
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-gray-900">{member.name}</h4>
                          {member.verified && <Shield className="w-4 h-4 text-blue-500" />}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getBadgeColor(member.badge)}`}>
                            {getBadgeIcon(member.badge)}
                            <span className="capitalize">{member.badge}</span>
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span>Portfolio: {formatCurrency(member.portfolioValue || 0)}</span>
                          <span>Income: {formatCurrency(member.dividendIncome || 0)}/mo</span>
                          <span>{member.posts} posts</span>
                          <span>{formatNumber(member.followers)} followers</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="text-lg font-bold text-purple-600">{member.reputation}</p>
                        <p className="text-xs text-gray-500">reputation</p>
                      </div>
                      <button 
                        onClick={() => handleFollowUser(member.id)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                      >
                        Follow
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 