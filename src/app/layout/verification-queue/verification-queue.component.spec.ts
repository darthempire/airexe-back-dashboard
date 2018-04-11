import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationQueueComponent } from './verification-queue.component';

describe('VerificationQueueComponent', () => {
  let component: VerificationQueueComponent;
  let fixture: ComponentFixture<VerificationQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerificationQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
