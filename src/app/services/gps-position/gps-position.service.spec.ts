import { TestBed } from '@angular/core/testing';

import { GpsPositionService } from './gps-position.service';

describe('GpsPositionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GpsPositionService = TestBed.get(GpsPositionService);
    expect(service).toBeTruthy();
  });
});
