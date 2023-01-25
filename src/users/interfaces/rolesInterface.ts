export const superRoles = {
  admin: 'admin',
  assistant: 'assistant',
} as const;

export type SuperRoles = (typeof superRoles)[keyof typeof superRoles];

export type Roles = (typeof superRoles)[keyof typeof superRoles] | 'employee';
