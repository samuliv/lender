import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { OpenStreetMapResponse } from 'src/app/interfaces/openstreetmapresponse';
import { Address } from 'src/app/interfaces/address';

@Injectable({
  providedIn: 'root'
})
export class OpenStreetMapService {

  apiUrl = 'https://nominatim.openstreetmap.org/search?format=json&polygon=0&addressdetails=1';
  
  constructor(private http: HttpClient, private router: Router) {
  }

  searchByAddress(address: string) {
    return this.http.get<OpenStreetMapResponse[]>(this.apiUrl + '&q=' + encodeURI(address));
  }

  searchByCoordinates(latitude: number, longitude: number) {
    return this.http.get<OpenStreetMapResponse[]>(this.apiUrl + '&q=' + latitude.toString() + '+' + longitude.toString());
  }

  describeCoordinates(latitude: number, longitude: number) {
    return new Promise((resolve, reject) => {
      this.searchByCoordinates(latitude, longitude).subscribe((res) => {
        if (res.length > 0) {
          resolve(this.translateToAddress(res)[0].city);
        } else {
          resolve('Unknown');
        }
      });
    });
  }

  translateToAddress(data: OpenStreetMapResponse[]) {
    const responseData: Address[] = [];
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        const element: Address = { address: data[i].display_name,
                                 coordinates: {
                                   latitude: parseFloat(data[i].lat),
                                   longitude: parseFloat(data[i].lon)
                                  },
                                 continent: '',
                                 country: data[i].address.country,
                                 state: data[i].address.state,
                                 suburb: data[i].address.suburb,
                                 city: 'unknown'};
        if (data[i].address.hasOwnProperty('city')) {
          element.city = data[i].address.city;
        } else {
          if (data[i].address.hasOwnProperty('town')) {
            element.city = data[i].address.town;
          } else {
            element.city = 'unknown';
          }
        }
        responseData.push(element);
      }
    }
    return responseData;
  }

}
