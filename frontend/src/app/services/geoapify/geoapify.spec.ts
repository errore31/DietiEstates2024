import { TestBed } from '@angular/core/testing';

import { Geoapify } from './geoapify';

describe('Geoapify', () => {
  let service: Geoapify;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Geoapify);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
