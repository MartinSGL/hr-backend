// availables project roles
//this is used to command the entity (schemma) that only accept this values in the collection
export const project_role = {
  ADM: 'ADM', //Account Delivery Manager
  DO: 'DO', //Delivery Owner
  DM: 'DM', //Delivery Manager
  AO: 'AO', //Account Owner
  TL: 'TL', //Technical Lead
} as const;

//used to type the status at typescript level
export type ProjectRole = (typeof project_role)[keyof typeof project_role];
