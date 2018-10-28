import * as serviceOptionsJson from '../assets/service_options.json';

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
	}
}

export class Service {
	title: string;
	serviceOptions: ServiceOption[];

	constructor(title: string) {
		this.title = title;
		this.serviceOptions = [];
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
		return total;
	}

	nonzeroServiceOptions() {
		return this.serviceOptions.filter(opt => opt.selectedChoice && opt.selectedChoice.price);
	}
}

export class Event {
	name: string;
	description: string;
	location: Location;
	startDate: object;
	startTime: object;
	endDate: object;
	endTime: object;
	setupCompleteDate: object;
	setupCompleteTime: object;
	services: Service[];

	setupCompleteDatetime() {
		return this.getDatetime(this.setupCompleteDate, this.setupCompleteTime);
	}

	startDatetime() {
		return this.getDatetime(this.startDate, this.startTime);
	}

	endDatetime() {
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

	constructor() {
		this.services = [];
		for (const serviceJson of serviceOptionsJson.default) {
			const service = new Service(serviceJson['title']);
			for (const serviceOptionJson of serviceJson['options']) {
				service.serviceOptions.push(new ServiceOption(serviceOptionJson));
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
}
