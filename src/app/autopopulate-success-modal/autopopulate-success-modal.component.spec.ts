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

import { AutopopulateSuccessModalComponent } from './autopopulate-success-modal.component';

describe('ErrorModalComponent', () => {
	let component: AutopopulateSuccessModalComponent;
	let fixture: ComponentFixture<AutopopulateSuccessModalComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ AutopopulateSuccessModalComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AutopopulateSuccessModalComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
