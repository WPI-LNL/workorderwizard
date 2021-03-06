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
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { WizardProgressStepComponent } from './wizard-progress-step/wizard-progress-step.component';
import { OrganizationCardComponent } from './organization-card/organization-card.component';
import { DatetimePickerComponent } from './datetime-picker/datetime-picker.component';
import { ServiceOptionComponent } from './service-option/service-option.component';
import { ErrorModalComponent } from './error-modal/error-modal.component';
import { ServiceComponent } from './service/service.component';
import { AddonComponent } from './addon/addon.component';
import { AutopopulateSuccessModalComponent } from './autopopulate-success-modal/autopopulate-success-modal.component';
import { MultiServiceOptionComponent } from './multi-service-option/multi-service-option.component';

@NgModule({
	declarations: [
		AppComponent,
		WizardProgressStepComponent,
		OrganizationCardComponent,
		DatetimePickerComponent,
		ServiceOptionComponent,
		ErrorModalComponent,
		ServiceComponent,
		AddonComponent,
		AutopopulateSuccessModalComponent,
		MultiServiceOptionComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpClientModule,
		NgbModule
	],
	providers: [],
	bootstrap: [AppComponent],
	entryComponents: [ErrorModalComponent, AutopopulateSuccessModalComponent]
})
export class AppModule { }
