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
