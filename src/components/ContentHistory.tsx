import { useState } from 'react';
import { History, Trash2, ExternalLink } from 'lucide-react';
import type { ContentHistory as ContentHistoryType } from '../types';

interface ContentHistoryProps {
  history: ContentHistoryType[];
  onLoadContent: (content: ContentHistoryType) => void;
  onDeleteContent: (id: string) => void;
}

export function ContentHistory({ history, onLoadContent, onDeleteContent }: ContentHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (history.length === 0) return null;

  return (
    <div className="card-float p-6 mb-6 animate-fade-in">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="gradient-header-bg inline-block">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-orange-600" />
            <h2 className="text-xl font-bold gradient-text">Content History</h2>
            <span className="text-xs font-medium text-gray-600 ml-2">({history.length})</span>
          </div>
        </div>
        <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isExpanded && (
        <div className="mt-6 space-y-2 max-h-96 overflow-y-auto">
          {history.map((item, index) => (
            <div
              key={item.id}
              className="card-float p-4 hover:shadow-lg transition-all stagger-item"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {item.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(item.created_at).toLocaleDateString()} at{' '}
                    {new Date(item.created_at).toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => onLoadContent(item)}
                    className="p-2 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl transition-all transform hover:scale-[0.98]"
                    title="Load this content"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                  </button>
                  <button
                    onClick={() => onDeleteContent(item.id)}
                    className="p-2 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 rounded-xl transition-all transform hover:scale-[0.98]"
                    title="Delete this content"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
