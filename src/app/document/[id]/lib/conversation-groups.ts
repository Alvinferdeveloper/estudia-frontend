import { Conversation } from "@/app/types";

export interface ConversationGroup {
  label: string;
  conversations: Conversation[];
}

const DAY_MS = 86_400_000;
const MAX_TITLE_LENGTH = 60;

const getGroupLabel = (date: string, startOfToday: number): string => {
  const time = new Date(date).getTime();
  if (time >= startOfToday) return "Hoy";
  if (time >= startOfToday - DAY_MS) return "Ayer";
  if (time >= startOfToday - 7 * DAY_MS) return "Últimos 7 días";
  return "Anteriores";
};

export const groupConversationsByDate = (
  conversations: Conversation[],
  now: Date = new Date()
): ConversationGroup[] => {
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const sorted = [...conversations].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const groups = new Map<string, Conversation[]>();
  for (const conversation of sorted) {
    const label = getGroupLabel(conversation.updatedAt, startOfToday);
    groups.set(label, [...(groups.get(label) ?? []), conversation]);
  }

  return Array.from(groups, ([label, items]) => ({ label, conversations: items }));
};

export const toConversationTitle = (text: string): string => {
  const singleLine = text.trim().replace(/\s+/g, " ");
  return singleLine.length > MAX_TITLE_LENGTH
    ? `${singleLine.slice(0, MAX_TITLE_LENGTH).trimEnd()}…`
    : singleLine;
};
