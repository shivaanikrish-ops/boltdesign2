import { useState } from 'react';
import { X, Search, Calendar, Trash2, Eye } from 'lucide-react';
import type { ContentHistory } from '../types';

interface SavedContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedContent: ContentHistory[];
  onLoadContent: (content: ContentHistory) => void;
  onDeleteContent: (id: string) => void;
}

export function SavedContentModal({ isOpen, onClose, savedContent, onLoadContent, onDeleteContent }: SavedContentModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredContent = savedContent.filter(content =>
    content.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    content.formal_caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
    content.casual_caption.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLoad = (content: ContentHistory) => {
    onLoadContent(content);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-[#7CB342] to-[#4CAF50] px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Saved Content</h2>
            <p className="text-sm text-white/90">View and manage your saved content</p>
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search saved content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7CB342] focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {filteredContent.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-[#7CB342] to-[#4CAF50] rounded-[20px] flex items-center justify-center mx-auto mb-4 opacity-50">
                <Eye className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {searchQuery ? 'No matching content found' : 'No saved content yet'}
              </h3>
              <p className="text-sm text-gray-500">
                {searchQuery ? 'Try a different search term' : 'Generate and save content to see it here'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredContent.map((content) => (
                <div
                  key={content.id}
                  className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 mb-2 line-clamp-1">
                        {content.description}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {content.casual_caption}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(content.created_at)}</span>
                        </div>
                        {content.hashtags && content.hashtags.length > 0 && (
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
                            {content.hashtags.length} hashtags
                          </span>
                        )}
                        {content.image_url && (
                          <span className="px-2 py-1 bg-green-50 text-green-700 rounded-full font-medium">
                            Has image
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleLoad(content)}
                        className="px-4 py-2 bg-[#7CB342] text-white rounded-lg hover:bg-[#6BA03A] transition-colors flex items-center gap-2 font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        Load
                      </button>
                      <button
                        onClick={() => onDeleteContent(content.id)}
                        className="p-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete content"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
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
              {filteredContent.length} {filteredContent.length === 1 ? 'item' : 'items'} saved
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
