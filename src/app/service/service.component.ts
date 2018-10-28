import { Component, Input, OnInit } from '@angular/core';

import { Service } from '../models';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {
	@Input() service: Service;

  constructor() { }

  ngOnInit() {
  }

}
