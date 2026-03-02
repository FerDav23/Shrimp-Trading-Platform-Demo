import React from 'react';
import { collapsible } from '../../../styles';

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className={`${collapsible.chevron} ${expanded ? collapsible.chevronExpanded : ''}`}
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
  const sectionClass = variant === 'rejection' ? collapsible.sectionRejection : collapsible.sectionDefault;
  const buttonClass = variant === 'rejection' ? collapsible.buttonRejection : collapsible.buttonDefault;

  return (
    <section className={sectionClass}>
      <button type="button" onClick={onToggle} className={buttonClass}>
        <h3 className={collapsible.title}>{title}</h3>
        <span className="text-gray-700">
          <ChevronIcon expanded={expanded} />
        </span>
      </button>
      {expanded && children}
    </section>
  );
};
