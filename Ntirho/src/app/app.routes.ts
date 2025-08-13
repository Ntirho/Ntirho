import { Routes } from '@angular/router';
import { Hero } from '../components/hero/hero';
import { BrowseJobs } from './jobs/browse-jobs/browse-jobs';
import { ProfilePage } from './profile/profile-page/profile-page';
import { RegistrationPage } from './signup/registration-page/registration-page';
import { BrowseMatchedJobs } from './matches/browse-matched-jobs/browse-matched-jobs';
import { PostJob } from './admin/post-job/post-job';
import { ResetPassword } from './signup/reset-password/reset-password';

export const routes: Routes = [
    {
        path: '',
        component: Hero
    },
    {
        path: 'jobs',
        component: BrowseJobs
    },
    {
        path: 'profile',
        component: ProfilePage
    },
    {
        path: 'signup',
        component: RegistrationPage
    },
    {
        path: 'matches',
        component: BrowseMatchedJobs
    },
    {
        path: 'post-job',
        component: PostJob
    },
    {
        path: 'reset-password',
        component: ResetPassword
    }
];
