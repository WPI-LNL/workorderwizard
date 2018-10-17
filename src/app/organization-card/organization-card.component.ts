import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Organization } from '../models';

@Component({
	selector: 'app-organization-card',
	templateUrl: './organization-card.component.html',
	styleUrls: ['./organization-card.component.css']
})
export class OrganizationCardComponent implements OnInit {
	@Input() org: Organization;
	@Input() searchMode: boolean;
	@Output() changeButtonPressed = new EventEmitter();

	constructor() { }

	ngOnInit() {
	}

}
