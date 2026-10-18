import type { Metadata } from "next";
import { privatePageMetadata } from "@/config/seo";
import { LocaleParams } from "@/i18n/routing";
import { resolveLocale } from "@/i18n/paths";
import { getDocument } from "@/app/[locale]/document/[id]/actions";
import { ReviewView } from "@/app/[locale]/review/components/ReviewView";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  return privatePageMetadata(resolveLocale((await params).locale), "review");
}

// `?document=ID` limits the review to one document; an unknown one falls back to all of them.
export default async function ReviewPage({ searchParams }: { searchParams: Promise<{ document?: string }> }) {
  const documentId = (await searchParams).document;
  const document = documentId ? await getDocument(documentId) : null;

  return <ReviewView document={document ? { id: document.id, name: document.fileName } : undefined} />;
}
