import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Service, ServiceOption } from '../models';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {
  @Input() service: Service;
  @Input() location: Location;
  @Output() doValidate = new EventEmitter<void>();
  serviceOptions: (ServiceOption | ServiceOption[])[] = [];

  constructor() { }

  ngOnInit() {
    let multi = [];
    for (const serviceOption of this.service.serviceOptions) {
      if (serviceOption.isBoolean) {
        multi.push(serviceOption);
      } else {
        if (multi.length > 0) {
          this.serviceOptions.push(multi);
          multi = [];
        }
        this.serviceOptions.push(serviceOption);
      }
    }
    if (multi.length > 0) {
      this.serviceOptions.push(multi);
    }
  }

  showHideAddons() {
    for (const addon of this.service.addons) {
      if (addon.dependencies) {
        let all_met = true;
        for (const dependency_set of addon.dependencies) {
          let set_met = false;
          for (const depend of dependency_set) {
            if (this.service.isChoiceSelected(depend)) {
              set_met = true;
              break;
            }
          }
          if (!set_met) {
            all_met = false;
            break;
          }
        }
        addon.hidden = !all_met;
        if (addon.hidden) {
          addon.quantity = 0;
        }
      }
    }
  }
}
