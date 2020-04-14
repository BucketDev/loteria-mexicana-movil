import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-empty-records',
  templateUrl: './empty-records.component.html',
  styleUrls: ['./empty-records.component.scss'],
})
export class EmptyRecordsComponent implements OnInit {

  @Input() title: string;
  @Input() subtitle: string;
  @Input() icon: string;
  @Input() mini = false;

  constructor() { }

  ngOnInit() {}

  getImgURL = () => this.mini ? `https://img.icons8.com/bubbles/64/${this.icon}` :
    `https://img.icons8.com/bubbles/128/${this.icon}`

}
