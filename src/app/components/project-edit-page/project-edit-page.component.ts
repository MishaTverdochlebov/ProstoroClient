import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import {
  ProjectCreateRequest,
  ProjectDetailsObject,
} from 'src/app/core/models/project';
import { ImageSnippet } from 'src/app/core/models/response';
import { Tag } from 'src/app/core/models/tag';
import { ImagesService } from 'src/app/core/services/images.service';
import { ModalWindowService } from 'src/app/core/services/modal-window.service';
import { ProjectsService } from 'src/app/core/services/projects.service';
import { tagOptions } from 'src/app/test-data/tags-data';

@Component({
  selector: 'app-project-edit-page',
  templateUrl: './project-edit-page.component.html',
  styleUrls: ['./project-edit-page.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ProjectEditPageComponent implements OnInit {
  projectForm!: FormGroup;
  projectId?: number;
  project?: ProjectDetailsObject;
  request?: ProjectCreateRequest = {
    name: '',
    mainImage: '',
    agencyId: 3,
    elements: [],
    tags: [],
  };
  elementsCounter: number = 0;
  selectedFile: ImageSnippet;
  @ViewChild('projectContentList') projectContentList: ElementRef;
  tagOptions = tagOptions;
  inputStyleTag: any;
  filteredStyleTags: Tag[] = [];
  selectedStyleTags: Tag[] = [];

  constructor(
    private projectsService: ProjectsService,
    private imagesService: ImagesService,
    private modalWindowService: ModalWindowService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProjectInfo();
    this.projectForm = new FormGroup({
      // agencyName: new FormControl('', [Validators.required]),
      // contactName: new FormControl('', [Validators.required]),
    });
    // setTimeout(() => {
    //   this.openSaveWindow();
    // }, 100);
  }

  ngAfterViewInit() {
    // setTimeout(() => {
    //   this.pushImage(
    //     'https://res.cloudinary.com/interiorhub/image/upload/v1668341154/dkqtiwt1imd2wiaq8lh4.jpg'
    //   );
    // }, 100);
  }

  loadProjectInfo() {
    if (this.projectId != null) {
      this.projectsService.getById(this.projectId).subscribe((response) => {
        this.project = response.data;
      });
    } else {
      this.project = new ProjectDetailsObject();
      this.project.elements = [];
      // this.project.elements.push({
      //   type: "text"
      // });
    }
  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);
      this.imagesService
        .uploadImage(this.selectedFile.file)
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
          this.pushImage(res.data);
        });
    });

    reader.readAsDataURL(file);
  }

  pushImage(imgUrl: string): void {
    this.request!.elements!.push({
      key: this.elementsCounter++,
      type: 'image',
      image: {
        imgUrl: imgUrl,
      },
    });
    if (!this.request?.mainImage) {
      this.request!.mainImage = imgUrl;
    }
  }

  pushText(text: string): void {
    this.request!.elements!.push({
      key: this.elementsCounter++,
      type: 'text',
      text: text,
    });
  }

  removeElement(element: any): void {
    const index = this.request!.elements!.indexOf(element, 0);
    if (index > -1) {
      this.request!.elements!.splice(index, 1);
    }
    if (this.request?.mainImage === element.image.imgUrl) {
      this.request!.mainImage = '';
    }
  }

  updateElement(element: any): void {
    let oldElement = this.request!.elements!.find(
      (el) => el.key === element.key
    );
    const index = this.request!.elements!.indexOf(oldElement, 0);
    if (index > -1) {
      if (element.type === 'text') {
        this.request!.elements![index].text = element.text;
      } else {
        this.request!.elements![index].image.tags = element.image.tags;
      }
    }
    console.log(this.request!.elements!);
    // console.log(this.request!.elements![index]);
  }

  filterTags(tagType: string) {
    let filterdTags = this.tagOptions.filter(
      (item) =>
        item.type === tagType &&
        item.value.toLowerCase().includes(this.inputStyleTag.toLowerCase()) &&
        !this.isAddedTag(item)
    );
    this.filteredStyleTags = filterdTags.slice(0, 3);
  }
  isAddedTag(tag: Tag): boolean {
    return !!this.selectedStyleTags.find((t) => t.value === tag.value);
  }

  addTag(tag: Tag) {
    if (this.selectedStyleTags.length < 10) {
      this.selectedStyleTags.push(tag);
      this.inputStyleTag = '';
      this.filterTags(tag.type);
    }
  }

  removeTag(tag: Tag) {
    const index = this.selectedStyleTags.indexOf(tag, 0);
    if (index > -1) {
      this.selectedStyleTags.splice(index, 1);
    }
    this.filterTags(tag.type);
  }

  openSaveWindow(): void {
    this.modalWindowService.open('save-project-popup');
  }

  submitSave(): void {
    // console.log(this.request);
    this.projectsService
      .post(this.request!)
      .pipe(
        tap({
          next: () => {},
          error: (error: HttpErrorResponse) => {
            if (error.status == 401) {
              // console.log('401 401 401');
            }
          },
        })
      )
      .subscribe((res) => {
        // console.log(res);
        this.modalWindowService.close('save-project-popup');
        setTimeout(() => {
          this.router.navigate(['/pro/agency']);
        }, 100);
      });
  }

  cancel() {
    this.modalWindowService.close('save-project-popup');
  }
}
