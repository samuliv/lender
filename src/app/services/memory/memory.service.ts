import { Injectable } from '@angular/core';
import { Coordinates } from 'src/app/interfaces/coordinates';

@Injectable({
  providedIn: 'root'
})
export class MemoryService {

  constructor() { }

  defaultLocationIsAvailable() {
    if (this.memReadString('lender-default-location-set', '') === '1') {
      return true;
    }
  }

  getDefaultLocationCoordinates() {
    if (this.defaultLocationIsAvailable()) {
      return {longitude: parseFloat(this.memReadString('lender-default-location-lon')), latitude: parseFloat(this.memReadString('lender-default-location-lat'))};
    } else {
      return {longitude: 0, latitude: 0};
    }
  }

  setDefaultLocationCoordinates(coords: Coordinates) {
    localStorage.setItem('lender-default-location-lon', coords.longitude.toString());
    localStorage.setItem('lender-default-location-lat', coords.latitude.toString());
    localStorage.setItem('lender-default-location-set', '1');
  }

  setMyInfo(username: string, email: string) {
    localStorage.setItem('lender-my-username', username);
    localStorage.setItem('lender-my-email', email);
  }

  memReadString(param: string, defValue?: string) {
    const ret = localStorage.getItem(param);
    if (ret === null) {
      return defValue;
    } else {
      return ret;
    }
  }

  memReadNumber(param: string, defValue?: number) {
    const memRd = this.memReadString(param);
    if (memRd === '' || isNaN(parseInt(memRd, 10))) {
      if (defValue) {
        return defValue;
      } else {
        return -1;
      }
    } else {
      return parseInt(memRd, 10);
    }
  }
}
