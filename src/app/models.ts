import * as servicesJson from '../assets/services.json';

export class Organization {
	id: number;
	name: string;
	shortname: string;
	email: string;
	phone: string;
	address: string;
	owner: boolean;
	member: boolean;
	delinquent: boolean;
	selected = false;

	constructor(data: object) {
		Object.assign(this, data);
	}
}

export class Location {
	id: number;
	name: string;
	building: string;

	constructor(data: object) {
		Object.assign(this, data);
	}
}

export class ServiceOptionChoice {
	title: string;
	description: string;
	value: any;
	price: number;
	imageUrl: string;
	detailPrompt: string;

	constructor(data: object) {
		Object.assign(this, data);
	}
}

export class ServiceOption {
	title: string;
	description: string;
	isBoolean: boolean;
	choices: ServiceOptionChoice[];
	selectedChoice: ServiceOptionChoice;
	detail: string;

	constructor(data: object) {
		const data2 = Object.assign({}, data);
		delete data2['choices'];
		Object.assign(this, data2);
		this.choices = [];
		for (const choiceData of data['choices']) {
			this.choices.push(new ServiceOptionChoice(choiceData));
		}
		if ('defaultChoice' in data) {
			for (const choice of this.choices) {
				if (choice.title === data['defaultChoice']) {
					this.selectedChoice = choice;
					break;
				}
			}
		}
	}
}

export class Addon {
	title: string;
	description: string;
	price: number;
	quantity = 0;

	constructor(data: object) {
		Object.assign(this, data);
	}
}

export class Service {
	title: string;
	serviceOptions: ServiceOption[];
	addons: Addon[];

	constructor(title: string) {
		this.title = title;
		this.serviceOptions = [];
		this.addons = [];
	}

	getTotalPrice() {
		let total = 0;
		for (const choice of this.serviceOptions.map(option => option.selectedChoice)) {
			if (choice) {
				if (choice.price === undefined) {
					throw new Error('Choice is missing a price.');
				}
				total += choice.price;
			}
		}
		for (const addon of this.addons) {
			if (addon.price === undefined) {
				throw new Error('Addon is missing a price.');
			}
			total += addon.price * Math.max(addon.quantity, 0);
		}
		return total;
	}

	nonzeroServiceOptions() {
		return this.serviceOptions.filter(opt => opt.selectedChoice && opt.selectedChoice.price);
	}

	nonzeroAddons() {
		return this.addons.filter(addon => addon.quantity > 0);
	}
}

export class Event {
	name: string;
	description: string;
	location: Location;
	private _setupCompleteDate: object;
	private _setupCompleteTime: object;
	private _startDate: object;
	private _startTime: object;
	endDate: object;
	endTime: object;
	services: Service[];

	get setupCompleteDate() {
		return this._setupCompleteDate;
	}

	set setupCompleteDate(value) {
		this._setupCompleteDate = value;
		this.autofill_datetimes();
	}

	get setupCompleteTime() {
		return this._setupCompleteTime;
	}

	set setupCompleteTime(value) {
		this._setupCompleteTime = value;
		this.autofill_datetimes();
	}

	get startDate() {
		return this._startDate;
	}

	set startDate(value) {
		this._startDate = value;
		this.autofill_datetimes();
	}

	get startTime() {
		return this._startTime;
	}

	set startTime(value) {
		this._startTime = value;
		this.autofill_datetimes();
	}

	get setupCompleteDatetime() {
		return this.getDatetime(this.setupCompleteDate, this.setupCompleteTime);
	}

	get startDatetime() {
		return this.getDatetime(this.startDate, this.startTime);
	}

	get endDatetime() {
		return this.getDatetime(this.endDate, this.endTime);
	}

	getDatetime(date: object, time: object) {
		if (date) {
			if (time) {
				return new Date(date['year'], date['month'], date['day'], time['hour'], time['minute']);
			}
			return new Date(date['year'], date['month'], date['day']);
		}
		return null;
	}

	autofill_datetimes() {
		if (this.setupCompleteDate && !this.startDate) {
			this.startDate = this.setupCompleteDate;
		}
		if (this.setupCompleteTime && !this.startTime) {
			this.startTime = this.setupCompleteTime
		}
		if (this.startDate && !this.endDate) {
			this.endDate = this.startDate;
		}
		if (this.startTime && !this.endTime) {
			this.endTime = this.startTime
		}
	}

	constructor() {
		this.services = [];
		for (const serviceJson of servicesJson.default) {
			const service = new Service(serviceJson['title']);
			for (const serviceOptionJson of serviceJson['options']) {
				service.serviceOptions.push(new ServiceOption(serviceOptionJson));
			}
			if ('addons' in serviceJson) {
				for (const addonJson of serviceJson['addons']) {
					service.addons.push(new Addon(addonJson));
				}
			}
			this.services.push(service);
		}
	}

	getTotalPrice() {
		let total = 0;
		for (const service of this.services) {
			total += service.getTotalPrice();
		}
		return total;
	}

	nonzeroServiceOptions() {
		return Array.prototype.concat.apply([], this.services.map(service => service.nonzeroServiceOptions()));
	}

	nonzeroAddons() {
		return Array.prototype.concat.apply([], this.services.map(service => service.nonzeroAddons()));
	}
}
