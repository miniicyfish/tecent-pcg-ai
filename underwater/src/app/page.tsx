'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { identities } from '@/lib/worldbuilding';
import IdentityCard from '@/components/IdentityCard';

export default function Home() {
  const router = useRouter();
  const [stage, setStage] = useState<'intro' | 'select'>('intro');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (stage === 'intro') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="pixel-text text-4xl font-bold text-accent-gold mb-6 tracking-wider">
          庆余年 · 水下
        </h1>
        <p className="text-text-secondary text-lg mb-2 max-w-md leading-relaxed">
          每部剧都是一座冰山。
        </p>
        <p className="text-text-secondary text-lg mb-10 max-w-md leading-relaxed">
          你看到的，只是水面以上。
        </p>
        <p className="text-text-dim text-sm mb-12 max-w-sm leading-relaxed">
          你将以一个小人物的身份，进入庆余年的世界，
          <br />
          经历那些镜头没有拍到的故事。
        </p>
        <button
          onClick={() => setStage('select')}
          className="px-8 py-3 border border-accent-gold text-accent-gold hover:bg-accent-gold/10 transition-colors pixel-text text-sm tracking-widest"
        >
          进入水下
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center px-6 py-12">
      <h2 className="pixel-text text-xl text-accent-gold mb-2">选择你的身份</h2>
      <p className="text-text-dim text-sm mb-10">
        你的身份决定了你的观察位——你能从哪个角度照亮水下
      </p>

      <div className="grid gap-6 w-full max-w-3xl md:grid-cols-3">
        {identities.map((identity) => (
          <IdentityCard
            key={identity.id}
            identity={identity}
            selected={selectedId === identity.id}
            onClick={() => setSelectedId(identity.id)}
          />
        ))}
      </div>

      {selectedId && (
        <button
          onClick={() => router.push(`/play?id=${selectedId}`)}
          className="mt-10 px-8 py-3 bg-accent-gold/20 border border-accent-gold text-accent-gold hover:bg-accent-gold/30 transition-colors pixel-text text-sm tracking-widest animate-fade-in"
        >
          以此身份进入
        </button>
      )}
    </div>
  );
}
