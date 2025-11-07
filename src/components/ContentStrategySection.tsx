import { useState } from 'react';
import { Lightbulb, Calendar, Zap, Plus, FileText } from 'lucide-react';

interface ContentPlan {
  id: string;
  topics: string[];
  schedule: {
    date: string;
    topic: string;
  }[];
  insights: string[];
}

interface ContentStrategySectionProps {
  onOpenPlanGenerator: () => void;
  onOpenSmartPlanner: () => void;
  generatedPlans?: ContentPlan[];
}

export function ContentStrategySection({ onOpenPlanGenerator, onOpenSmartPlanner, generatedPlans = [] }: ContentStrategySectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-all">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-[#7CB342] to-[#4CAF50] rounded-xl flex items-center justify-center">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">AI Content Planner</h3>
              <p className="text-base text-gray-600">Generate optimized posting schedules with AI insights</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm text-green-600 font-bold">✓</span>
              </div>
              <p className="text-base text-gray-700">AI-powered posting frequency recommendations tailored to your audience</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm text-green-600 font-bold">✓</span>
              </div>
              <p className="text-base text-gray-700">Smart content ideas automatically generated based on your brand profile</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm text-green-600 font-bold">✓</span>
              </div>
              <p className="text-base text-gray-700">Multi-week content calendar generation with optimal timing recommendations</p>
            </div>
          </div>

          <button
            onClick={onOpenPlanGenerator}
            className="w-full py-4 text-lg bg-gradient-to-r from-[#FFD54F] via-[#7CB342] to-[#42A5F5] text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Generate Content Plan
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-5 h-5 text-[#7CB342]" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Pro Tip: Consistency is Key</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              The most successful social media accounts maintain a consistent posting schedule. Use our AI tools to:
            </p>
            <ul className="mt-3 space-y-2">
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-[#7CB342] font-bold">•</span>
                <span>Find the optimal posting frequency for your audience</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-[#7CB342] font-bold">•</span>
                <span>Generate content ideas when you're running low on inspiration</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-[#7CB342] font-bold">•</span>
                <span>Automate repetitive posts to save time and maintain consistency</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {generatedPlans.length > 0 && (
        <div className="space-y-4" id="content-plans-section">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Generated Content Plans</h3>
          {generatedPlans.map((plan) => (
            <div key={plan.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#7CB342] to-[#4CAF50] rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Content Plan</h4>

                  <div className="mb-4">
                    <h5 className="text-sm font-semibold text-gray-700 mb-2">Suggested Topics:</h5>
                    <div className="flex flex-wrap gap-2">
                      {plan.topics.map((topic, idx) => (
                        <span key={idx} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {plan.schedule.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-sm font-semibold text-gray-700 mb-2">Posting Schedule:</h5>
                      <div className="space-y-2">
                        {plan.schedule.slice(0, 5).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-sm">
                            <span className="text-gray-500 font-medium">{item.date}</span>
                            <span className="text-gray-700">{item.topic}</span>
                          </div>
                        ))}
                        {plan.schedule.length > 5 && (
                          <p className="text-sm text-gray-500 italic">+ {plan.schedule.length - 5} more posts</p>
                        )}
                      </div>
                    </div>
                  )}

                  {plan.insights.length > 0 && (
                    <div>
                      <h5 className="text-sm font-semibold text-gray-700 mb-2">AI Insights:</h5>
                      <ul className="space-y-1">
                        {plan.insights.map((insight, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-[#7CB342] font-bold">•</span>
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
