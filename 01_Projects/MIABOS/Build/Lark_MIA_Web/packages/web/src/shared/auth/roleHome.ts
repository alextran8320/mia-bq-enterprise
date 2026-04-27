export function roleHome(role: string | null | undefined): string {
  return role === "staff" ? "/ai/chat" : "/analytics/executive";
}
