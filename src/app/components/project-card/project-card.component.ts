import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { tap } from 'rxjs';
import { Project } from 'src/app/core/models/agency';
import { AuthService } from 'src/app/core/services/auth.service';
import { ModalWindowService } from 'src/app/core/services/modal-window.service';
import { ProjectsService } from 'src/app/core/services/projects.service';
import { ProjectDetailsComponent } from '../project-details/project-details.component';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css'],
})
export class ProjectCardComponent implements OnInit {
  @ViewChild(ProjectDetailsComponent) projectDetails:ProjectDetailsComponent;
  @Input() project: Project;
  @Input() displayButtons: boolean;
  projectPopupId: string;
  constructor(
    private projectsService: ProjectsService,
    private modalWindowService: ModalWindowService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.projectPopupId = 'project-popup-' + this.project.id;
  }

  onLikeClick(): void {
    if(!this.authService.isLoggedIn) {
      // this.modalWindowService.open('login-popup')
      return;
    }
    var likeModel = {
      projectId: this.project.id,
      dislike: this.project.isLiked,
    };
    this.projectsService
      .toLike(likeModel)
      .pipe(
        tap({
          next: () => {},
          error: (error: HttpErrorResponse) => {
            if (error.status == 401) {
              console.log('401 401 401');
            }
          },
        })
      )
      .subscribe((res) => {
        this.project.isLiked = !this.project.isLiked;
      });
  }

  onSaveClick(): void {
    var saveModel = {
      projectId: this.project.id,
      unsave: this.project.isSaved,
    };
    this.projectsService
      .toSave(saveModel)
      .pipe(
        tap({
          next: () => {},
          error: (error: HttpErrorResponse) => {
            if (error.status == 401) {
              console.log('401 401 401');
            }
          },
        })
      )
      .subscribe((res) => {
        this.project.isSaved = !this.project.isSaved;
      });
  }

  detailsChildEvent(action: string) {
    if(action == 'like') {
      this.project.isLiked = !this.project.isLiked;
    }
    else if(action == 'save') {
      this.project.isSaved = !this.project.isSaved;
    }
  }

  openProjectWindow(): void {
    this.projectDetails.loadProjectData();
    //this.projectDetails.implementProjectData();
    this.modalWindowService.open(this.projectPopupId);
  }
}
