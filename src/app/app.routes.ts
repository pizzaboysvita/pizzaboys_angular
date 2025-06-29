import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { AdminGuard } from './shared/auth.guard/auth.guard';
import { ContentComponent } from './shared/components/layout/content/content.component';
import { content } from './shared/routes/routes';
import { SignUpComponent } from './pages/sign-up/sign-up.component';

export const routes: Routes = [
    // {
    //     path: '',
    //     redirectTo: 'dashboard',
    //     pathMatch: 'full'
    // },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'forget-password',
        component: ForgetPasswordComponent,
    },
    {
        path: 'sign-up',
        component: SignUpComponent,
    },
    {   
        path: '',
        component: ContentComponent,
        children: content,
        canActivate: [AdminGuard],
    },
];
