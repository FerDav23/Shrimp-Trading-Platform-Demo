import React from 'react';
import { CollapsibleSection } from './CollapsibleSection';

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
    <div className="px-6 pb-6">
      <div className="bg-white border border-sky-200 rounded-lg p-4">
        <p className="text-sm text-gray-900">{packerNotes}</p>
      </div>
    </div>
  </CollapsibleSection>
);
