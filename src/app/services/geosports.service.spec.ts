import { TestBed, inject } from '@angular/core/testing';

import { GeosportsService } from './geosports.service.ts.service';

describe('Geosports.Service.TsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GeosportsService]
    });
  });

  it('should be created', inject([GeosportsService], (service: GeosportsService) => {
    expect(service).toBeTruthy();
  }));
});
