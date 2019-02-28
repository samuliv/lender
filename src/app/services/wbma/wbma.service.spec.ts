import { TestBed } from '@angular/core/testing';

import { WbmaService } from './wbma.service';

describe('WbmaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WbmaService = TestBed.get(WbmaService);
    expect(service).toBeTruthy();
  });
});
