import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ServiceOption, Location, ServiceOptionChoice } from '../models';

@Component({
	selector: 'app-multi-service-option',
	templateUrl: './multi-service-option.component.html',
	styleUrls: ['./multi-service-option.component.css']
})
export class MultiServiceOptionComponent implements OnInit {
	@Input() serviceOptions: ServiceOption[];
	@Input() location: Location;
	@Input() getAddon: Function;
	@Output() doValidate = new EventEmitter<void>();
	warnings: string[];

	constructor() { }

	ngOnInit() {
		this.validate();
	}

	select(serviceOption: ServiceOption, choice: ServiceOptionChoice) {
		if (serviceOption.selectedChoice == choice) {
			const nullChoices = serviceOption.choices.filter(choice => choice.id === null);
			if (nullChoices.length === 0) {
				serviceOption.selectedChoice = null;
			} else if (nullChoices.length === 1) {
				serviceOption.selectedChoice = nullChoices[0];
			} else {
				throw "It is not allowed for multiple ServiceOptionChoices to have the same ID.";
			}
		} else {
			serviceOption.selectedChoice = choice;
		}
	}

	getAddons(serviceOption: ServiceOption) {
		if (!serviceOption.selectedChoice || !serviceOption.selectedChoice.addons) {
			return [];
		}
		return serviceOption.selectedChoice.addons.map(title => this.getAddon(title));
	}

	/**
	 * Display a warning to the user if the user makes an ill-advised choice.
	 * This function is called each time the user clicks a choice.
	 */
	validate() {
		this.doValidate.emit();
		this.warnings = [];
		for (const serviceOption of this.serviceOptions) {
			if (serviceOption.selectedChoice) {
				if (serviceOption.selectedChoice.locationWhitelist &&
					serviceOption.selectedChoice.locationWhitelist.indexOf(this.location.name) == -1) {
						this.warnings.push(`<strong>Not recommended in this location.</strong> \
							It is unusual to do ${serviceOption.title}: ${serviceOption.selectedChoice.title} \
							in ${this.location.name} \u2013 ${this.location.building}. We will carefully \
							examine the details of your event.`);
				}
				if (serviceOption.selectedChoice.locationBlacklist &&
					serviceOption.selectedChoice.locationBlacklist.indexOf(this.location.name) > -1) {
						this.warnings.push(`<strong>Not recommended in this location.</strong> \
							It is unusual to do ${serviceOption.title}: ${serviceOption.selectedChoice.title} \
							in ${this.location.name} \u2013 ${this.location.building}. We will carefully \
							examine the details of your event.`);
				}
				if (this.location.building !== 'Outdoors' && serviceOption.selectedChoice.id === 'HZ') {
					this.warnings.push(`Use of haze indoors requires a fire watch, which you must arrange and pay for.`);
				}
			}
		}
	}

}
