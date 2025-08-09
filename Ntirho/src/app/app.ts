import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Header } from "../components/header/header";
import { Hero } from "../components/hero/hero";
import { Footer } from "../components/footer/footer";
import { ToastrModule } from 'ngx-toastr';
import { SwitchViews } from '../services/switch-views';
import { BrowseJobs } from "./jobs/browse-jobs/browse-jobs";
import { ProfileForm } from "../components/profile-form/profile-form";
import { ProfilePage } from "./profile/profile-page/profile-page";
import { RegistrationPage } from "./signup/registration-page/registration-page";
import { PostJob } from "./admin/post-job/post-job";

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Header,
    Footer,
    CommonModule,
],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'Ntirho';

  // To change through different pages
  view = 'hero';

  constructor(private viewService: SwitchViews) {}

  ngOnInit() {
    this.viewService.view$.subscribe(v => this.view = v);
  }
}
