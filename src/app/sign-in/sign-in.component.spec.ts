import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';

import {SignInComponent} from './sign-in.component';

describe('SignInComponent', () => {
    let component: SignInComponent;
    let fixture: ComponentFixture<SignInComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [SignInComponent],
        imports: [
          BrowserAnimationsModule,
          FormsModule,
          MatFormFieldModule,
          MatInputModule,
          NoopAnimationsModule,
          RouterTestingModule,
        ]
      })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(SignInComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should set signedIn to true', () => {
      expect(localStorage.getItem('signedIn')).toBeFalsy();
      component.signIn();
      expect(localStorage.getItem('signedIn')).toBeTruthy();
    });
  }
);
