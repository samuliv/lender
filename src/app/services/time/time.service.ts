import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  constructor() { }

  // Calculates time difference between two Time string and returns difference in seconds.
  calculateTimeDifference(fromTimeString: string, toTimeString: string) {
    
    if (fromTimeString !== '' && toTimeString !== '') {
      const fromTime = new Date(fromTimeString);
      const toTime = new Date(toTimeString);

      if (fromTime.getTime() < toTime.getTime()) {
        return ((toTime.getTime() - fromTime.getTime()) / 1000);
      }
    }
    return -1;
  }
}
