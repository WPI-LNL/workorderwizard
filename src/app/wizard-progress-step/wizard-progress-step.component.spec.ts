import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardProgressStepComponent } from './wizard-progress-step.component';

describe('WizardProgressStepComponent', () => {
	let component: WizardProgressStepComponent;
	let fixture: ComponentFixture<WizardProgressStepComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ WizardProgressStepComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WizardProgressStepComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
