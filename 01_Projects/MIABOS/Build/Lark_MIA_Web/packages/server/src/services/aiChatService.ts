import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "../db/client.js";
import {
  aiChatMessages,
  aiChatSessions,
  type AiChatMessage,
  type AiChatSession,
} from "../db/schema.js";
import { HttpError } from "../lib/httpError.js";
import { runHaravanFlow } from "./haravanChat.js";

const MAX_TITLE_LENGTH = 60;

function buildTitle(message: string): string {
  const cleaned = message.replace(/\s+/g, " ").trim();
  if (!cleaned) return "Cuộc trò chuyện mới";
  return cleaned.length > MAX_TITLE_LENGTH
    ? `${cleaned.slice(0, MAX_TITLE_LENGTH - 1)}…`
    : cleaned;
}

export async function listSessionsForUser(
  userId: string,
): Promise<AiChatSession[]> {
  return db
    .select()
    .from(aiChatSessions)
    .where(eq(aiChatSessions.userId, userId))
    .orderBy(desc(aiChatSessions.lastActiveAt));
}

export async function createSessionForUser(
  userId: string,
): Promise<AiChatSession> {
  const [created] = await db
    .insert(aiChatSessions)
    .values({ userId })
    .returning();
  if (!created) throw new HttpError(500, "Không tạo được cuộc trò chuyện");
  return created;
}

async function loadOwnedSession(
  sessionId: string,
  userId: string,
): Promise<AiChatSession> {
  const [session] = await db
    .select()
    .from(aiChatSessions)
    .where(
      and(eq(aiChatSessions.id, sessionId), eq(aiChatSessions.userId, userId)),
    )
    .limit(1);
  if (!session) throw new HttpError(404, "Không tìm thấy cuộc trò chuyện");
  return session;
}

export async function getMessagesForSession(
  sessionId: string,
  userId: string,
): Promise<AiChatMessage[]> {
  await loadOwnedSession(sessionId, userId);
  return db
    .select()
    .from(aiChatMessages)
    .where(eq(aiChatMessages.sessionId, sessionId))
    .orderBy(asc(aiChatMessages.createdAt));
}

export async function deleteSessionForUser(
  sessionId: string,
  userId: string,
): Promise<void> {
  await loadOwnedSession(sessionId, userId);
  await db.delete(aiChatSessions).where(eq(aiChatSessions.id, sessionId));
}

export interface SendMessageResult {
  user: AiChatMessage;
  assistant: AiChatMessage | null;
  error: AiChatMessage | null;
  session: AiChatSession;
}

export async function sendMessage(
  sessionId: string,
  userId: string,
  message: string,
): Promise<SendMessageResult> {
  const session = await loadOwnedSession(sessionId, userId);

  const [userMessage] = await db
    .insert(aiChatMessages)
    .values({ sessionId, role: "user", content: message })
    .returning();
  if (!userMessage) throw new HttpError(500, "Không lưu được câu hỏi");

  // First user message in the session — derive a title for the sidebar.
  const isFirstMessage = session.title === "Cuộc trò chuyện mới";
  const titlePatch = isFirstMessage ? { title: buildTitle(message) } : {};

  try {
    const { text, responseMs } = await runHaravanFlow(message, sessionId);
    const [assistantMessage] = await db
      .insert(aiChatMessages)
      .values({
        sessionId,
        role: "assistant",
        content: text,
        meta: { responseMs },
      })
      .returning();

    const [updated] = await db
      .update(aiChatSessions)
      .set({ ...titlePatch, lastActiveAt: new Date() })
      .where(eq(aiChatSessions.id, sessionId))
      .returning();

    return {
      user: userMessage,
      assistant: assistantMessage ?? null,
      error: null,
      session: updated ?? session,
    };
  } catch (err) {
    const errorText =
      err instanceof HttpError
        ? err.message
        : "Đã có lỗi xảy ra khi gọi Trợ lý AI.";
    const [errorMessage] = await db
      .insert(aiChatMessages)
      .values({
        sessionId,
        role: "error",
        content: errorText,
        meta: { kind: "haravan-upstream" },
      })
      .returning();

    const [updated] = await db
      .update(aiChatSessions)
      .set({ ...titlePatch, lastActiveAt: new Date() })
      .where(eq(aiChatSessions.id, sessionId))
      .returning();

    return {
      user: userMessage,
      assistant: null,
      error: errorMessage ?? null,
      session: updated ?? session,
    };
  }
}
