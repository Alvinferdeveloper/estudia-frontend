import { QueryProvider } from "@/app/providers/QueryProvider";
import { getDocument, touchDocumentAccess } from "./actions";
import DocumentClient from "./components/DocumentClient";
import { Document } from "@/app/types";
import type { Metadata } from "next";
import { privatePageMetadata } from "@/config/seo";
import { LocaleParams } from "@/i18n/routing";
import { resolveLocale } from "@/i18n/paths";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  return privatePageMetadata(resolveLocale((await params).locale), "document");
}

export interface DocumentFile extends Document {
  publicUrl: string;
}

export default async function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const document = await getDocument(id) as DocumentFile;

  if (!document) {
    return <div>Document not found</div>;
  }

  void touchDocumentAccess(id);

  return (
    <QueryProvider>
      <DocumentClient document={document} />
    </QueryProvider>
  )
}
