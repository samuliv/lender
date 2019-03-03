import { Injectable } from '@angular/core';
import { Coordinates } from 'src/app/interfaces/coordinates';

@Injectable({
  providedIn: 'root'
})
export class GpsPositionService {

  constructor() { }

  getGPSCoordinates(): Coordinates {
    // TODO : Add real GPS coordinates from GPS... This is just for development with Web Browser
    return {latitude: 60.234245, longitude: 24.813530};
  }

  getCurrentLocationName(): string {
    // TODO
    return 'Espoo';
  }

  isLocationAvailable(): boolean {
    // TODO
    return true;
  }
}
