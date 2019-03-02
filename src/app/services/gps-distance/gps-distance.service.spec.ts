import { TestBed } from '@angular/core/testing';

import { GpsDistanceService } from './gps-distance.service';

describe('GpsDistanceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GpsDistanceService = TestBed.get(GpsDistanceService);
    expect(service).toBeTruthy();
  });
});
