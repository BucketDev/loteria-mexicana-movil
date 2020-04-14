import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DashboardRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import {ComponentsModule} from '../../components/components.module';
import {NewBoardPageModule} from '../modal/new-board/new-board.module';
import {NewFriendPageModule} from '../modal/new-friend/new-friend.module';
import {NotificationPopoverModule} from "../../components/notification-popover/notification-popover.module";
import {EmptyRecordsModule} from "../../components/shared/empty-records/empty-records.module";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    DashboardRoutingModule,
    ComponentsModule,
    NewBoardPageModule,
    NewFriendPageModule,
    NotificationPopoverModule,
    EmptyRecordsModule
  ],
  declarations: [
    DashboardPage
  ]
})
export class DashboardPageModule {}
