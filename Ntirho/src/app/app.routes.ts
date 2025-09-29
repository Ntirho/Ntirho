import { Routes } from '@angular/router';
import { Hero } from '../components/hero/hero';
import { BrowseJobs } from './jobs/browse-jobs/browse-jobs';
import { ProfilePage } from './profile/profile-page/profile-page';
import { RegistrationPage } from './signup/registration-page/registration-page';
import { BrowseMatchedJobs } from './matches/browse-matched-jobs/browse-matched-jobs';
import { PostJob } from './admin/post-job/post-job';
import { ResetPassword } from './signup/reset-password/reset-password';
import { AuthGuard } from './guards/can-activate-guard-guard';

export const routes: Routes = [
    {
        path: '',
        component: Hero, 
        canActivate: [AuthGuard]
    },
    {
        path: 'jobs',
        component: BrowseJobs, 
        canActivate: [AuthGuard]
    },
    {
        path: 'profile',
        component: ProfilePage,
        canActivate: [AuthGuard]
    },
    {
        path: 'signup',
        component: RegistrationPage, 
        canActivate: [AuthGuard]
    },
    {
        path: 'matches',
        component: BrowseMatchedJobs,
        canActivate: [AuthGuard]
    },
    {
        path: 'post-job',
        component: PostJob,
        canActivate: [AuthGuard]
    },
    {
        path: 'reset-password',
        component: ResetPassword, 
        canActivate: [AuthGuard]
    }
];
