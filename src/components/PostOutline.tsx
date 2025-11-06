import { FileText, Clock, Target, Zap, Check } from 'lucide-react';
import { useState } from 'react';
import type { PostOutline as PostOutlineType } from '../services/visualGenerator';

interface PostOutlineProps {
  outline: PostOutlineType;
}

export function PostOutline({ outline }: PostOutlineProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const toggleStep = (index: number) => {
    if (completedSteps.includes(index)) {
      setCompletedSteps(completedSteps.filter(i => i !== index));
    } else {
      setCompletedSteps([...completedSteps, index]);
    }
  };

  return (
    <div className="card-float p-6 mb-6 animate-fade-in">
      <div className="gradient-header-bg mb-6 inline-block">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-[#8FA6FF]" />
          <h2 className="text-2xl font-bold text-[#3C3C3C]">Post Structure Outline</h2>
        </div>
      </div>
      <p className="text-base text-gray-600 mb-6">Optimized content strategy for maximum engagement</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="card-float p-4 bg-gradient-to-br from-blue-50 to-cyan-50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 border-2 rounded-lg flex items-center justify-center bg-transparent" style={{ borderColor: '#5ABA8A' }}>
                <Zap className="w-4 h-4" style={{ color: '#5ABA8A', fill: 'none', strokeWidth: 2 }} />
              </div>
              <h3 className="font-semibold text-gray-800 text-base">💡 Opening Hook</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed pl-10">{outline.hook}</p>
          </div>

          <div className="card-float p-4 bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 border-2 rounded-lg flex items-center justify-center bg-transparent" style={{ borderColor: '#5ABA8A' }}>
                <Target className="w-4 h-4" style={{ color: '#5ABA8A', fill: 'none', strokeWidth: 2 }} />
              </div>
              <h3 className="font-semibold text-gray-800 text-base">📝 Main Message</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed pl-10">{outline.mainMessage}</p>
          </div>

          <div className="card-float p-4 bg-gradient-to-br from-orange-50 to-red-50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 border-2 rounded-lg flex items-center justify-center bg-transparent" style={{ borderColor: '#5ABA8A' }}>
                <Target className="w-4 h-4" style={{ color: '#5ABA8A', fill: 'none', strokeWidth: 2 }} />
              </div>
              <h3 className="font-semibold text-gray-800 text-base">🎯 Call-to-Action</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed pl-10">{outline.callToAction}</p>
          </div>

          <div className="card-float p-4 bg-gradient-to-br from-green-50 to-teal-50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 border-2 rounded-lg flex items-center justify-center bg-transparent" style={{ borderColor: '#5ABA8A' }}>
                <Clock className="w-4 h-4" style={{ color: '#5ABA8A', fill: 'none', strokeWidth: 2 }} />
              </div>
              <h3 className="font-semibold text-gray-800 text-base">⏰ Best Time to Post</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed pl-10">{outline.bestTimeToPost}</p>
          </div>
        </div>

        <div className="card-float p-5 bg-white">
          <div className="gradient-header-bg mb-4 inline-block">
            <h3 className="font-semibold text-base flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Content Structure Blueprint
            </h3>
          </div>
          <div className="space-y-2">
            {outline.structure.map((item, index) => (
              <div
                key={index}
                className={`workflow-step cursor-pointer ${completedSteps.includes(index) ? 'completed' : ''}`}
                onClick={() => toggleStep(index)}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all pointer-events-none ${
                    completedSteps.includes(index)
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-transparent border-[#8FA6FF] text-[#8FA6FF]'
                  }`}>
                    {completedSteps.includes(index) && (
                      <Check className="w-4 h-4 check-bounce" />
                    )}
                  </div>
                  <span className="text-sm text-gray-700 leading-relaxed flex-1">{item}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 rounded-xl border border-yellow-200">
        <p className="text-sm text-gray-700">
          <strong>📊 Engagement Tip:</strong> Posts that follow this structure typically see 2-3x higher
          engagement rates. Start with a strong hook, deliver value, and always include a clear call-to-action.
        </p>
      </div>
    </div>
  );
}
