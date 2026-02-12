export interface User {
  id: number;
  username: string;
  role: string;
  name: string;
  surname:string;
  email: string;
  idAg?: number; // idAgency is optional
}