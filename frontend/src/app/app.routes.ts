import { Routes } from '@angular/router';
import {LoginPage} from "./pages/login-page/login-page";
import {ExamplePage} from "./pages/example-page/example-page";
import {AuthGuardService} from "./services/auth-guard-service";
import {LandingPage} from "./pages/landing-page/landing-page";
import {NotFoundPage} from "./pages/not-found-page/not-found-page";

/*
  This array holds the relation of paths and components, which angular router should resolve.

  If you want to add a new page with a separate path/subdirectory you should register it here.
  It is also possible to read parameters from the path they have to be specified with ':' in the path.

  If a new page should also show up in the menu bar, you need to add it there too.
  Look at: frontend/src/app/components/menu-bar/menu-bar.ts
 */
export const routes: Routes = [
    {path: 'login', component: LoginPage},
    {path: 'example', component: ExamplePage, canActivate: [AuthGuardService]},
    {path: '', component: LandingPage, canActivate: [AuthGuardService]},
    {path: '**', component: NotFoundPage} // these entries are matched from top to bottom => not found should be the last entry
];
