import { useState } from 'react';
import { Image, Lightbulb, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import type { VisualSuggestion } from '../services/visualGenerator';

interface VisualSuggestionsProps {
  suggestions: VisualSuggestion[];
}

export function VisualSuggestions({ suggestions }: VisualSuggestionsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyPrompt = (id: string, prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="card-float p-6 mb-6 animate-fade-in">
      <div className="gradient-header-bg mb-6 inline-block">
        <div className="flex items-center gap-3">
          <Lightbulb className="w-5 h-5 text-orange-500" />
          <h2 className="text-xl font-bold gradient-text">AI Visual Suggestions</h2>
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-6">Generate images with these prompts in your favorite AI tool</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {suggestions.map((suggestion, index) => (
          <div
            key={suggestion.id}
            className="suggestion-card stagger-item"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Image className="w-5 h-5 text-pink-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 text-sm">{suggestion.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{suggestion.description}</p>
              </div>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                  {suggestion.style}
                </span>
                <span className="px-2.5 py-1 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-lg text-xs font-medium">
                  {suggestion.aspectRatio}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {suggestion.recommendedPlatforms.map((platform) => (
                  <span
                    key={platform}
                    className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-xs"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => setExpandedId(expandedId === suggestion.id ? null : suggestion.id)}
              className="w-full flex items-center justify-between px-3 py-2 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl transition-all text-xs font-medium text-gray-700 mb-2"
            >
              <span>🔍 AI Generation Prompt</span>
              {expandedId === suggestion.id ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {expandedId === suggestion.id && (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-3 mb-2 animate-fade-in">
                <p className="text-xs text-gray-700 leading-relaxed mb-3">
                  {suggestion.prompt}
                </p>
                <button
                  onClick={() => handleCopyPrompt(suggestion.id, suggestion.prompt)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 rounded-xl transition-all text-xs font-semibold text-gray-700 border border-gray-200 hover:border-blue-300 hover:shadow-md transform hover:scale-[0.98]"
                >
                  {copiedId === suggestion.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600 check-bounce" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Prompt
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-gradient-to-r from-pink-50 via-orange-50 to-yellow-50 rounded-xl border border-pink-200">
        <p className="text-xs text-gray-700">
          <strong>💡 Pro Tip:</strong> Use these prompts with AI image generators like DALL-E, Midjourney,
          Stable Diffusion, or Leonardo.ai to create custom visuals perfectly matched to your campaign.
        </p>
      </div>
    </div>
  );
}
