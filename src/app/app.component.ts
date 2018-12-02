import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Event, Location, Organization, ServiceOption, ServiceOptionChoice } from './models';
import { ErrorModalComponent } from './error-modal/error-modal.component';
import { WizardProgressStepComponent } from './wizard-progress-step/wizard-progress-step.component';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	STEPS = ['Client', 'Event Details', 'Services', 'Review'];
	navbarCollapsed = true;
	activeStep = 'Welcome';
	@ViewChildren(WizardProgressStepComponent) wizardSteps: QueryList<WizardProgressStepComponent>;
	event: Event;
	userContactInfo: object;

	@ViewChild('loadingModal') loadingModal: ElementRef;
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
		this.switchToStep($event.title);
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

	displayLoadingModal() {
		return this.modalService.open(this.loadingModal, { size: 'sm', centered: true });
	}

	displaySubmittingModal() {
		return this.modalService.open(this.submittingModal, { size: 'sm', centered: true, backdrop: 'static', keyboard: false });
	}

	displaySubmitSuccessModal() {
		return this.modalService.open(this.submitSuccessModal, { size: 'sm', centered: true, backdrop: 'static', keyboard: false });
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
			console.log(this.orgs);
			this.orgSearchResults = this.orgs.filter(org => org.name.toLowerCase().includes(value.toLowerCase()));
			console.log(this.orgSearchResults);
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
		this.http.get('http://localhost:8000/db/workorderwizard-load').subscribe(function(response) {
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
				window.location.href = 'http://localhost:8000/login/?next=/me';
			} else {
				const msg = 'Application data could not be retrieved from the server. Please try refreshing the page.';
				appComponent.modalService.open(ErrorModalComponent, {backdrop: 'static', keyboard: false}).componentInstance.message = msg;
			}
		});
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
		if (this.event.startDatetime()) {
			data['start'] = this.event.startDatetime().toISOString();
		}
		if (this.event.endDatetime()) {
			data['end'] = this.event.endDatetime().toISOString();
		}
		if (this.event.setupCompleteDatetime()) {
			data['setup_complete'] = this.event.setupCompleteDatetime().toISOString();
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
				data['extras'].push({id: addon.title, quantity: addon.quantity});
			}
		}
		let modal = this.displaySubmittingModal();
		const appComponent = this;
		this.http.post('http://localhost:8000/db/workorderwizard-submit', data,
				{headers: new HttpHeaders({'Content-Type': 'application/json'})}).subscribe(function(response) {
			modal.close();
			appComponent.displaySubmitSuccessModal();
			setTimeout(function() {
				window.location.href = 'http://localhost:8000' + response['event_url'];
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
