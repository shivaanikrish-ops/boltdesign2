import { useState } from 'react';
import { Video, CheckCircle, ChevronDown } from 'lucide-react';
import { getVideoOptimizationTips } from '../services/visualGenerator';

export function VideoOptimizationTips() {
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null);

  const platforms = [
    { name: 'Instagram', color: 'from-purple-500 to-pink-500', icon: '📷' },
    { name: 'Twitter', color: 'from-blue-400 to-cyan-500', icon: '🐦' },
    { name: 'LinkedIn', color: 'from-blue-600 to-blue-800', icon: '💼' },
    { name: 'Facebook', color: 'from-blue-500 to-indigo-600', icon: '👥' }
  ];

  const togglePlatform = (platformName: string) => {
    setExpandedPlatform(expandedPlatform === platformName ? null : platformName);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Platform-Specific Tips</h3>
        <p className="text-sm text-gray-600 mb-6">Click on a platform to view optimization tips</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {platforms.map((platform) => (
            <button
              key={platform.name}
              onClick={() => togglePlatform(platform.name)}
              className={`relative p-6 rounded-xl border-2 transition-all ${
                expandedPlatform === platform.name
                  ? 'border-gray-400 bg-gray-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div className={`w-16 h-16 bg-gradient-to-br ${platform.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <span className="text-3xl">{platform.icon}</span>
                </div>
                <span className="font-semibold text-gray-900 text-sm">{platform.name}</span>
                {expandedPlatform === platform.name && (
                  <ChevronDown className="w-4 h-4 text-gray-600 animate-bounce" />
                )}
              </div>
            </button>
          ))}
        </div>

        {expandedPlatform && (
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 bg-gradient-to-br ${
                platforms.find(p => p.name === expandedPlatform)?.color
              } rounded-lg flex items-center justify-center`}>
                <span className="text-xl">
                  {platforms.find(p => p.name === expandedPlatform)?.icon}
                </span>
              </div>
              <h4 className="font-bold text-gray-900 text-lg">{expandedPlatform} Video Tips</h4>
            </div>

            <ul className="space-y-3">
              {getVideoOptimizationTips(expandedPlatform).map((tip, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#7CB342] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-4">General Best Practices</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
            <h4 className="font-semibold text-gray-800 mb-2">Mobile-First</h4>
            <p className="text-sm text-gray-600">
              90% of social media users access via mobile. Always optimize for vertical or square formats.
            </p>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
            <h4 className="font-semibold text-gray-800 mb-2">Silent Viewing</h4>
            <p className="text-sm text-gray-600">
              85% watch without sound. Include captions and text overlays for maximum impact.
            </p>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border border-green-200">
            <h4 className="font-semibold text-gray-800 mb-2">First 3 Seconds</h4>
            <p className="text-sm text-gray-600">
              Hook viewers immediately. The opening determines if they'll watch to completion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
