import React from 'react';
import { CollapsibleSection } from './CollapsibleSection';
import { collapsible, typography } from '../../../styles';

interface PackerNotesSectionProps {
  packerNotes: string;
  expanded: boolean;
  onToggle: () => void;
}

export const PackerNotesSection: React.FC<PackerNotesSectionProps> = ({
  packerNotes,
  expanded,
  onToggle,
}) => (
  <CollapsibleSection title="Notas del Packer" expanded={expanded} onToggle={onToggle}>
    <div className={collapsible.content}>
      <div className={collapsible.innerBox}>
        <p className={typography.bodyDark}>{packerNotes}</p>
      </div>
    </div>
  </CollapsibleSection>
);
