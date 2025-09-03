"use client"

import nextDynamic from 'next/dynamic';
import { DocumentFile } from '../page';

const DocumentReader = nextDynamic(() => import('./DocumentReader').then(mod => mod.DocumentClient), { ssr: false });

export default function DocumentClient({ document }: { document: DocumentFile }) {
  return <DocumentReader document={document} />;
}