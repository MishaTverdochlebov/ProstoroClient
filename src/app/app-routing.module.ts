import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgenciesPageComponent } from './components/agencies-page/agencies-page.component';
import { AgencyDetailsComponent } from './components/agency-details/agency-details.component';
import { AgencyEditPageComponent } from './components/agency-edit-page/agency-edit-page.component';
import { AgencyProfilePageComponent } from './components/agency-profile-page/agency-profile-page.component';
import { ArticleFourComponent } from './components/articles/article-four/article-four.component';
import { ArticleOneComponent } from './components/articles/article-one/article-one.component';
import { ArticleThreeComponent } from './components/articles/article-three/article-three.component';
import { ArticleTwoComponent } from './components/articles/article-two/article-two.component';
import { LoginWindowComponent } from './components/login-window/login-window.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { MessagesPageComponent } from './components/messages-page/messages-page.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ProMainPageComponent } from './components/pro-main-page/pro-main-page.component';
import { ProfileSettingsPageComponent } from './components/profile-settings-page/profile-settings-page.component';
import { ProjectEditPageComponent } from './components/project-edit-page/project-edit-page.component';
import { ProjectsPageComponent } from './components/projects-page/projects-page.component';
import { SavesFolderPageComponent } from './components/saves-folder-page/saves-folder-page.component';
import { TermsComponent } from './components/terms/terms.component';
import { TestComponent } from './components/test/test.component';
import { UserProfilePageComponent } from './components/user-profile-page/user-profile-page.component';
import { UserProfileSettingsPageComponent } from './components/user-profile-settings-page/user-profile-settings-page.component';

const routes: Routes = [
  // { path: '',   redirectTo: 'home', pathMatch: 'full' },
  { path: '', component: MainPageComponent },
  { path: 'projects', component: ProjectsPageComponent },
  { path: 'agencies', component: AgenciesPageComponent },
  { path: 'agencies/:id', component: AgencyDetailsComponent },
  { path: 'blog/1', component: ArticleOneComponent },
  { path: 'blog/2', component: ArticleTwoComponent },
  { path: 'blog/3', component: ArticleThreeComponent },
  { path: 'blog/4', component: ArticleFourComponent },
  { path: 'profile', component: UserProfilePageComponent },
  { path: 'profile-settings', component: UserProfileSettingsPageComponent },
  { path: 'saves/:folder', component: SavesFolderPageComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'messages', component: MessagesPageComponent },
  { path: 'pro', component: ProMainPageComponent },
  { path: 'pro/agency', component: AgencyProfilePageComponent },
  { path: 'pro/agency/edit', component: AgencyEditPageComponent },
  { path: 'pro/settings/edit', component: ProfileSettingsPageComponent },
  { path: 'pro/project/edit', component: ProjectEditPageComponent },
  { path: 'pro/messages', component: MessagesPageComponent },

  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
