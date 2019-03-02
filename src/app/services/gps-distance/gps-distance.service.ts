import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GpsDistanceService {

  constructor() { }

  private degreesToRadians(val: number) {
    return val * Math.PI / 180;
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);

    lat1 = this.degreesToRadians(lat1);
    lat2 = this.degreesToRadians(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return (6371 * c);
  }

  formatDistance(distance: number) {
    if (distance >= 10) {
      return Math.round(distance) + ' km';
    } else if (distance >= 1) {
      return (Math.round(distance * 10) / 10) + ' km';
    } else {
      return (Math.round(distance * 100) * 10) + ' m';
    }
  }
}
