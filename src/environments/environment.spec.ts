import {TestBed} from '@angular/core/testing';
import {environment as environment_dev} from './environment';
import {environment as environment_test} from './environment.test';
import {environment as environment_staging} from './environment.staging';
import {environment as environment_prod} from './environment.prod';


describe('Environments', () => {
  it('should have settings for all the environments', () => {
    expect(environment_dev).toBeDefined();
    expect(environment_test).toBeDefined();
    expect(environment_staging).toBeDefined();
    expect(environment_prod).toBeDefined();
  });
});
