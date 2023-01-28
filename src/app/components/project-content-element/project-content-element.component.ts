import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Tag } from 'src/app/core/models/tag';
import { tagOptions } from 'src/app/test-data/tags-data';

@Component({
  selector: 'app-project-content-element',
  templateUrl: './project-content-element.component.html',
  styleUrls: ['./project-content-element.component.css'],
})
export class ProjectContentElementComponent implements OnInit {
  @Input() element: any;
  @Output() removeEvent = new EventEmitter<any>();
  @Output() updateEvent = new EventEmitter<any>();
  isRemoved = false;
  @ViewChild('textarea') textarea?: ElementRef;
  @ViewChild('addTagsBtn') addTagsBtn?: ElementRef;
  @ViewChild('addTagsBox') addTagsBox?: ElementRef;
  textareaValue?: any;
  // textareaOnFocus = false;
  addTagsBoxActive = false;
  tagOptions = tagOptions;
  inputStyleTag: any;
  inputRoomTag: any;
  filteredStyleTags: Tag[] = [];
  filteredRoomTags: Tag[] = [];
  selectedStyleTags: Tag[] = [];
  selectedRoomTags: Tag[] = [];
  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.element.type === 'text') {
      // setTimeout(() => {
      //   this.textarea!.nativeElement.focus();
      // }, 50);
      this.textarea!.nativeElement.focus();
      this.textarea!.nativeElement.addEventListener('focusout', () => {
        if (!this.textarea!.nativeElement.value) {
          this.removeElement();
        } else {
          this.updateElement();
        }
      });
    }
  }

  // @HostListener('document:click', ['$event'])
  // clickout(event: any) {
  //   if (
  //     !this.addTagsBox?.nativeElement.contains(event.target) &&
  //     !this.addTagsBtn?.nativeElement.contains(event.target)
  //   ) {
  //     this.addTagsBoxActive = false;
  //   }
  // }

  filterTags(tagType: string) {
    let filterdTags = this.tagOptions.filter(
      (item) =>
        item.type === tagType &&
        item.value
          .toLowerCase()
          .includes(
            tagType === 'style'
              ? this.inputStyleTag.toLowerCase()
              : this.inputRoomTag.toLowerCase()
          ) &&
        !this.isAddedTag(item)
    );
    if (tagType === 'style') {
      this.filteredStyleTags = filterdTags.slice(0, 3);
    } else if (tagType === 'room') {
      this.filteredRoomTags = filterdTags.slice(0, 3);
    }
  }

  isAddedTag(tag: Tag): boolean {
    if (tag.type === 'style') {
      return !!this.selectedStyleTags.find((t) => t.value === tag.value);
    } else if (tag.type === 'room') {
      return !!this.selectedRoomTags.find((t) => t.value === tag.value);
    }
    return false;
  }

  addTag(tag: Tag) {
    if (tag.type === 'style' && this.selectedStyleTags.length < 3) {
      this.selectedStyleTags.push(tag);
      this.inputStyleTag = '';
    } else if (tag.type === 'room' && this.selectedRoomTags.length < 2) {
      this.selectedRoomTags.push(tag);
      this.inputRoomTag = '';
    }
    this.filterTags(tag.type);
  }

  removeTag(tag: Tag) {
    if (tag.type === 'style') {
      const index = this.selectedStyleTags.indexOf(tag, 0);
      if (index > -1) {
        this.selectedStyleTags.splice(index, 1);
      }
    } else if (tag.type === 'room') {
      const index = this.selectedRoomTags.indexOf(tag, 0);
      if (index > -1) {
        this.selectedRoomTags.splice(index, 1);
      }
    }
    this.filterTags(tag.type);
  }

  removeElement(): void {
    this.isRemoved = true;
    setTimeout(() => {
      // this.removeEvent.emit(this.element);
      this.removeEvent.emit();
    }, 400);
  }

  updateElement() {
    if (this.element.type === 'text') {
      let updatedElement = {
        key: this.element.key,
        type: 'text',
        text: this.textarea!.nativeElement.value,
      };
      this.updateEvent.emit(updatedElement);
    } else {
      let updatedElement = {
        key: this.element.key,
        type: 'image',
        image: {
          imgUrl: this.element.image.imgUrl,
          tags: this.selectedRoomTags.concat(this.selectedStyleTags)
        },
      };
      this.updateEvent.emit(updatedElement);
    }
  }
}
