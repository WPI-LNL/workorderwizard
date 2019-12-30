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

import { Addon } from '../models';

@Component({
	selector: 'app-addon',
	templateUrl: './addon.component.html',
	styleUrls: ['./addon.component.css']
})
export class AddonComponent implements OnInit {
	@Input() addon: Addon;

	constructor() { }

	ngOnInit() {
	}

}
