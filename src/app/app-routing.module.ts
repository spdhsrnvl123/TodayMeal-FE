import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainPageComponent} from "./pages/main-page/main-page.component";
import {RegisterPageComponent} from "./pages/register-page/register-page.component";
import {LocationDetailComponent} from "./pages/location-detail/location-detail.component";
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { StartPageComponent } from './pages/start-page/start-page.component';

export const routes: Routes = [
  {
    path: 'start',
    component: StartPageComponent,
    children: [
      {
        path: 'signin',
        component: SignInComponent,
      },
      {
        path: 'signup',
        component: SignUpComponent,
      },
    ],
  },
  {
    path: 'main',
    component: MainPageComponent,
    children: [
      {
        path: 'location/:id',
        component: LocationDetailComponent,
      },
    ],
  },
  {
    path: 'location/:id',
    component: LocationDetailComponent,
  },
  {
    path: 'register',
    component: RegisterPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
