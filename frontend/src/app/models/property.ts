export interface PropertyImage {
  url: string;
  order: number;
}

export interface PropertyFeatures {
  roomCount: number;
  area: number;
  hasElevator: boolean;
  floor: number;
  energyClass: string;
}

export interface Property {
  id?: number;
  title: string;
  description: string;
  price: number;
  address: string;
  type: string;
  category: string;
  latitude: number;
  longitude: number;
  agentId?: number;
  
  
  Images?: PropertyImage[]; 
  PropertiesFeature?: PropertyFeatures; 
}