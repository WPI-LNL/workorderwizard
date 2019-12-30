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

@Component({
	selector: 'app-error-modal',
	templateUrl: './error-modal.component.html',
	styleUrls: ['./error-modal.component.css']
})
export class ErrorModalComponent implements OnInit {
	message: string;

	constructor() { }

	ngOnInit() {
	}

}
