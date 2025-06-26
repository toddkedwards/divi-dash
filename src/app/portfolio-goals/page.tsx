"use client";

import React, { useState, useEffect } from "react";
import {
  Target,
  TrendingUp,
  DollarSign,
  Calendar,
  PieChart,
  BarChart3,
  Plus,
  Edit3,
  CheckCircle,
  AlertCircle,
  Clock,
  Home,
  GraduationCap,
  Plane,
  Shield,
  Settings,
  Download,
  Share2,
  RefreshCw,
  Calculator,
  Zap,
  Award,
  ChevronRight,
  Info,
  Gift
} from "lucide-react";

export default function PortfolioGoalsPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('goals');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const goals = [
    {
      id: '1',
      title: 'Retirement Fund',
      description: 'Build a comfortable retirement nest egg',
      targetAmount: 1500000,
      currentAmount: 487650,
      targetDate: '2045-01-01',
      priority: 'high',
      status: 'on_track',
      monthlyContribution: 2500,
      expectedReturn: 7.5,
      autoInvest: true,
      icon: Home,
      color: 'blue'
    },
    {
      id: '2',
      title: 'House Down Payment',
      description: '20% down payment for dream home',
      targetAmount: 120000,
      currentAmount: 45000,
      targetDate: '2026-06-01',
      priority: 'high',
      status: 'behind',
      monthlyContribution: 1200,
      expectedReturn: 5.0,
      autoInvest: true,
      icon: Home,
      color: 'green'
    },
    {
      id: '3',
      title: 'Emergency Fund',
      description: '6 months of living expenses',
      targetAmount: 48000,
      currentAmount: 35000,
      targetDate: '2025-12-01',
      priority: 'high',
      status: 'on_track',
      monthlyContribution: 800,
      expectedReturn: 2.5,
      autoInvest: true,
      icon: Shield,
      color: 'red'
    }
  ];

  const getGoalProgress = (goal: any) => {
    return (goal.currentAmount / goal.targetAmount) * 100;
  };

  const getTimeToGoal = (goal: any) => {
    const now = new Date();
    const target = new Date(goal.targetDate);
    const diffTime = target.getTime() - now.getTime();
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    
    if (diffMonths < 12) {
      return `${diffMonths} months`;
    } else {
      const years = Math.floor(diffMonths / 12);
      const months = diffMonths % 12;
      return months > 0 ? `${years}y ${months}m` : `${years} years`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track': return 'text-green-600 bg-green-100';
      case 'ahead': return 'text-blue-600 bg-blue-100';
      case 'behind': return 'text-red-600 bg-red-100';
      case 'completed': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on_track': return <CheckCircle className="w-4 h-4" />;
      case 'ahead': return <TrendingUp className="w-4 h-4" />;
      case 'behind': return <AlertCircle className="w-4 h-4" />;
      case 'completed': return <Award className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50 dark:border-red-700 dark:bg-gray-900';
      case 'medium': return 'border-yellow-200 bg-yellow-50 dark:border-yellow-700 dark:bg-gray-900';
      case 'low': return 'border-green-200 bg-green-50 dark:border-green-700 dark:bg-gray-900';
      default: return 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading portfolio goals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Portfolio Goals</h1>
            <p className="text-gray-600 dark:text-gray-300">Set, track, and achieve your financial objectives</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Goal</span>
            </button>
            
            <button className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white transition-colors">
              <Download className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Goal Value</h3>
              <Target className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(goals.reduce((sum, goal) => sum + goal.targetAmount, 0))}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Across {goals.length} goals
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Current Progress</h3>
              <PieChart className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(goals.reduce((sum, goal) => sum + goal.currentAmount, 0))}
            </div>
            <div className="text-sm text-green-600 dark:text-green-400 mt-1">
              {((goals.reduce((sum, goal) => sum + goal.currentAmount, 0) / goals.reduce((sum, goal) => sum + goal.targetAmount, 0)) * 100).toFixed(1)}% complete
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Monthly Contributions</h3>
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(goals.reduce((sum, goal) => sum + goal.monthlyContribution, 0))}
            </div>
            <div className="text-sm text-purple-600 dark:text-purple-400 mt-1">
              Auto-invested
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Goals On Track</h3>
              <CheckCircle className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {goals.filter(goal => goal.status === 'on_track' || goal.status === 'ahead').length}
            </div>
            <div className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">
              of {goals.length} goals
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <div className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {goals.map((goal) => (
                  <div key={goal.id} className={`border-2 rounded-lg p-6 ${getPriorityColor(goal.priority)}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                          <goal.icon className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{goal.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{goal.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(goal.status)}`}>
                          {getStatusIcon(goal.status)}
                          <span className="capitalize">{goal.status.replace('_', ' ')}</span>
                        </span>
                        <button className="p-1 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-300">Progress</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div 
                            className="h-3 bg-blue-500 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(getGoalProgress(goal), 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">{getGoalProgress(goal).toFixed(1)}% complete</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{getTimeToGoal(goal)} remaining</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600 dark:text-gray-300">Monthly Contribution</div>
                          <div className="font-medium text-gray-900 dark:text-white">{formatCurrency(goal.monthlyContribution)}</div>
                        </div>
                        <div>
                          <div className="text-gray-600 dark:text-gray-300">Expected Return</div>
                          <div className="font-medium text-gray-900 dark:text-white">{goal.expectedReturn.toFixed(1)}%</div>
                        </div>
                        <div>
                          <div className="text-gray-600 dark:text-gray-300">Target Date</div>
                          <div className="font-medium text-gray-900 dark:text-white">{new Date(goal.targetDate).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <div className="text-gray-600 dark:text-gray-300">Priority</div>
                          <div className={`font-medium capitalize ${
                            goal.priority === 'high' ? 'text-red-600' :
                            goal.priority === 'medium' ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {goal.priority}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-2 text-sm">
                          {goal.autoInvest && (
                            <span className="flex items-center text-green-600">
                              <Zap className="w-3 h-3 mr-1" />
                              Auto-investing
                            </span>
                          )}
                        </div>
                        <button className="text-sm px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white transition-colors flex items-center space-x-1 shadow">
                          <span>View Details</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
