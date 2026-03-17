import type { User } from "./data";
import mockUsers from "./mock-users.json";

/**
 * Server-only: returns pre-generated mock users from static JSON.
 * Regenerate with: node -e "..." (see scripts/generate-mock-users.ts or README)
 */
export function getCachedMockUsers(): Promise<User[]> {
  return Promise.resolve(mockUsers as User[]);
}
