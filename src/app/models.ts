export class Organization {
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
	name: string;
	building: string;

	constructor(data: object) {
		Object.assign(this, data);
	}
}

export class ServiceOption {
	title: string;
	description: string;
	choices: ServiceOptionChoice[];
	selectedChoice: ServiceOptionChoice;

	constructor(data: object) {
		Object.assign(this, data);
	}
}

export class ServiceOptionChoice {
	title: string;
	description: string;
	value: any;
	price: number;

	constructor(data: object) {
		Object.assign(this, data);
	}
}

export class Event {
	name: string;
	description: string;
	location: Location;
	startDate: string;
	startTime: object;
	endDate: string;
	endTime: object;
	setupCompleteDate: string;
	setupCompleteTime: object;
	serviceOptions: ServiceOption[];

	constructor() {
		this.serviceOptions = [];
			this.serviceOptions.push(new ServiceOption({title: 'Stage lighting', choices: [
				new ServiceOptionChoice({title: 'None', price: 0, value: null}),
				new ServiceOptionChoice({title: 'Basic', price: 50, description: 'Basic stage lighting lighting that can be dimmed. No changing colors, moving lights, different scenes, etc. Maximum of 8 fixtures.'}),
				new ServiceOptionChoice({title: 'Advanced', price: 75, description: 'Anything more than Basic.'})
			]}));
			this.serviceOptions.push(new ServiceOption({title: 'Area lighting', choices: [
				new ServiceOptionChoice({title: 'None', price: 0, value: null}),
				new ServiceOptionChoice({title: 'Basic', price: 50, description: 'Basic area lighting lighting that can be dimmed. No changing colors, moving lights, different scenes, etc.'}),
				new ServiceOptionChoice({title: 'Advanced', price: 75, description: 'Anything more than Basic.'})
			]}));
			this.serviceOptions.push(new ServiceOption({title: 'Uplighting', choices: [
				new ServiceOptionChoice({title: 'No', price: 0, value: null}),
				new ServiceOptionChoice({title: 'Yes', price: 50, description: 'Prettify the room.'}),
			]}));
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
