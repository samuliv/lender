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

  getTimeAfter(fromTimeString: string, timeAfterSeconds: number) {
    if (fromTimeString === '' ) {
      return '';
    } else {
      let fromTime = new Date(fromTimeString);
      fromTime.setTime(fromTime.getTime() + timeAfterSeconds * 1000);
      return fromTime.toISOString();
    }
  }

  toNextFixed15(dateUTCString: string) {
    const current = new Date(dateUTCString);
    const timeBase = new Date(current.toISOString().substring(0,16) + ':00.000Z');
    timeBase.setTime(timeBase.getTime() + (15 - (timeBase.getMinutes() % 15)) * 1000 * 60);
    return (timeBase.toISOString().substring(0,16) + ':00.000Z');
  }

  getLenderTimeString(timeString: string) {
    const current = new Date();
    switch (timeString) {
      case 'now':
        //2019-03-09T01:21:03.644Z
        console.log(current.toISOString());
        current.setTime(current.getTime() + 1000 * 60 * 16); // shift 16 minutes forward
        return this.toNextFixed15(current.toISOString());
        break;
    }
  }

}
