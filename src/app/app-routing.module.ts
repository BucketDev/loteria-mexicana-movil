import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'dashboard', loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardPageModule) },
  { path: 'friends', loadChildren: () => import('./pages/friends/friends.module').then(m => m.FriendsPageModule) },
  { path: 'login', loadChildren: () => import('./pages/security/login/login.module').then(m => m.LoginPageModule) },
  { path: 'board', loadChildren: () => import('./pages/board/board.module').then( m => m.BoardPageModule) },
  { path: 'profile', loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule) },
  { path: '**', redirectTo: '/dashboard', pathMatch: 'full' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
