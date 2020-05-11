import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Component} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ApiService, MockEnvironment} from 'sartography-workflow-lib';
import {HomeComponent} from './home.component';


@Component({
  selector: 'app-sign-in',
  template: ''
})
class MockSignInComponent {
}

@Component({
  selector: 'app-studies',
  template: ''
})
class MockStudiesComponent {
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
        MockSignInComponent,
        MockStudiesComponent
      ],
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        HttpClient,
        ApiService,
        {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check signed-in state', () => {
    const result = component.isSignedIn;
    expect(result).toBeDefined();
    expect(typeof result).toEqual('boolean');
  });

});
