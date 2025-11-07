import { Hash, Copy, Check, Plus, X, Edit2 } from 'lucide-react';
import { useState } from 'react';

interface HashtagDisplayProps {
  hashtags: string[];
  onHashtagsChange?: (hashtags: string[]) => void;
}

export function HashtagDisplay({ hashtags, onHashtagsChange }: HashtagDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedHashtags, setEditedHashtags] = useState<string[]>(hashtags);
  const [newTag, setNewTag] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(editedHashtags.join(' '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRemoveTag = (index: number) => {
    const updated = editedHashtags.filter((_, i) => i !== index);
    setEditedHashtags(updated);
    if (onHashtagsChange) {
      onHashtagsChange(updated);
    }
  };

  const handleAddTag = () => {
    let tag = newTag.trim();
    if (!tag) return;

    if (!tag.startsWith('#')) {
      tag = '#' + tag;
    }

    tag = tag.replace(/\s+/g, '');

    if (tag.length > 1 && !editedHashtags.includes(tag)) {
      const updated = [...editedHashtags, tag];
      setEditedHashtags(updated);
      setNewTag('');
      if (onHashtagsChange) {
        onHashtagsChange(updated);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="card-float p-6 mb-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="gradient-header-bg inline-block">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-teal-600" />
            <h2 className="text-xl font-bold gradient-text">Generated Hashtags</h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onHashtagsChange && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-xs font-semibold transform hover:scale-[0.98] ${
                isEditing
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <Edit2 className="w-3.5 h-3.5" />
              {isEditing ? 'Done' : 'Edit'}
            </button>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-xl transition-all text-xs font-semibold text-gray-700 transform hover:scale-[0.98]"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-600 check-bounce" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {isEditing && onHashtagsChange && (
        <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl animate-fade-in">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="🔍 Add new hashtag..."
              className="flex-1 input-orange text-sm"
            />
            <button
              onClick={handleAddTag}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-teal-700 transition-all flex items-center gap-2 text-xs transform hover:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            💡 Tip: You can add tags with or without the # symbol. Press Enter to add.
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {editedHashtags.map((tag, index) => (
          <div
            key={index}
            className={`group relative px-3 py-1.5 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 text-blue-700 rounded-xl text-xs font-medium border border-blue-200 transition-all hover:shadow-md hover:-translate-y-0.5 ${
              isEditing && onHashtagsChange ? 'pr-8' : ''
            }`}
          >
            {tag}
            {isEditing && onHashtagsChange && (
              <button
                onClick={() => handleRemoveTag(index)}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 bg-red-100 hover:bg-red-200 rounded-full transition-all opacity-0 group-hover:opacity-100"
                title="Remove tag"
              >
                <X className="w-2.5 h-2.5 text-red-600" />
              </button>
            )}
          </div>
        ))}
      </div>

      {editedHashtags.length === 0 && (
        <p className="text-gray-500 text-center py-4">
          No hashtags yet. Click "Add" to create your first hashtag.
        </p>
      )}
    </div>
  );
}
