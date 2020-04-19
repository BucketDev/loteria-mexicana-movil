import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BoardPage } from './board.page';

const routes: Routes = [
  { path: ':userUid/:uid', component: BoardPage },
  { path: ':userUid/:uid/messages', loadChildren: () => import('./messages/messages.module').then( m => m.MessagesPageModule) },
  { path: ':userUid/:uid/players', loadChildren: () => import('./players/players.module').then( m => m.PlayersPageModule) },
  { path: '**', redirectTo: '/dashboard/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BoardPageRoutingModule {}
