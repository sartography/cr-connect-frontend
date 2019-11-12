import {HttpClient, HttpHandler} from '@angular/common/http';
import {async, TestBed} from '@angular/core/testing';
import {ConfigService} from '../config/config.service';

import {ApiService} from './api.service';

describe('ApiService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpClient,
        HttpHandler,
        ConfigService
      ]
    });
  }));

  it('should be created', () => {
    const service: ApiService = TestBed.get(ApiService);
    expect(service).toBeTruthy();
  });
});
