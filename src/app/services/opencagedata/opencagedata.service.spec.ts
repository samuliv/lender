import { TestBed } from '@angular/core/testing';
import { OpenCageDataService } from './opencagedata.service';

describe('OpenCageDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OpenCageDataService = TestBed.get(OpenCageDataService);
    expect(service).toBeTruthy();
  });
});
