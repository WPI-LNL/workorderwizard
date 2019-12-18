import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceOptionComponent } from './service-option.component';

describe('ServiceOptionComponent', () => {
	let component: ServiceOptionComponent;
	let fixture: ComponentFixture<ServiceOptionComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ServiceOptionComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ServiceOptionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
