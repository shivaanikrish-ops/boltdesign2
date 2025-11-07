import { useState } from 'react';
import { X, Search, Calendar, FileText, Eye } from 'lucide-react';

interface ContentPlan {
  id: string;
  topics: string[];
  schedule: {
    date: string;
    topic: string;
  }[];
  insights: string[];
}

interface ContentPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentPlans: ContentPlan[];
}

export function ContentPlansModal({ isOpen, onClose, contentPlans }: ContentPlansModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredPlans = contentPlans.filter(plan =>
    plan.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase())) ||
    plan.insights.some(insight => insight.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-[#42A5F5] to-[#7CB342] px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Content Plans</h2>
            <p className="text-sm text-white/90">View and manage your generated content plans</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-6 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search content plans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-[#42A5F5] focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {filteredPlans.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-[#42A5F5] to-[#7CB342] rounded-[20px] flex items-center justify-center mx-auto mb-4 opacity-50">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                {searchQuery ? 'No matching plans found' : 'No content plans yet'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {searchQuery ? 'Try a different search term' : 'Generate content plans to see them here'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#42A5F5] to-[#7CB342] rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Content Plan</h4>

                      <div className="mb-4">
                        <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Suggested Topics:</h5>
                        <div className="flex flex-wrap gap-2">
                          {plan.topics.map((topic, idx) => (
                            <span key={idx} className="px-3 py-1 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full text-sm">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>

                      {plan.schedule.length > 0 && (
                        <div className="mb-4">
                          <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Posting Schedule:</h5>
                          <div className="space-y-2">
                            {plan.schedule.slice(0, 5).map((item, idx) => (
                              <div key={idx} className="flex items-center gap-3 text-sm">
                                <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                <span className="text-gray-500 dark:text-gray-300 font-medium">{item.date}</span>
                                <span className="text-gray-700 dark:text-gray-300">{item.topic}</span>
                              </div>
                            ))}
                            {plan.schedule.length > 5 && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 italic">+ {plan.schedule.length - 5} more posts</p>
                            )}
                          </div>
                        </div>
                      )}

                      {plan.insights.length > 0 && (
                        <div>
                          <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">AI Insights:</h5>
                          <ul className="space-y-1">
                            {plan.insights.map((insight, idx) => (
                              <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                <span className="text-[#42A5F5] font-bold">•</span>
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

        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {filteredPlans.length} {filteredPlans.length === 1 ? 'plan' : 'plans'} generated
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
