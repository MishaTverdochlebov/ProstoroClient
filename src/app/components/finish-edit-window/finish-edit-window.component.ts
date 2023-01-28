import { Component, Input } from '@angular/core';
import { Agency } from 'src/app/core/models/agency';

@Component({
  selector: 'app-finish-edit-window',
  templateUrl: './finish-edit-window.component.html',
  styleUrls: ['./finish-edit-window.component.css']
})
export class FinishEditWindowComponent {
  @Input() agency?: Agency;

  get generalInfoFilled(): boolean {
    return !!this.agency?.city //&&
  }
  
  get logoFilled(): boolean {
    return !!this.agency?.logoImgUrl
  }
  
  get aboutFilled(): boolean {
    return !!this.agency?.about && !!this.agency?.description;
  }
  
  get tagsFilled(): boolean {
    return !!this.agency?.tags && this.agency?.tags?.length > 0;
  }
  
  get projectsFilled(): boolean {
    return !!this.agency?.projects && this.agency?.projects.length > 0;
  }
}
