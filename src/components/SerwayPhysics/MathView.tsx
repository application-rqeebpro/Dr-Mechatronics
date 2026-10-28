import React, { useMemo } from 'react';
import katex from 'katex';

interface MathViewProps {
  math: string;
  block?: boolean;
  className?: string;
}

export const MathView: React.FC<MathViewProps> = ({ math, block = false, className = '' }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
      });
    } catch (e) {
      console.warn('KaTeX render error:', e);
      return math;
    }
  }, [math, block]);

  if (block) {
    return (
      <div
        className={`w-full max-w-full overflow-x-auto overflow-y-hidden text-center py-1.5 px-2 font-serif text-[0.88rem] sm:text-[1rem] md:text-[1.125rem] select-text touch-pan-x ${className}`}
        style={{ WebkitOverflowScrolling: 'touch' }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className={`inline-block max-w-full font-serif align-middle text-[0.9em] sm:text-[1em] overflow-x-auto select-text ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
