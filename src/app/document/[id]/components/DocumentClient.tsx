"use client"

import { DocumentFile } from '@/app/document/[id]/page';
import { DocumentReader } from './document-reader/DocumentReader';

export default function DocumentClient({ document }: { document: DocumentFile }) {
    return <DocumentReader document={document} />;
}