export const status = {
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected',
  cancelled: 'canceled',
} as const;

export type Status = (typeof status)[keyof typeof status];
