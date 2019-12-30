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
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Location } from '../models';

@Component({
	selector: 'app-autopopulate-success-modal',
	templateUrl: './autopopulate-success-modal.component.html',
	styleUrls: ['./autopopulate-success-modal.component.css']
})
export class AutopopulateSuccessModalComponent implements OnInit {
	eventName: string;
	eventLocation: Location;
	eventStart: Date;

	constructor(public modal: NgbActiveModal) { }

	ngOnInit() {
	}

}
