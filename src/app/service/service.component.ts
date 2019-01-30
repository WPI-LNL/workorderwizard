import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Service, ServiceOption } from '../models';

@Component({
	selector: 'app-service',
	templateUrl: './service.component.html',
	styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {
	@Input() service: Service;
	@Input() location: Location;
	@Output() doValidate = new EventEmitter<void>();
	serviceOptions: (ServiceOption | ServiceOption[])[] = [];

	constructor() { }

	ngOnInit() {
		let multi = [];
		for (const serviceOption of this.service.serviceOptions) {
			if (serviceOption.isBoolean) {
				multi.push(serviceOption);
			} else {
				if (multi.length > 0) {
					this.serviceOptions.push(multi);
					multi = [];
				}
				this.serviceOptions.push(serviceOption);
			}
		}
		if (multi.length > 0) {
			this.serviceOptions.push(multi);
		}
	}

	validate() {
		this.doValidate.emit();
		let unavailableAddons = this.service.addons;
		for (const choice of this.service.allSelectedChoices()) {
			if (choice.addons) {
				for (const title of choice.addons) {
					unavailableAddons = unavailableAddons.filter(addon => addon.title != title)
				}
			}
		}
		for (const addon of unavailableAddons) {
			addon.quantity = 0;
		}
	}
}
