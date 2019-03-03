import { TestBed } from '@angular/core/testing';

import { OpenStreetMapService } from './openstreetmap.service';

describe('OpenStreetMapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OpenStreetMapService = TestBed.get(OpenStreetMapService);
    expect(service).toBeTruthy();
  });
});
