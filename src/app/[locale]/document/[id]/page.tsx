import { QueryProvider } from "@/app/providers/QueryProvider";
import { getDocument, touchDocumentAccess } from "./actions";
import DocumentClient from "./components/DocumentClient";
import { Document } from "@/app/types";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { privatePageMetadata } from "@/config/seo";
import { LocaleParams } from "@/i18n/routing";
import { resolveLocale } from "@/i18n/paths";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  return privatePageMetadata(resolveLocale((await params).locale), "document");
}

export interface DocumentFile extends Document {
  publicUrl: string;
}

export default async function DocumentPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const document = await getDocument(id) as DocumentFile;

  if (!document) {
    const t = await getTranslations({ locale: resolveLocale(locale), namespace: "reader" });
    return <div>{t("documentNotFound")}</div>;
  }

  void touchDocumentAccess(id);

  return (
    <QueryProvider>
      <DocumentClient document={document} />
    </QueryProvider>
  )
}
