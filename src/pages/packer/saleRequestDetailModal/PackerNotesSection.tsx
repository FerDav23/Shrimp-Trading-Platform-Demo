import React from 'react';
import { CollapsibleSection } from './CollapsibleSection';
import { collapsible, typography, saleRequestDetail } from '../../../styles';

interface PackerNotesSectionProps {
  packerNotes: string;
  expanded?: boolean;
  onToggle?: () => void;
  contentOnly?: boolean;
}

export const PackerNotesSection: React.FC<PackerNotesSectionProps> = ({
  packerNotes,
  expanded = false,
  onToggle = () => {},
  contentOnly = false,
}) => {
  const content = (
    <div className={collapsible.content}>
      <div className={saleRequestDetail.sectionCard}>
        <p className={typography.bodyDark}>{packerNotes}</p>
      </div>
    </div>
  );
  if (contentOnly) return content;
  return (
    <CollapsibleSection title="Notas del Packer" expanded={expanded} onToggle={onToggle}>
      {content}
    </CollapsibleSection>
  );
};
