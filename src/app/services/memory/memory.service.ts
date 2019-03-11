import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MemoryService {

  constructor() { }

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
