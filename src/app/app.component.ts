import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { DB_URL } from './constants';
import { Event, Location, Organization, ServiceOption, ServiceOptionChoice } from './models';
import { ErrorModalComponent } from './error-modal/error-modal.component';
import { WizardProgressStepComponent } from './wizard-progress-step/wizard-progress-step.component';
import { AutopopulateSuccessModalComponent } from './autopopulate-success-modal/autopopulate-success-modal.component';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	STEPS = ['Client', 'Event Details', 'Services', 'Review'];
	navbarCollapsed = true;
	activeStep = 'Welcome';
	@ViewChildren(WizardProgressStepComponent) wizardSteps: QueryList<WizardProgressStepComponent>;
	event: Event;
	userContactInfo: object;

	@ViewChild('autopopulatingModal') autopopulatingModal: ElementRef;
	@ViewChild('loginRequiredModal') loginRequiredModal: ElementRef;
	@ViewChild('submittingModal') submittingModal: ElementRef;
	@ViewChild('submitSuccessModal') submitSuccessModal: ElementRef;

	@ViewChild('orgSearch') orgSearchInput: ElementRef;
	orgSearchVisible = true;
	orgs: Organization[];
	orgSearchResults: Organization[];
	defaultOrgSearchResults: Organization[];
	selectedOrg: Organization;

	@ViewChild('locationSearch') locationSearchInput: ElementRef;
	locations: Location[];
	locationSearchResults: Location[];

	constructor(private modalService: NgbModal, private http: HttpClient) {}

	ngOnInit() {
		this.event = new Event();
		this.loadBaseData();
	}

	stepClick($event) {
		if (!$event.disabled) {
			this.switchToStep($event.title);
		}
	}

	advanceStep() {
		for (let i = 0; i < this.STEPS.length; i++) {
			if (this.STEPS[i] === this.activeStep) {
				if (i + 1 >= this.STEPS.length) {
					throw new Error('Attempted to advance past the last step.');
				}
				this.switchToStep(this.STEPS[i+1]);
				return;
			}
		}
		this.switchToStep(this.STEPS[0]);
	}

	switchToStep(step: string) {
		let found = false;
		for (const s of this.wizardSteps.toArray()) {
			if (s.title === step) {
				found = true;
				s.complete = false;
				s.active = true;
				s.disabled = false;
			} else if (found) {
				s.complete = false;
				s.active = false;
				s.disabled = true;
			} else {
				s.complete = true;
				s.active = false;
				s.disabled = false;
			}
		}
		this.activeStep = step;
	}

	displayAutopopulatingModal() {
		return this.modalService.open(this.autopopulatingModal, {size: 'sm', centered: true, backdrop: 'static', keyboard: false});
	}

	displaySubmittingModal() {
		return this.modalService.open(this.submittingModal, {size: 'sm', centered: true, backdrop: 'static', keyboard: false});
	}

	displaySubmitSuccessModal() {
		return this.modalService.open(this.submitSuccessModal, {size: 'sm', centered: true, backdrop: 'static', keyboard: false});
	}

	displayOrgSearch() {
		this.orgSearchVisible = true;
		setTimeout(() => { // execute after the above boolean has changed
			this.orgSearchInput.nativeElement.focus();
		}, 0);
	}

	selectOrg(org: Organization) {
		if (this.selectedOrg) {
			this.selectedOrg.selected = false;
		}
		this.selectedOrg = org;
		org.selected = true;
		this.orgSearchVisible = false;
		this.orgSearchResults = this.defaultOrgSearchResults;
		this.orgSearchInput.nativeElement.value = null;
	}

	orgSearchChange(value) {
		if (value.length < 2) {
			this.orgSearchResults = this.defaultOrgSearchResults;
		} else {
			this.orgSearchResults = this.orgs.filter(org => org.name.toLowerCase().includes(value.toLowerCase()));
		}
	}

	locationSearchChange(value) {
		if (value === '') {
			this.locationSearchResults = this.locations;
		} else {
			this.locationSearchResults = this.locations.filter(loc => loc.name.toLowerCase().includes(value.toLowerCase()) ||
				loc.building.toLowerCase().includes(value.toLowerCase()));
		}
	}

	focusLocationSearch() {
		setTimeout(() => {
			this.locationSearchInput.nativeElement.focus();
		}, 0);
	}

	isEventDetailsComplete() {
		return this.event.name && this.event.location && this.event.setupCompleteDate && this.event.setupCompleteTime &&
			this.event.startDate && this.event.startTime && this.event.endDate && this.event.endTime;
	}

	/***************************
	 * AJAX calls
	 ***************************/

	loadBaseData() {
		const appComponent = this;
		this.http.get(DB_URL + '/db/workorderwizard-load').subscribe(function(response) {
			appComponent.userContactInfo = response['user'];
			const orgs = [];
			for (const org of response['orgs']) {
				orgs.push(new Organization(org));
			}
			appComponent.orgs = orgs;
			const locations = [];
			for (const loc of response['locations']) {
				locations.push(new Location(loc));
			}
			appComponent.locations = locations;
			appComponent.defaultOrgSearchResults = appComponent.orgs.filter(org => org.owner || org.member);
			appComponent.orgSearchResults = appComponent.defaultOrgSearchResults;
			appComponent.locationSearchResults = appComponent.locations;
		}, function(error) {
			if (error.status === 401) {
				appComponent.modalService.open(appComponent.loginRequiredModal, {backdrop: 'static', keyboard: false});
				window.location.href = DB_URL + '/login/?force_cas=true&next=/workorder-wizard';
			} else {
				const msg = 'Application data could not be retrieved from the server. Please try refreshing the page.';
				appComponent.modalService.open(ErrorModalComponent, {backdrop: 'static', keyboard: false}).componentInstance.message = msg;
			}
		});
	}

	autopopulate() {
		const data = {};
		if (this.selectedOrg) {
			data['org'] = this.selectedOrg.id;
		}
		data['event_name'] = this.event.name;
		data['description'] = this.event.description;
		if (this.event.location) {
			data['location'] = this.event.location.id;
		}
		if (this.event.startDatetime) {
			data['start'] = this.event.startDatetime.toISOString();
		}
		if (this.event.endDatetime) {
			data['end'] = this.event.endDatetime.toISOString();
		}
		if (this.event.setupCompleteDatetime) {
			data['setup_complete'] = this.event.setupCompleteDatetime.toISOString();
		}
		let modal = this.displayAutopopulatingModal();
		const appComponent = this;
		this.http.post(DB_URL + '/db/workorderwizard-autopopulate', data,
				{headers: new HttpHeaders({'Content-Type': 'application/json'})}).subscribe(function(response) {
			modal.close();
			if (response) {
				modal = appComponent.modalService.open(AutopopulateSuccessModalComponent);
				modal.componentInstance.skipToReview = () => appComponent.switchToStep('Review');
				modal.componentInstance.eventName = response['event_name'];
				modal.componentInstance.eventLocation = appComponent.locations.find(loc => loc.id === response['location']);
				modal.componentInstance.eventStart = new Date(response['start']);
				for (const serviceData of response['services']) {
					appComponent.autopopulateStep(serviceData['id'], serviceData['detail']);
				}
			}
		}, function(error) {
			modal.close();
			modal = appComponent.modalService.open(ErrorModalComponent);
			if (error.status === 0) {
				const msg = 'Cannot contact the server. Check your internet connection and try again.';
				modal.componentInstance.message = msg;
			} else {
				const msg = 'Failed to search previous events. Please wait a moment and then try again.';
				modal.componentInstance.message = msg;
			}
			setTimeout(function() {
				modal.close();
			}, 4000);
		});
	}

	private autopopulateStep(serviceOptionChoiceId, detail) {
		for (const service of this.event.services) {
			for (const serviceOption of service.serviceOptions) {
				for (const serviceOptionChoice of serviceOption.choices) {
					if (serviceOptionChoice.value === serviceOptionChoiceId) {
						serviceOption.selectedChoice = serviceOptionChoice;
						serviceOption.detail = detail;
						return;
					}
				}
			}
		}
		console.warn(`Unknown service ID ${serviceOptionChoiceId} encountered during autopopulation.`)
	}

	submit() {
		const data = {};
		if (this.selectedOrg) {
			data['org'] = this.selectedOrg.id;
		}
		data['event_name'] = this.event.name;
		data['description'] = this.event.description;
		if (this.event.location) {
			data['location'] = this.event.location.id;
		}
		if (this.event.startDatetime) {
			data['start'] = this.event.startDatetime.toISOString();
		}
		if (this.event.endDatetime) {
			data['end'] = this.event.endDatetime.toISOString();
		}
		if (this.event.setupCompleteDatetime) {
			data['setup_complete'] = this.event.setupCompleteDatetime.toISOString();
		}
		data['services'] = [];
		data['extras'] = [];
		for (const service of this.event.services) {
			for (const serviceOption of service.serviceOptions) {
				// selected choice will only be added to the JSON if its value is truthy
				if (serviceOption.selectedChoice && serviceOption.selectedChoice.value) {
					data['services'].push({id: serviceOption.selectedChoice.value, detail: serviceOption.detail});
				}
			}
			for (const addon of service.addons) {
				if (addon.quantity > 0) {
					data['extras'].push({id: addon.title, quantity: addon.quantity});
				}
			}
		}
		let modal = this.displaySubmittingModal();
		const appComponent = this;
		this.http.post(DB_URL + '/db/workorderwizard-submit', data,
				{headers: new HttpHeaders({'Content-Type': 'application/json'})}).subscribe(function(response) {
			modal.close();
			appComponent.displaySubmitSuccessModal();
			setTimeout(function() {
				window.location.href = DB_URL + response['event_url'];
			}, 2000);
		}, function(error) {
			modal.close();
			modal = appComponent.modalService.open(ErrorModalComponent);
			if (error.status === 0) {
				const msg = 'Failed to submit your event. Check your internet connection and try again.';
				modal.componentInstance.message = msg;
			} else {
				const msg = 'Failed to submit your event. Please wait a moment and then try again.';
				modal.componentInstance.message = msg;
			}
			setTimeout(function() {
				modal.close();
			}, 3000);
		});
	}
}
