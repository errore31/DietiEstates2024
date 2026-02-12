import { Property } from "./property";
import { User } from "./user";

export interface AgencyModel{
    id?: number;
    businessName: string; 
    name: string;        
    address: string;     
    phone: string;       
    email: string;        
    Users?: User[];       
    Properties?: Property[];
}