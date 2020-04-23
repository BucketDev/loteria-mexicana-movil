import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FriendsPage } from './friends.page';
import {FriendsRoutingModule} from "./friends-routing.module";
import {EmptyRecordsModule} from "../../components/shared/empty-records/empty-records.module";
import {FriendsModule} from "../../components/friends/friends.module";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: FriendsPage }]),
    FriendsRoutingModule,
    EmptyRecordsModule,
    FriendsModule
  ],
  declarations: [FriendsPage]
})
export class FriendsPageModule {}
