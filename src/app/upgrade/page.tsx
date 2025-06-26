"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Star, Zap, Shield, TrendingUp } from 'lucide-react';
import PricingPlans from '@/components/PricingPlans';

export default function UpgradePage() {
  const handlePlanSelect = (planId: string) => {
    console.log('Selected plan:', planId);
    // Implement plan selection logic
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-xl opacity-20"
              />
              <div className="relative bg-white dark:bg-gray-800 p-6 rounded-full shadow-lg">
                <Crown size={48} className="text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Unlock the Full Power of{' '}
            <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Divi Dash Pro
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Take your dividend investing to the next level with advanced analytics, 
            AI-powered recommendations, and institutional-grade tools.
          </p>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-4 mx-auto">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Advanced Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Deep portfolio insights, risk analysis, and performance attribution with real-time alerts.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg mb-4 mx-auto">
                <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                AI Recommendations
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Personalized stock picks powered by machine learning and comprehensive dividend analysis.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg mb-4 mx-auto">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Premium Support
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Priority email support, dedicated help, and early access to new features.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Pricing Plans */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <PricingPlans 
            currentPlan="free"
            onSelectPlan={handlePlanSelect}
            showAnnualToggle={true}
            compact={false}
          />
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-20"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            What Our Pro Users Say
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                quote: "The AI recommendations have helped me discover dividend stocks I never would have found on my own. ROI has improved significantly.",
                author: "Sarah Chen",
                title: "Portfolio Manager",
                rating: 5
              },
              {
                quote: "Advanced analytics give me the confidence to make better investment decisions. The risk analysis is particularly valuable.",
                author: "Michael Rodriguez", 
                title: "Individual Investor",
                rating: 5
              },
              {
                quote: "Priority support is fantastic. I get answers within hours, not days. Worth every penny for serious investors.",
                author: "Jennifer Kim",
                title: "Financial Advisor",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-600 dark:text-gray-300 mb-4 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <cite className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.author}
                  </cite>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-20"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-4xl mx-auto space-y-6">
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
                question: "How does the AI recommendation engine work?",
                answer: "Our AI analyzes over 97 data points including financial metrics, risk factors, market sentiment, and your portfolio composition to provide personalized stock recommendations."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
} 