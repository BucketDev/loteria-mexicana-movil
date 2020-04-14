import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewBoardPage } from './new-board.page';
import {ComponentsModule} from '../../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ComponentsModule
  ],
  declarations: [
      NewBoardPage
  ],
  entryComponents: [
      NewBoardPage
  ]
})
export class NewBoardPageModule {}
