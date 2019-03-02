import { Injectable } from '@angular/core';
import { Coordinates } from 'src/app/interfaces/coordinates';

@Injectable({
  providedIn: 'root'
})
export class GpsPositionService {

  constructor() { }

  getGPSCoordinates(): Coordinates {
    return {latitude: 60.234245, longitude: 24.813530};
  }
}
