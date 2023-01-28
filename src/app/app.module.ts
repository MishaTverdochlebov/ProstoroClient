import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutosizeModule } from 'ngx-autosize';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopPanelComponent } from './components/top-panel/top-panel.component';
import { SearchComponent } from './components/search/search.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { ProjectsPageComponent } from './components/projects-page/projects-page.component';
import { AgenciesPageComponent } from './components/agencies-page/agencies-page.component';
import { AgencyCardComponent } from './components/agency-card/agency-card.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SwiperModule } from 'swiper/angular';
import { GlobalErrorComponent } from './components/global-error/global-error.component';
import { TestComponent } from './components/test/test.component';
import { CalculationsComponent } from './components/calculations/calculations.component';
import { LoginWindowComponent } from './components/login-window/login-window.component';
import { AgencyDetailsComponent } from './components/agency-details/agency-details.component';
import { ProjectCardComponent } from './components/project-card/project-card.component';
import { FooterComponent } from './components/footer/footer.component';
import { ReviewCardComponent } from './components/review-card/review-card.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { PopupWindowComponent } from './components/popup-window/popup-window.component';
import { AgencyEditPageComponent } from './components/agency-edit-page/agency-edit-page.component';
import { MessagePopupComponent } from './components/message-popup/message-popup.component';
import { ProMainPageComponent } from './components/pro-main-page/pro-main-page.component';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';
import { AgencyProfilePageComponent } from './components/agency-profile-page/agency-profile-page.component';
import { ProfileSettingsPageComponent } from './components/profile-settings-page/profile-settings-page.component';
import { ProLoginWindowComponent } from './components/pro-login-window/pro-login-window.component';
import { ProjectEditPageComponent } from './components/project-edit-page/project-edit-page.component';
import { ProjectContentElementComponent } from './components/project-content-element/project-content-element.component';
import { MessagesPageComponent } from './components/messages-page/messages-page.component';
import { CustomDatePipe } from './core/pipes/custom-date-pipe';
import { ArticleOneComponent } from './components/articles/article-one/article-one.component';
import { ArticleTwoComponent } from './components/articles/article-two/article-two.component';
import { FinishEditWindowComponent } from './components/finish-edit-window/finish-edit-window.component';
import { TermsComponent } from './components/terms/terms.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ArticleThreeComponent } from './components/articles/article-three/article-three.component';
import { ArticleFourComponent } from './components/articles/article-four/article-four.component';
import { UserProfilePageComponent } from './components/user-profile-page/user-profile-page.component';
import { UserProfileSettingsPageComponent } from './components/user-profile-settings-page/user-profile-settings-page.component';
import { SavesFolderPageComponent } from './components/saves-folder-page/saves-folder-page.component';
import { TranslatePipe } from './core/pipes/translate-pipe';
import { CodeInputModule } from 'angular-code-input';

@NgModule({
  declarations: [
    AppComponent,
    TopPanelComponent,
    SearchComponent,
    MainPageComponent,
    ProjectsPageComponent,
    AgenciesPageComponent,
    AgencyCardComponent,
    GlobalErrorComponent,
    TestComponent,
    CalculationsComponent,
    LoginWindowComponent,
    AgencyDetailsComponent,
    ProjectCardComponent,
    FooterComponent,
    ReviewCardComponent,
    PopupWindowComponent,
    AgencyEditPageComponent,
    MessagePopupComponent,
    ProMainPageComponent,
    ProjectDetailsComponent,
    AgencyProfilePageComponent,
    ProfileSettingsPageComponent,
    ProLoginWindowComponent,
    ProjectEditPageComponent,
    ProjectContentElementComponent,
    MessagesPageComponent,
    CustomDatePipe,
    TranslatePipe,
    ArticleOneComponent,
    ArticleTwoComponent,
    FinishEditWindowComponent,
    TermsComponent,
    PageNotFoundComponent,
    ArticleThreeComponent,
    ArticleFourComponent,
    UserProfilePageComponent,
    UserProfileSettingsPageComponent,
    SavesFolderPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    SwiperModule,
    AutosizeModule,
    CodeInputModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
