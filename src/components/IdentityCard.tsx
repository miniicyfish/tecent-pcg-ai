'use client';

import Image from 'next/image';
import { Identity } from '@/lib/worldbuilding';

interface Props {
  identity: Identity;
  selected: boolean;
  onClick: () => void;
}

export default function IdentityCard({ identity, selected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`text-left p-5 border transition-all h-full flex flex-col ${
        selected
          ? 'border-accent-gold bg-accent-gold/10'
          : 'border-border hover:border-text-dim bg-bg-card'
      }`}
    >
      <div className="relative w-full aspect-square max-h-48 bg-bg-surface border border-border mb-4 overflow-hidden">
        <Image
          src={identity.avatar}
          alt={identity.name}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>

      <h3 className="text-accent-gold font-bold mb-1">{identity.name}</h3>
      <p className="text-text-secondary text-sm mb-2">{identity.title}</p>
      <p className="text-text-dim text-xs mb-3 leading-relaxed">
        {identity.location}
      </p>
      <p className="text-text-secondary text-xs leading-relaxed">
        {identity.description}
      </p>
      <p className="text-accent-blue text-xs mt-3 leading-relaxed">
        {identity.depthAngle}
      </p>
    </button>
  );
}
