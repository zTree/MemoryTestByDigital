import { Routes } from '@angular/router';
import { PlatformComponent } from '../platform/platform.component';
import { NoContentComponent } from './no-content';

export const ROUTES: Routes = [
    {
        path: '',
        component: PlatformComponent
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    },
];
