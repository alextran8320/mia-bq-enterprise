import { apiClient } from "@/shared/auth/apiClient";

export type ChatRole = "user" | "assistant" | "error";

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  lastActiveAt: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: ChatRole;
  content: string;
  meta: Record<string, unknown> | null;
  createdAt: string;
}

export interface SendMessageResponse {
  user: ChatMessage;
  assistant: ChatMessage | null;
  error: ChatMessage | null;
  session: ChatSession;
}

export const aiChatApi = {
  listSessions: () =>
    apiClient
      .get<{ sessions: ChatSession[] }>("/ai-workspace/sessions")
      .then((r) => r.data.sessions),

  createSession: () =>
    apiClient
      .post<{ session: ChatSession }>("/ai-workspace/sessions")
      .then((r) => r.data.session),

  getMessages: (sessionId: string) =>
    apiClient
      .get<{ messages: ChatMessage[] }>(
        `/ai-workspace/sessions/${sessionId}/messages`,
      )
      .then((r) => r.data.messages),

  sendMessage: (sessionId: string, message: string) =>
    apiClient
      .post<SendMessageResponse>(
        `/ai-workspace/sessions/${sessionId}/messages`,
        { message },
        // Haravan flow can take 30-60s; override the 15s default in apiClient.
        { timeout: 70_000 },
      )
      .then((r) => r.data),

  deleteSession: (sessionId: string) =>
    apiClient.delete(`/ai-workspace/sessions/${sessionId}`).then(() => {}),
};
