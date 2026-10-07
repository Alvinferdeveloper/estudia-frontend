import type { Metadata } from "next";
import { privatePageMetadata } from "@/config/seo";
import { LocaleParams } from "@/i18n/routing";
import { resolveLocale } from "@/i18n/paths";
import { AttemptScreen } from "@/app/[locale]/document/[id]/components/exam/AttemptScreen";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  return privatePageMetadata(resolveLocale((await params).locale), "examAttempt");
}

export default async function ExamAttemptPage({
  params,
}: {
  params: Promise<{ id: string; examId: string; attemptId: string }>;
}) {
  const { id, examId, attemptId } = await params;
  return <AttemptScreen documentId={id} examId={examId} attemptId={attemptId} />;
}
