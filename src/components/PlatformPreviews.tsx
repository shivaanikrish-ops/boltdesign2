import { Instagram, Twitter, Linkedin, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface PlatformPreviewsProps {
  caption: string;
  hashtags: string[];
  imageUrl: string | null;
}

export function PlatformPreviews({ caption, hashtags, imageUrl }: PlatformPreviewsProps) {
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);

  const handleCopy = (platform: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPlatform(platform);
    setTimeout(() => setCopiedPlatform(null), 2000);
  };

  const getInstagramContent = () => {
    const hashtagStr = hashtags.slice(0, 10).join(' ');
    return `${caption}\n\n${hashtagStr}`;
  };

  const getTwitterContent = () => {
    const maxLength = 280;
    const hashtagStr = hashtags.slice(0, 3).join(' ');
    let content = `${caption}\n\n${hashtagStr}`;
    if (content.length > maxLength) {
      const allowedCaptionLength = maxLength - hashtagStr.length - 5;
      content = `${caption.substring(0, allowedCaptionLength)}...\n\n${hashtagStr}`;
    }
    return content;
  };

  const getLinkedInContent = () => {
    const hashtagStr = hashtags.slice(0, 5).join(' ');
    return `${caption}\n\n${hashtagStr}`;
  };

  const platforms = [
    {
      name: 'Instagram',
      icon: Instagram,
      color: 'from-purple-600 to-pink-500',
      content: getInstagramContent(),
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'from-blue-400 to-blue-600',
      content: getTwitterContent(),
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'from-blue-600 to-blue-800',
      content: getLinkedInContent(),
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50'
    }
  ];

  return (
    <div className="card-float p-6 mb-6 animate-fade-in">
      <div className="gradient-header-bg mb-6 inline-block">
        <h2 className="text-xl font-bold gradient-text">Platform Previews</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {platforms.map((platform, index) => {
          const Icon = platform.icon;
          return (
            <div key={platform.name} className="flex flex-col stagger-item" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className={`flex items-center gap-2 mb-3 pb-2 border-b`}>
                <div className={`w-7 h-7 bg-gradient-to-br ${platform.color} rounded-lg flex items-center justify-center shadow-sm`}>
                  <Icon className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-semibold text-sm text-gray-800">{platform.name}</span>
              </div>

              <div className={`${platform.bgColor} rounded-xl p-4 flex-1 border border-gray-200 card-float`}>
                {imageUrl && (
                  <div className="mb-3 rounded-lg overflow-hidden">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-40 object-cover"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-xs text-gray-800">Your Brand</p>
                      <p className="text-xs text-gray-700 whitespace-pre-wrap break-words mt-1 leading-relaxed">
                        {platform.content}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleCopy(platform.name, platform.content)}
                className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-xl transition-all text-xs font-semibold text-gray-700 transform hover:scale-[0.98]"
              >
                {copiedPlatform === platform.name ? (
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
          );
        })}
      </div>
    </div>
  );
}
