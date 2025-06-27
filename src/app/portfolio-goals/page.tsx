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
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [showGoalModal, setShowGoalModal] = useState(false);

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

  const handleViewDetails = (goal: any) => {
    setSelectedGoal(goal);
    setShowGoalModal(true);
  };

  const handlePlanningAction = (action: string) => {
    // Handle planning button clicks
    switch (action) {
      case 'calculator':
        alert('Goal Calculator: Calculate required monthly contributions based on target amount, timeline, and expected returns.');
        break;
      case 'projections':
        alert('Return Projections: View future portfolio value projections based on current contributions and market assumptions.');
        break;
      case 'analysis':
        alert('Portfolio Analysis: Analyze current allocation and get recommendations for goal optimization.');
        break;
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

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'goals', label: 'Goals', icon: Target },
                { id: 'progress', label: 'Progress', icon: TrendingUp },
                { id: 'planning', label: 'Planning', icon: Calculator },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-4 border-b-2 font-medium text-sm transition-colors duration-200 rounded-t-lg
                    ${activeTab === tab.id
                      ? 'border-green-500 text-green-500 dark:text-green-400 dark:border-green-400 bg-gray-100 dark:bg-gray-900'
                      : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 hover:border-green-300 dark:hover:border-green-400 bg-transparent'}
                  `}
                  style={{ minWidth: 120 }}
                >
                  <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-green-500 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'goals' && (
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
                          <button 
                            onClick={() => handleViewDetails(goal)}
                            className="text-sm px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white transition-colors flex items-center space-x-1 shadow"
                          >
                            <span>View Details</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'progress' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Progress Overview</h3>
                
                {/* Overall Progress Chart */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Overall Portfolio Progress</h4>
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                          Progress
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-green-600">
                          {((goals.reduce((sum, goal) => sum + goal.currentAmount, 0) / goals.reduce((sum, goal) => sum + goal.targetAmount, 0)) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                      <div 
                        style={{ width: `${(goals.reduce((sum, goal) => sum + goal.currentAmount, 0) / goals.reduce((sum, goal) => sum + goal.targetAmount, 0)) * 100}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">Goal Status</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">On Track</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-green-600">
                            {goals.filter(goal => goal.status === 'on_track' || goal.status === 'ahead').length}
                          </span>
                          <div className="w-16 h-2 bg-green-200 rounded-full">
                            <div className="w-12 h-2 bg-green-500 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Behind Schedule</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-red-600">
                            {goals.filter(goal => goal.status === 'behind').length}
                          </span>
                          <div className="w-16 h-2 bg-red-200 rounded-full">
                            <div className="w-4 h-2 bg-red-500 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Completed</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-purple-600">
                            {goals.filter(goal => goal.status === 'completed').length}
                          </span>
                          <div className="w-16 h-2 bg-purple-200 rounded-full">
                            <div className="w-0 h-2 bg-purple-500 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">Monthly Contributions</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Total Monthly</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(goals.reduce((sum, goal) => sum + goal.monthlyContribution, 0))}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Auto-investing</span>
                        <span className="font-medium text-green-600">
                          {goals.filter(goal => goal.autoInvest).length} goals
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Expected Annual Growth</span>
                        <span className="font-medium text-blue-600">
                          {formatCurrency(goals.reduce((sum, goal) => sum + (goal.monthlyContribution * 12 * (1 + goal.expectedReturn / 100)), 0))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Individual Goal Progress */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Individual Goal Progress</h4>
                  <div className="space-y-4">
                    {goals.map((goal) => (
                      <div key={goal.id} className="bg-white dark:bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900 dark:text-white">{goal.title}</span>
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {getGoalProgress(goal).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(getGoalProgress(goal), 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center mt-2 text-sm">
                          <span className="text-gray-600 dark:text-gray-300">
                            {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                          </span>
                          <span className="text-gray-600 dark:text-gray-300">
                            {getTimeToGoal(goal)} remaining
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'planning' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Financial Planning</h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Use our planning tools to optimize your goal strategy and maximize your returns.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button 
                      onClick={() => handlePlanningAction('calculator')}
                      className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-400 transition-colors"
                    >
                      <Calculator className="w-8 h-8 text-blue-500 mb-2" />
                      <h4 className="font-medium text-gray-900 dark:text-white">Goal Calculator</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Calculate required contributions</p>
                    </button>
                    <button 
                      onClick={() => handlePlanningAction('projections')}
                      className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-400 transition-colors"
                    >
                      <TrendingUp className="w-8 h-8 text-green-500 mb-2" />
                      <h4 className="font-medium text-gray-900 dark:text-white">Return Projections</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">View future projections</p>
                    </button>
                    <button 
                      onClick={() => handlePlanningAction('analysis')}
                      className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-400 transition-colors"
                    >
                      <BarChart3 className="w-8 h-8 text-purple-500 mb-2" />
                      <h4 className="font-medium text-gray-900 dark:text-white">Portfolio Analysis</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Analyze allocation</p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Goal Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">Goal Distribution</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">High Priority</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {goals.filter(goal => goal.priority === 'high').length} goals
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Medium Priority</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {goals.filter(goal => goal.priority === 'medium').length} goals
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Low Priority</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {goals.filter(goal => goal.priority === 'low').length} goals
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">Timeline Analysis</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Short-term (1-2 years)</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {goals.filter(goal => {
                            const targetDate = new Date(goal.targetDate);
                            const now = new Date();
                            const diffYears = (targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 365);
                            return diffYears <= 2;
                          }).length} goals
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Medium-term (3-5 years)</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {goals.filter(goal => {
                            const targetDate = new Date(goal.targetDate);
                            const now = new Date();
                            const diffYears = (targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 365);
                            return diffYears > 2 && diffYears <= 5;
                          }).length} goals
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Long-term (5+ years)</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {goals.filter(goal => {
                            const targetDate = new Date(goal.targetDate);
                            const now = new Date();
                            const diffYears = (targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 365);
                            return diffYears > 5;
                          }).length} goals
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Goal Details Modal */}
      {showGoalModal && selectedGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedGoal.title}</h2>
                <button 
                  onClick={() => setShowGoalModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                  <p className="text-gray-600 dark:text-gray-300">{selectedGoal.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Progress</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600 dark:text-gray-300">Current Amount</span>
                          <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(selectedGoal.currentAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600 dark:text-gray-300">Target Amount</span>
                          <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(selectedGoal.targetAmount)}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                          <div 
                            className="h-3 bg-blue-500 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(getGoalProgress(selectedGoal), 100)}%` }}
                          ></div>
                        </div>
                        <div className="text-center">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {getGoalProgress(selectedGoal).toFixed(1)}% Complete
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Timeline</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Target Date</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {new Date(selectedGoal.targetDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Time Remaining</span>
                        <span className="font-medium text-gray-900 dark:text-white">{getTimeToGoal(selectedGoal)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Status</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedGoal.status)}`}>
                          {selectedGoal.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Priority</span>
                        <span className={`font-medium capitalize ${
                          selectedGoal.priority === 'high' ? 'text-red-600' :
                          selectedGoal.priority === 'medium' ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {selectedGoal.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contributions</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Monthly Contribution</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(selectedGoal.monthlyContribution)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Expected Return</span>
                        <span className="font-medium text-gray-900 dark:text-white">{selectedGoal.expectedReturn.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Auto-investing</span>
                        <span className={`font-medium ${selectedGoal.autoInvest ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedGoal.autoInvest ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Projections</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Annual Contribution</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(selectedGoal.monthlyContribution * 12)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Expected Growth</span>
                        <span className="font-medium text-blue-600">
                          {formatCurrency(selectedGoal.monthlyContribution * 12 * (selectedGoal.expectedReturn / 100))}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Remaining to Target</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(selectedGoal.targetAmount - selectedGoal.currentAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button 
                    onClick={() => setShowGoalModal(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                  >
                    Close
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Edit Goal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
