//type of transactions, there will be more in near future
export interface TypeRequestFolio {
  vacation: 'VAC';
  contingency: 'CON';
}

export const request_type = {
  vacation: 'Vacation',
  contingency: 'Contingency',
} as const;

//used to type the status at typescript level
export type RequestType = (typeof request_type)[keyof typeof request_type];
