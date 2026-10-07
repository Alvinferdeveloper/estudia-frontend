import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { privatePageMetadata } from "@/config/seo";
import { LocaleParams } from "@/i18n/routing";
import { resolveLocale } from "@/i18n/paths";
import { getDocument } from "@/app/[locale]/document/[id]/actions";
import { ExamHistory } from "@/app/[locale]/document/[id]/components/exam/ExamHistory";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  return privatePageMetadata(resolveLocale((await params).locale), "exams");
}

export default async function DocumentExamsPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const document = await getDocument(id);

  if (!document) {
    const t = await getTranslations({ locale: resolveLocale(locale), namespace: "reader" });
    return <div>{t("documentNotFound")}</div>;
  }

  return <ExamHistory documentId={id} documentName={document.fileName} />;
}
