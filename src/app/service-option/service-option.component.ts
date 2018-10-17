import { Component, Input, OnInit } from '@angular/core';

import { ServiceOption } from '../models';

@Component({
  selector: 'app-service-option',
  templateUrl: './service-option.component.html',
  styleUrls: ['./service-option.component.css']
})
export class ServiceOptionComponent implements OnInit {
	@Input() serviceOption: ServiceOption;

  constructor() { }

  ngOnInit() {
  }

}
