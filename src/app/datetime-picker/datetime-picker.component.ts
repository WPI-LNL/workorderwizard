import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'app-datetime-picker',
	templateUrl: './datetime-picker.component.html',
	styleUrls: ['./datetime-picker.component.css']
})
export class DatetimePickerComponent implements OnInit {
	dateValue: string;
	timeValue: object;

	@Output() dateChange = new EventEmitter<string>();
	@Output() timeChange = new EventEmitter<object>();

	@Input()
	get date() {
		return this.dateValue;
	}

	set date(val) {
		this.dateValue = val;
		this.dateChange.emit(this.dateValue);
	}

	@Input()
	get time() {
		return this.timeValue;
	}

	set time(val) {
		this.timeValue = val;
		this.timeChange.emit(this.timeValue);
	}

	constructor() { }

	ngOnInit() {
	}

}
