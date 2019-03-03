import { Coordinates } from './coordinates';

export interface Address {
    address: string;
    city: string;
    country: string;
    continent: string;
    state: string;
    suburb: string;
    coordinates: Coordinates;
  }
