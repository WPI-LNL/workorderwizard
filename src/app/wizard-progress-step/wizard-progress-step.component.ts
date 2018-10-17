import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'app-wizard-progress-step',
	templateUrl: './wizard-progress-step.component.html',
	styleUrls: ['./wizard-progress-step.component.css']
})
export class WizardProgressStepComponent implements OnInit {
	@Input() title: string;
	@HostBinding('class.active') active = false;
	@HostBinding('class.complete') complete = false;
	@HostBinding('class.disabled') disabled = true;
	@Output() stepClick: EventEmitter<WizardProgressStepComponent> = new EventEmitter<WizardProgressStepComponent>();

	constructor() { }

	ngOnInit() { }

	emitStepClick() {
		if (true) {
			this.stepClick.emit(this);
		}
	}

}
