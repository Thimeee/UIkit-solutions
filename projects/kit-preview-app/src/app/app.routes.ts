import { Routes } from '@angular/router';
import { AlertDemoComponent } from './alertComponent';
import { KitPreviewComponent } from './kitPreviewComponent';

export const routes: Routes = [
    // If someone visits the root directory, choose where to send them:
    { path: '', redirectTo: '/preview', pathMatch: 'full' },

    // Path for your UI Kit preview workspace
    { path: 'preview', component: KitPreviewComponent },

    // Path for your dedicated alert component demo
    { path: 'alert', component: AlertDemoComponent },

];
