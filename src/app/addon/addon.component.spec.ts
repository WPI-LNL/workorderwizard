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
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddonComponent } from './addon.component';

describe('AddonComponent', () => {
	let component: AddonComponent;
	let fixture: ComponentFixture<AddonComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ AddonComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AddonComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
