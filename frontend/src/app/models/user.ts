export interface User {
  id: number;
  username: string;
  ruolo: string;
  idAg?: number; // idAgency is optional
}