"use client"

import nextDynamic from 'next/dynamic';
import { DocumentFile } from '../page';

const DocumentReader = nextDynamic(() => import('./document-reader/DocumentReader').then(mod => mod.DocumentReader), { ssr: false });

export default function DocumentClient({ document }: { document: DocumentFile }) {
    return <DocumentReader document={document} />;
}