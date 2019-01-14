import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiServiceOptionComponent } from './multi-service-option.component';

describe('ServiceOptionComponent', () => {
  let component: MultiServiceOptionComponent;
  let fixture: ComponentFixture<MultiServiceOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiServiceOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiServiceOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
