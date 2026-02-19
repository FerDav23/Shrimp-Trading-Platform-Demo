import React from 'react';

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className={`w-5 h-5 transition-transform ${expanded ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export interface CollapsibleSectionProps {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  /** Optional: different border/bg for rejection section */
  variant?: 'default' | 'rejection';
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  expanded,
  onToggle,
  children,
  variant = 'default',
}) => {
  const sectionClass =
    variant === 'rejection'
      ? 'rounded-xl border-2 border-red-200 bg-red-50/50 shadow-sm overflow-hidden'
      : 'rounded-xl border-2 border-sky-400/60 bg-sky-50 shadow-sm overflow-hidden';
  const buttonClass =
    variant === 'rejection'
      ? 'w-full flex items-center justify-between p-4 text-left text-gray-900 hover:bg-red-100/50 transition-colors'
      : 'w-full flex items-center justify-between p-4 text-left text-gray-900 hover:bg-sky-100/50 transition-colors';

  return (
    <section className={sectionClass}>
      <button type="button" onClick={onToggle} className={buttonClass}>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className="text-gray-700">
          <ChevronIcon expanded={expanded} />
        </span>
      </button>
      {expanded && children}
    </section>
  );
};
