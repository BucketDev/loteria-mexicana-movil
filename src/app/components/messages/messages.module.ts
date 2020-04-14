import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MessagesComponent} from "./messages.component";
import {IonicModule} from "@ionic/angular";

@NgModule({
  imports: [
    IonicModule,
    CommonModule
  ],
  declarations: [
    MessagesComponent
  ],
  entryComponents: [
    MessagesComponent
  ]
})
export class MessagesModule { }
