import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { SavesService } from 'src/app/core/services/saves.service';

@Component({
  selector: 'app-user-profile-page',
  templateUrl: './user-profile-page.component.html',
  styleUrls: ['./user-profile-page.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class UserProfilePageComponent implements OnInit {
  projectsFolder: any;
  agenciesFolder: any;
  profileInfo: any;
  constructor(
    private savesService: SavesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadSaves();
    this.loadProfileInfo();
  }

  loadSaves(): void {
    this.savesService.get().subscribe((response) => {
      if (response.data.savesFolders[0].name == 'agencies') {
        this.agenciesFolder = response.data.savesFolders[0].agencies;
        this.projectsFolder = response.data.savesFolders[1].projects;
      } else {
        this.projectsFolder = response.data.savesFolders[0].projects;
        this.agenciesFolder = response.data.savesFolders[1].agencies;
      }
    });
  }

  loadProfileInfo() {
    this.authService.getProfileInfo().subscribe((res) => {
      this.profileInfo = res.data;
    });
  }

  numSequenceOfRemaining(array?: Array<any>): Array<number> {
    if (!array) {
      return Array(4);
    }
    return Array(4 - array.length);
  }
}
