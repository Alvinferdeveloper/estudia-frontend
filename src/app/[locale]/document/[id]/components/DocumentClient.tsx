"use client"

import { DocumentFile } from '@/app/[locale]/document/[id]/page';
import { DocumentReader } from './document-reader/DocumentReader';

export default function DocumentClient({ document, requestedPage }: { document: DocumentFile; requestedPage?: number }) {
    return <DocumentReader document={document} requestedPage={requestedPage} />;
}