import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NotificationPopoverComponent} from "./notification-popover.component";
import {IonicModule} from "@ionic/angular";
import {EmptyRecordsModule} from "../shared/empty-records/empty-records.module";

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    EmptyRecordsModule
  ],
  declarations: [NotificationPopoverComponent],
  entryComponents: [NotificationPopoverComponent]
})
export class NotificationPopoverModule { }
