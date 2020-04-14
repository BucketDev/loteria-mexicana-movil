import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BoardSettingsPage } from './board-settings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [BoardSettingsPage],
  entryComponents: [BoardSettingsPage]
})
export class BoardSettingsPageModule {}
