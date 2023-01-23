export const roles = {
  admin: 'admin',
  assistant: 'assistant',
} as const;

export type Roles = (typeof roles)[keyof typeof roles];
