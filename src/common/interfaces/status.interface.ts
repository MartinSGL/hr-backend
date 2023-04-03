//avaliable status for all type of request (vacations,contignency,etc)
//this is used to command the entity (schemma) that only accept this values in the collection
export const status = {
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected',
  canceled: 'canceled',
} as const;

//used to type the status at typescript level
export type Status = (typeof status)[keyof typeof status];

//posibles status of preauthorizations from project responsibles
export const statusPreauthorizaton = {
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected',
} as const;

export type StatusPreauthorization =
  (typeof statusPreauthorizaton)[keyof typeof statusPreauthorizaton];
