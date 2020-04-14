import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewFriendPage } from './new-friend.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [NewFriendPage],
  entryComponents: [NewFriendPage]
})
export class NewFriendPageModule {}
