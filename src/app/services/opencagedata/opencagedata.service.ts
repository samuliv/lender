import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Address } from 'src/app/interfaces/address';
import { OpenCageDataResponse } from 'src/app/interfaces/opencagedataresponse';
/*
  OpenCage Geocoder API Module
  https://opencagedata.com/faq
 */
@Injectable({
  providedIn: 'root'
})
export class OpenCageDataService {
  apiUrl = 'https://api.opencagedata.com/geocode/v1/json?key=2afd8621982745699bd0dce158522f15';
  constructor(private http: HttpClient, private router: Router) {
  }

  searchByAddress(address: string) {
    return this.http.get<OpenCageDataResponse>(this.apiUrl + '&q=' + encodeURI(address));
  }

  searchByCoordinates(latitude: number, longitude: number) {
    return this.http.get<OpenCageDataResponse>(this.apiUrl + '&q=' + latitude.toString() + '%2C%20' + longitude.toString());
  }

  translateToAddress(data: OpenCageDataResponse) {
    const responseData: Address[] = [];
    if (data.results.length > 0) {
      for (let i = 0; i < data.results.length; i++) {
        const element: Address = { address: data.results[i].formatted,
                                 coordinates: {
                                   latitude: data.results[i].geometry.lat,
                                   longitude: data.results[i].geometry.lng
                                  },
                                 continent: data.results[i].components.continent,
                                 country: data.results[i].components.country,
                                 state: data.results[i].components.state,
                                 suburb: data.results[i].components.suburb,
                                 city: 'unknown'};
        if (data.results[i].components.hasOwnProperty('city')) {
          element.city = data.results[i].components.city;
        } else {
          if (data.results[i].components.hasOwnProperty('town')) {
            element.city = data.results[i].components.town;
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
