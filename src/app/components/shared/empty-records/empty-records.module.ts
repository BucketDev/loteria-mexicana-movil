import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EmptyRecordsComponent} from "./empty-records.component";
import {IonicModule} from "@ionic/angular";

@NgModule({
  imports: [
    CommonModule,
    IonicModule
  ],
  declarations: [EmptyRecordsComponent],
  exports: [EmptyRecordsComponent]
})
export class EmptyRecordsModule { }
