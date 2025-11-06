import { Download, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import type { GeneratedContent } from '../types';

interface ExportSectionProps {
  content: GeneratedContent;
  selectedCaption: string;
}

export function ExportSection({ content, selectedCaption }: ExportSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyAll = () => {
    const text = `
FORMAL CAPTION:
${content.formal}

CASUAL CAPTION:
${content.casual}

FUNNY CAPTION:
${content.funny}

HASHTAGS:
${content.hashtags.join(' ')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = `
AutoPostr - Generated Content
==============================

FORMAL CAPTION:
${content.formal}

CASUAL CAPTION:
${content.casual}

FUNNY CAPTION:
${content.funny}

HASHTAGS:
${content.hashtags.join(' ')}

---
Generated at: ${new Date().toLocaleString()}
    `.trim();

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `autopostr-content-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card-float p-6 mt-6 animate-fade-in">
      <div className="gradient-header-bg mb-6 inline-block">
        <h2 className="text-xl font-bold gradient-text">Export Your Content</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          onClick={handleCopyAll}
          className="btn-schedule flex items-center justify-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 check-bounce" />
              Copied All!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy All Captions
            </>
          )}
        </button>

        <button
          onClick={handleDownload}
          className="btn-schedule flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download as Text
        </button>
      </div>
    </div>
  );
}
