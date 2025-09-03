"use client"

import nextDynamic from 'next/dynamic';

const DocumentReader = nextDynamic(() => import('./DocumentReader').then(mod => mod.DocumentClient), { ssr: false });

export default function DocumentClient({ document }: { document: any }) {
  return <DocumentReader document={document} />;
}