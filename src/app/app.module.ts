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

@NgModule({
  declarations: [
    AppComponent,
    WizardProgressStepComponent,
    OrganizationCardComponent,
    DatetimePickerComponent,
    ServiceOptionComponent,
    ErrorModalComponent,
    ServiceComponent
  ],
  imports: [
    BrowserModule,
		FormsModule,
		HttpClientModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent],
	entryComponents: [ErrorModalComponent]
})
export class AppModule { }
