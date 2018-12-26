import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutopopulateSuccessModalComponent } from './autopopulate-success-modal.component';

describe('ErrorModalComponent', () => {
  let component: AutopopulateSuccessModalComponent;
  let fixture: ComponentFixture<AutopopulateSuccessModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutopopulateSuccessModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutopopulateSuccessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
