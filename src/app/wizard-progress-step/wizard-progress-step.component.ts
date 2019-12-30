/*
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License, version 3, as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 */
import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'app-wizard-progress-step',
	templateUrl: './wizard-progress-step.component.html',
	styleUrls: ['./wizard-progress-step.component.scss']
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
