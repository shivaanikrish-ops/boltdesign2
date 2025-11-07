import { useState } from 'react';
import { Lightbulb, Calendar, Zap, Plus } from 'lucide-react';

interface ContentStrategySectionProps {
  onOpenPlanGenerator: () => void;
  onOpenSmartPlanner: () => void;
}

export function ContentStrategySection({ onOpenPlanGenerator, onOpenSmartPlanner }: ContentStrategySectionProps) {
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
    </div>
  );
}
