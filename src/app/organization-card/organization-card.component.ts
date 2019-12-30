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
