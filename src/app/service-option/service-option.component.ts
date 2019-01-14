import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ServiceOption, Location, ServiceOptionChoice } from '../models';

@Component({
  selector: 'app-service-option',
  templateUrl: './service-option.component.html',
  styleUrls: ['./service-option.component.css']
})
export class ServiceOptionComponent implements OnInit {
  @Input() serviceOption: ServiceOption;
  @Input() location: Location;
  @Output() doValidate = new EventEmitter<void>();
  warning: string;

  constructor() { }

  ngOnInit() {
    this.validate();
  }

  select(choice: ServiceOptionChoice) {
    if (this.serviceOption.selectedChoice == choice) {
      const nullChoices = this.serviceOption.choices.filter(choice => choice.id === null);
      if (nullChoices.length === 0) {
        this.serviceOption.selectedChoice = null;
      } else if (nullChoices.length === 1) {
        this.serviceOption.selectedChoice = nullChoices[0];
      } else {
        throw "It is not allowed for multiple ServiceOptionChoices to have the same ID.";
      }
    } else {
      this.serviceOption.selectedChoice = choice;
    }
  }

  /**
   * Display a warning to the user if the user makes an ill-advised choice.
   * This function is called each time the user clicks a choice.
   */
  validate() {
    this.doValidate.emit();
    this.warning = null;
    if (this.serviceOption.selectedChoice) {
      if (this.serviceOption.selectedChoice.locationWhitelist &&
        this.serviceOption.selectedChoice.locationWhitelist.indexOf(this.location.name) == -1) {
          this.warning = `<strong>Not recommended in this location.</strong> \
            It is unusual to do ${this.serviceOption.title}: ${this.serviceOption.selectedChoice.title} \
            in ${this.location.name} \u2013 ${this.location.building}. We will carefully \
            examine the details of your event.`;
      }
      if (this.serviceOption.selectedChoice.locationBlacklist &&
        this.serviceOption.selectedChoice.locationBlacklist.indexOf(this.location.name) > -1) {
          this.warning = `<strong>Not recommended in this location.</strong> \
            It is unusual to do ${this.serviceOption.title}: ${this.serviceOption.selectedChoice.title} \
            in ${this.location.name} \u2013 ${this.location.building}. We will carefully \
            examine the details of your event.`;
      }
    }
  }

}
