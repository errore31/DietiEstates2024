export interface User {
  id?: number;
  name: string;
  surname: string;
  username: string;
  email: string;
  password: string;
  role: string;
  agencyId?: number;
  receivePromos?: boolean;
  receiveProperties?: boolean;
}