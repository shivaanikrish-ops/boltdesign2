import { Check } from 'lucide-react';

interface StepNavigatorProps {
  currentStep: 1 | 2 | 3;
  onStepClick: (step: 1 | 2 | 3) => void;
  canNavigate: {
    step1: boolean;
    step2: boolean;
    step3: boolean;
  };
}

export function StepNavigator({ currentStep, onStepClick, canNavigate }: StepNavigatorProps) {
  const steps = [
    { number: 1, label: 'Create', enabled: canNavigate.step1 },
    { number: 2, label: 'Review', enabled: canNavigate.step2 },
    { number: 3, label: 'Customize', enabled: canNavigate.step3 }
  ];

  return (
    <div className="card-float p-6 mb-8 animate-fade-in">
      <div className="flex items-center justify-center max-w-3xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <button
              onClick={() => onStepClick(step.number as 1 | 2 | 3)}
              className={`flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity ${
                step.enabled ? '' : 'opacity-50'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                  currentStep === step.number
                    ? 'bg-gradient-to-br from-[#7CB342] to-[#4CAF50] text-white shadow-lg'
                    : currentStep > step.number
                    ? 'bg-gray-200 text-gray-500'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {currentStep > step.number ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.number
                )}
              </div>
              <div className={`text-sm font-medium ${
                currentStep === step.number ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {step.label}
              </div>
            </button>
            {index < steps.length - 1 && (
              <div
                className={`w-24 h-0.5 mx-4 transition-all duration-300 ${
                  currentStep > step.number ? 'bg-gray-300' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="text-center mt-6 relative">
        <div className="inline-block bg-gradient-to-r from-[#7CB342] via-[#FFD54F] to-[#42A5F5] p-4 rounded-2xl shadow-2xl animate-pulse">
          <p className="text-lg font-black tracking-wide text-white drop-shadow-lg transform hover:scale-105 transition-transform">
            ✨ PRESS THE NUMBERS TO NAVIGATE BACK OR FORTH ✨
          </p>
        </div>
      </div>
    </div>
  );
}
