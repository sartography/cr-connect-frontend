import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Component} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ApiService, MockEnvironment} from 'sartography-workflow-lib';
import {ResearchComponent} from './research.component';


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

describe('ResearchComponent', () => {
  let component: ResearchComponent;
  let fixture: ComponentFixture<ResearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ResearchComponent,
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
    fixture = TestBed.createComponent(ResearchComponent);
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
