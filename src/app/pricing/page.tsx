"use client";

import { motion } from 'framer-motion';
import { Crown, Check, Star, Zap, Shield, Users, BarChart3, Bot, Bell, Globe, Smartphone, TrendingUp } from 'lucide-react';
import PricingPlans from '@/components/PricingPlans';
import GoProButton from '@/components/GoProButton';
import { useAuth } from '@/context/AuthContext';

export default function PricingPage() {
  const { user } = useAuth();

  const features = [
    {
      title: "Portfolio Management",
      description: "Track your investments with real-time data and insights",
      icon: BarChart3,
      items: ["Real-time portfolio tracking", "Performance analytics", "Risk assessment", "Portfolio rebalancing"]
    },
    {
      title: "Dividend Tracking",
      description: "Never miss a dividend payment with our comprehensive calendar",
      icon: TrendingUp,
      items: ["Dividend calendar", "Payment tracking", "Yield calculations", "Dividend growth analysis"]
    },
    {
      title: "AI-Powered Insights",
      description: "Get personalized recommendations based on your portfolio",
      icon: Bot,
      items: ["Stock recommendations", "Portfolio optimization", "Market sentiment analysis", "Risk alerts"]
    },
    {
      title: "Advanced Tools",
      description: "Professional-grade tools for serious investors",
      icon: Zap,
      items: ["Stock screener", "Technical analysis", "Backtesting", "Custom alerts"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Start free and upgrade when you need more advanced features. 
              All plans include our core portfolio tracking and dividend management tools.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <PricingPlans 
          currentPlan={user ? 'free' : undefined}
          showAnnualToggle={true}
          compact={false}
        />
      </div>

      {/* Features Section */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Powerful tools designed for dividend investors and portfolio managers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {feature.description}
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    {feature.items.map((item, idx) => (
                      <li key={idx} className="flex items-center justify-center">
                        <Check className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
              Join thousands of investors who trust Divly to manage their dividend portfolios. 
              Start free today and upgrade when you're ready for more advanced features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GoProButton className="text-lg px-8 py-4" />
              <a
                href={user ? "/dashboard" : "/signup"}
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-bold text-lg rounded-lg hover:bg-white hover:text-emerald-600 transition-all duration-200"
              >
                {user ? "Go to Dashboard" : "Start Free"}
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              {[
                {
                  question: "Can I cancel my subscription anytime?",
                  answer: "Yes, you can cancel your subscription at any time. Your Pro features will remain active until the end of your current billing period."
                },
                {
                  question: "Do you offer refunds?",
                  answer: "We offer a 30-day money-back guarantee. If you're not satisfied with Pro features, contact us for a full refund."
                },
                {
                  question: "What payment methods do you accept?",
                  answer: "We accept all major credit cards (Visa, MasterCard, American Express) and PayPal through our secure Stripe payment processor."
                },
                {
                  question: "Is my data secure?",
                  answer: "Absolutely. We use bank-level encryption and security measures to protect your financial data. We never share your personal information with third parties."
                },
                {
                  question: "Can I use Divly on multiple devices?",
                  answer: "Yes! Divly works on all devices - desktop, tablet, and mobile. Your data syncs automatically across all your devices."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 