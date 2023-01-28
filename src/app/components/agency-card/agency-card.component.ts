import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Agency, Project } from 'src/app/core/models/agency';
import SwiperCore, { Navigation, Pagination } from 'swiper';
SwiperCore.use([Navigation, Pagination]);

@Component({
  selector: 'app-agency-card',
  templateUrl: './agency-card.component.html',
  styleUrls: ['./agency-card.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AgencyCardComponent implements OnInit {
  @Input() agency: Agency;

  constructor() {}

  ngOnInit(): void {
    this.projects = this.agency.projects;
  }

  projects: Project[];
}
