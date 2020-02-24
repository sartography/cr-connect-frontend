import {Component} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {SignInComponent} from '../sign-in/sign-in.component';
import {StudiesComponent} from '../studies/studies.component';
import {StudyCardComponent} from '../study-card/study-card.component';
import {HomeComponent} from './home.component';


@Component({
  selector: 'app-sign-in',
  template: ''
})
class MockSignInComponent {}

@Component({
  selector: 'app-studies',
  template: ''
})
class MockStudiesComponent {}

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
    const result = component.isSignedIn();
    expect(result).toBeDefined();
    expect(typeof result).toEqual('boolean');
  });

});
