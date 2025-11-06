import { useState } from 'react';
import { Check } from 'lucide-react';
import type { GeneratedContent, ToneType } from '../types';

interface CaptionSelectorProps {
  content: GeneratedContent;
  onSelectTone: (tone: ToneType) => void;
}

export function CaptionSelector({ content, onSelectTone }: CaptionSelectorProps) {
  const [selectedTone, setSelectedTone] = useState<ToneType>('casual');

  const handleSelect = (tone: ToneType) => {
    setSelectedTone(tone);
    onSelectTone(tone);
  };

  const tones: { type: ToneType; label: string; color: string; description: string }[] = [
    {
      type: 'formal',
      label: 'Formal',
      color: 'from-slate-500 to-slate-700',
      description: 'Professional & polished'
    },
    {
      type: 'casual',
      label: 'Casual',
      color: 'from-blue-500 to-cyan-500',
      description: 'Friendly & approachable'
    },
    {
      type: 'funny',
      label: 'Funny',
      color: 'from-orange-500 to-pink-500',
      description: 'Humorous & engaging'
    }
  ];

  return (
    <div className="card-float p-6 mb-6 animate-fade-in">
      <div className="gradient-header-bg mb-6 inline-block">
        <h2 className="text-xl font-bold gradient-text">Choose Your Tone</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {tones.map(({ type, label, color, description }) => (
          <button
            key={type}
            onClick={() => handleSelect(type)}
            className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
              selectedTone === type
                ? 'border-orange-400 shadow-lg scale-[1.02]'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
          >
            <div className={`w-full h-2 bg-gradient-to-r ${color} rounded-full mb-3`} />
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-gray-800 text-sm">{label}</span>
              {selectedTone === type && (
                <div className="w-5 h-5 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white check-bounce" />
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 text-left">{description}</p>
          </button>
        ))}
      </div>

      <div className="card-float p-5 bg-gradient-to-br from-gray-50 to-blue-50">
        <h3 className="font-semibold text-gray-700 mb-3 text-sm">📝 Preview Caption</h3>
        <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
          {content[selectedTone]}
        </p>
      </div>
    </div>
  );
}
