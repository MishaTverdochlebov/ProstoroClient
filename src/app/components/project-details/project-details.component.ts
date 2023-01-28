import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ProjectDetails } from 'src/app/core/models/project';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProjectsService } from 'src/app/core/services/projects.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ProjectDetailsComponent implements OnInit {
  @Input() projectId: number;
  @Input() toLoad = false;
  @Output() actionEvent = new EventEmitter<string>();
  @ViewChild('projectContentList') projectContentList: ElementRef;
  project?: ProjectDetails;
  constructor(
    private projectsService: ProjectsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if(this.toLoad) {
      this.loadProjectData();
    }
    //this.loadProjectData();
  }

  ngAfterViewInit() {
    // console.log(this.projectId);
    // this.implementProjectData();
  }

  loadProjectData(): void {
    this.projectsService.getById(this.projectId).subscribe((response) => {
      this.project = response.data;
      this.implementProjectData();
    });
  }

  implementProjectData(): void {
    if (this.project == null) {
      return;
    }
    var projectElements = this.project?.elements;
    for (let i = 0; i < projectElements.length; i++) {
      const element = projectElements[i];
      if (element.type == 'image') {
        var contentElement = document.createElement('div');
        contentElement.classList.add('content-image');
        var contentImage = document.createElement('img');
        contentImage.src = element.image?.imgUrl!;
        contentElement.appendChild(contentImage);
        this.projectContentList.nativeElement.appendChild(contentElement);
      } else if (element.type == 'text') {
        var contentElement = document.createElement('div');
        contentElement.classList.add('content-text');
        var contentText = document.createElement('span');
        contentText.textContent = element.text!;
        contentElement.appendChild(contentText);
        this.projectContentList.nativeElement.appendChild(contentElement);
      }
      if (i != projectElements.length - 1) {
        var contentElement = document.createElement('div');
        contentElement.classList.add('content-separator');
        this.projectContentList.nativeElement.appendChild(contentElement);
      }
    }
  }
  onLikeClick(): void {
    if (!this.authService.isLoggedIn) {
      // this.modalWindowService.open('login-popup')
      return;
    }
    var likeModel = {
      projectId: this.project?.id,
      dislike: this.project?.isLiked,
    };
    this.projectsService
      .toLike(likeModel)
      .subscribe((res) => {
        this.project!.isLiked = !this.project?.isLiked;
        this.actionEvent.emit("like");
      });
  }

  onSaveClick(): void {
    var saveModel = {
      projectId: this.project?.id,
      unsave: this.project?.isSaved,
    };
    this.projectsService
      .toSave(saveModel)
      .subscribe((res) => {
        this.project!.isSaved = !this.project?.isSaved;
        this.actionEvent.emit("save");
      });
  }
}
