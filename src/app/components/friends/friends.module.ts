import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MyFriendsComponent} from "./my-friends/my-friends.component";
import {IonicModule} from "@ionic/angular";
import {FindFriendsComponent} from "./find-friends/find-friends.component";
import {EmptyRecordsModule} from "../shared/empty-records/empty-records.module";

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    EmptyRecordsModule
  ],
  declarations: [
    MyFriendsComponent,
    FindFriendsComponent
  ],
  exports: [
    MyFriendsComponent,
    FindFriendsComponent
  ]
})
export class FriendsModule { }
