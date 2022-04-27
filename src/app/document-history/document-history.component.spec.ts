import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentHistoryComponent } from './document-history.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {RouterTestingModule} from '@angular/router/testing';
import {ApiService, MockEnvironment} from 'sartography-workflow-lib';
import {APP_BASE_HREF} from '@angular/common';

describe('DocumentHistoryComponent', () => {
  let component: DocumentHistoryComponent;
  let fixture: ComponentFixture<DocumentHistoryComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentHistoryComponent ],
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        ApiService,
        {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment},
        {provide: APP_BASE_HREF, useValue: '/'},
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*
  fixme: We should have tests on the document history component.
  it('should create', () => {
    expect(component).toBeTruthy();
  });
*/
});

