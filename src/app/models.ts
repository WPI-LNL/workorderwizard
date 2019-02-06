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
	id: string;
	price: number;
	imageUrl: string;
	detailPrompt: string;
	locationWhitelist: string[];
	locationBlacklist: string[];
	dependencies: string[][];
	conflicts: string[];
	addons: string[];

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
	categoryTitle: string;

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

	getChoice(id: string) {
		const choices = this.choices.filter(choice => choice.id === id);
		if (choices.length === 0) {
			return null;
		}
		if (choices.length > 1) {
			throw "It is not allowed for multiple ServiceOptionChoices to have the same ID.";
		}
		return choices[0];
	}
}

export class Addon {
	title: string;
	description: string;
	price: number;
	dependencies: string[][];
	quantity = 0;
	isBoolean: boolean;

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

	nonnullServiceOptions() {
		return this.serviceOptions.filter(opt => opt.selectedChoice && opt.selectedChoice.id);
	}

	nonzeroAddons() {
		return this.addons.filter(addon => addon.quantity > 0);
	}

	allChoices() {
		return this.serviceOptions.map(serviceOption => serviceOption.choices).reduce((a,b) => a.concat(b))
	}

	getChoice(id: string) {
		const choices = this.allChoices().filter(choice => choice.id === id);
		if (choices.length === 0) {
			return null;
		}
		if (choices.length > 1) {
			throw "It is not allowed for multiple ServiceOptionChoices to have the same ID.";
		}
		return choices[0];
	}

	getServiceOptionWithChoice(choiceId: string) {
		const serviceOptions = this.serviceOptions.filter(serviceOption => serviceOption.choices.map(choice => choice.id).indexOf(choiceId) > -1)
		if (serviceOptions.length === 0) {
			return null;
		}
		if (serviceOptions.length > 1) {
			throw "It is not allowed for multiple ServiceOptionChoices to have the same ID.";
		}
		return serviceOptions[0];
	}

	allSelectedChoices() {
		return this.serviceOptions.map(serviceOption => serviceOption.selectedChoice).filter(choice => Boolean(choice));
	}

	isChoiceSelected(id: string) {
		return this.serviceOptions.some(serviceOption => serviceOption.selectedChoice && serviceOption.selectedChoice.id === id);
	}

	getAddon(title: string) {
		if (!this.addons || this.addons.length === 0) {
			return null;
		}
		const addons = this.addons.filter(addon => addon.title === title);
		if (addons.length === 0) {
			return null;
		}
		if (addons.length > 1) {
			throw "It is not allowed for multiple addons to have the same title.";
		}
		return addons[0];
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
				return new Date(date['year'], date['month']-1, date['day'], time['hour'], time['minute']);
			}
			return new Date(date['year'], date['month']-1, date['day']);
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

	constructor(servicesAsset: string) {
		const servicesJson = require('../assets/' + servicesAsset);
		this.services = [];
		for (const serviceJson of servicesJson) {
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

	getFees() {
		const fees = [];
		const now = new Date();
		if (this.setupCompleteDatetime > now) {
			const twoWeeksFromNow = new Date(now.getTime());
			twoWeeksFromNow.setDate(now.getDate() + 14)
			const oneWeekFromNow = new Date(now.getTime());
			oneWeekFromNow.setDate(now.getDate() + 7)
			const twoDaysFromNow = new Date(now.getTime());
			twoDaysFromNow.setDate(now.getDate() + 2)
			if (this.setupCompleteDatetime < twoDaysFromNow) {
				fees.push({
					title: 'Late Booking Fee (less than 48 hours\' notice)',
					price: Math.max(100, this.getTotalServicesPrice())
				})
			} else if (this.setupCompleteDatetime < oneWeekFromNow) {
				fees.push({
					title: 'Late Booking Fee (less than 1 week\'s notice)',
					price: Math.max(50, this.getTotalServicesPrice() * 0.5)
				})
			} else if (this.setupCompleteDatetime < twoWeeksFromNow) {
				fees.push({
					title: 'Late Booking Fee (less than 2 weeks\' notice)',
					price: Math.max(25, this.getTotalServicesPrice() * 0.25)
				})
			}
		}
		return fees;
	}

	getTotalServicesPrice() {
		let total = 0;
		for (const service of this.services) {
			total += service.getTotalPrice();
		}
		return total;
	}

	getTotalPrice() {
		let total = this.getTotalServicesPrice();
		for (const fee of this.getFees()) {
			total += fee.price;
		}
		return total;
	}

	nonnullServiceOptions() {
		return Array.prototype.concat.apply([], this.services.map(service => service.nonnullServiceOptions()));
	}

	nonzeroAddons() {
		return Array.prototype.concat.apply([], this.services.map(service => service.nonzeroAddons()));
	}

	getReviewPageWarnings() {
		const warnings = [];
		const now = new Date();
		if (this.setupCompleteDatetime < now) {
			warnings.push('You are submitting an event scheduled in the past.');
		}
		if (this.endDatetime.getHours() >= 23 || this.endDatetime.getHours() < 1) {
			warnings.push('There is a $75 hourly fee if we must work past 1 AM to tear down your event.');
		} else if (this.endDatetime.getHours() < 5) {
			warnings.push('There is a $75 hourly fee if we must work past 1 AM for your event.');
		}
		return warnings;
	}
}
