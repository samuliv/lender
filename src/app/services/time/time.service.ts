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
    switch (timeString.toLowerCase()) {

      case 'now':
      case 'immediately':
      case '2h':
        console.log(current.toISOString());
        let shiftMinutes = 16;
        if ( timeString === '+2h' ) {
          shiftMinutes = 180;
        }
        current.setTime(current.getTime() + 1000 * 60 * shiftMinutes); // shift 16 minutes forward
        return this.toNextFixed15(current.toISOString());

      case 'tmrrw-m':
      case 'tmrrw-e':
        current.setDate(current.getDate()+1);
        return (current.toISOString().substring(0,11) + (timeString === 'tmrrw-m' ? '09' : '17') + ':00:00.000Z');
    }
  }

}
