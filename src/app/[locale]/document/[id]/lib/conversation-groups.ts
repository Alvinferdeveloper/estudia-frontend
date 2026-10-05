import { Conversation } from "@/app/types";

export type ConversationGroupKey = "today" | "yesterday" | "last7Days" | "older";

export interface ConversationGroup {
  key: ConversationGroupKey;
  conversations: Conversation[];
}

const DAY_MS = 86_400_000;
const MAX_TITLE_LENGTH = 60;

const getGroupKey = (date: string, startOfToday: number): ConversationGroupKey => {
  const time = new Date(date).getTime();
  if (time >= startOfToday) return "today";
  if (time >= startOfToday - DAY_MS) return "yesterday";
  if (time >= startOfToday - 7 * DAY_MS) return "last7Days";
  return "older";
};

export const groupConversationsByDate = (
  conversations: Conversation[],
  now: Date = new Date()
): ConversationGroup[] => {
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const sorted = [...conversations].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const groups = new Map<ConversationGroupKey, Conversation[]>();
  for (const conversation of sorted) {
    const key = getGroupKey(conversation.updatedAt, startOfToday);
    groups.set(key, [...(groups.get(key) ?? []), conversation]);
  }

  return Array.from(groups, ([key, items]) => ({ key, conversations: items }));
};

export const toConversationTitle = (text: string): string => {
  const singleLine = text.trim().replace(/\s+/g, " ");
  return singleLine.length > MAX_TITLE_LENGTH
    ? `${singleLine.slice(0, MAX_TITLE_LENGTH).trimEnd()}…`
    : singleLine;
};
