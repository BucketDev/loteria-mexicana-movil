import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddFriendPage } from './add-friend.page';
import {ComponentsModule} from "../../../components/components.module";
import {FriendsModule} from "../../../components/friends/friends.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    FriendsModule
  ],
  declarations: [AddFriendPage],
  entryComponents: [AddFriendPage]
})
export class AddFriendPageModule {}
