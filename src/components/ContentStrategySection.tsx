import { Lightbulb, Calendar, Zap, Plus } from 'lucide-react';

interface ContentStrategySectionProps {
  onOpenPlanGenerator: () => void;
  onOpenSmartPlanner: () => void;
}

export function ContentStrategySection({ onOpenPlanGenerator, onOpenSmartPlanner }: ContentStrategySectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">AI Content Planner</h3>
              <p className="text-sm text-gray-600">Generate optimized posting schedules</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-primary-dark font-bold">✓</span>
              </div>
              <p className="text-sm text-gray-700">AI-powered posting frequency recommendations</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-primary-dark font-bold">✓</span>
              </div>
              <p className="text-sm text-gray-700">Content ideas based on your brand profile</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-primary-dark font-bold">✓</span>
              </div>
              <p className="text-sm text-gray-700">Multi-week content calendar generation</p>
            </div>
          </div>

          <button
            onClick={onOpenPlanGenerator}
            className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Generate Content Plan
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Smart Schedule Planner</h3>
              <p className="text-sm text-gray-600">Recurring post automation</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-accent-light font-bold">✓</span>
              </div>
              <p className="text-sm text-gray-700">Set up daily, weekly, or monthly schedules</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-accent-light font-bold">✓</span>
              </div>
              <p className="text-sm text-gray-700">Automatic recurring post generation</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-accent-light font-bold">✓</span>
              </div>
              <p className="text-sm text-gray-700">Flexible date ranges and repetition patterns</p>
            </div>
          </div>

          <button
            onClick={onOpenSmartPlanner}
            className="w-full py-3 bg-accent hover:bg-accent-light text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Smart Schedule
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Pro Tip: Consistency is Key</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              The most successful social media accounts maintain a consistent posting schedule. Use our AI tools to:
            </p>
            <ul className="mt-3 space-y-2">
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-primary font-bold">•</span>
                <span>Find the optimal posting frequency for your audience</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-primary font-bold">•</span>
                <span>Generate content ideas when you're running low on inspiration</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-primary font-bold">•</span>
                <span>Automate repetitive posts to save time and maintain consistency</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
