import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Location } from '../models';

@Component({
  selector: 'app-autopopulate-success-modal',
  templateUrl: './autopopulate-success-modal.component.html',
  styleUrls: ['./autopopulate-success-modal.component.css']
})
export class AutopopulateSuccessModalComponent implements OnInit {
  eventName: string;
  eventLocation: Location;
  eventStart: Date;

  constructor(public modal: NgbActiveModal) { }

  ngOnInit() {
  }

}
