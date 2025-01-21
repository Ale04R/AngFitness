import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CorsiComponent } from './corsi/corsi.component';
import { ChisiamoComponent } from './chisiamo/chisiamo.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'chisiamo', component: ChisiamoComponent},
    {path: 'corsi', component: CorsiComponent},
];
