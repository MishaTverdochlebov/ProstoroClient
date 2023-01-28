import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AgenciesService } from 'src/app/core/services/agencies.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ModalWindowService } from 'src/app/core/services/modal-window.service';
import { ProjectsService } from 'src/app/core/services/projects.service';
import { SavesService } from 'src/app/core/services/saves.service';

@Component({
  selector: 'app-saves-folder-page',
  templateUrl: './saves-folder-page.component.html',
  styleUrls: ['./saves-folder-page.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SavesFolderPageComponent {
  private routeSub: Subscription;
  folderName: string;
  projectsFolder: Array<any>;
  agenciesFolder: Array<any>;
  profileInfo: any;
  constructor(
    private savesService: SavesService,
    private projectsService: ProjectsService,
    private agenciesService: AgenciesService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private modalWindowService: ModalWindowService
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      this.folderName = params['folder'];
      this.loadSaves();
      this.loadProfileInfo();
    });
  }

  loadSaves(): void {
    this.savesService.getByFolderName(this.folderName).subscribe((response) => {
      this.agenciesFolder = response.data.agencies;
      this.projectsFolder = response.data.projects;
    });
  }

  loadProfileInfo() {
    this.authService.getProfileInfo().subscribe((res) => {
      this.profileInfo = res.data;
    })
  }

  removeProjectSave(projectId: number) {
    var saveModel = {
      projectId: projectId,
      unsave: true,
    };
    this.projectsService.toSave(saveModel).subscribe((res) => {
      var index = this.projectsFolder.findIndex(p => p.id === projectId)
      this.projectsFolder.splice(index, 1);
    });
  }
  
  removeAgencySave(agencyId: number) {
    var saveModel = {
      agencyId: agencyId,
      unsave: true,
    };
    this.agenciesService.toSave(saveModel).subscribe((res) => {
      var index = this.agenciesFolder.findIndex(a => a.id === agencyId)
      this.agenciesFolder.splice(index, 1);
    });
  }

  openProjectWindow(popupId: string): void {
    this.modalWindowService.open(popupId);
  }
}
