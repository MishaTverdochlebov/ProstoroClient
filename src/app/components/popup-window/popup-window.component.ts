import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ModalWindowService } from 'src/app/core/services/modal-window.service';

@Component({
  selector: 'app-popup-window',
  templateUrl: './popup-window.component.html',
  styleUrls: ['./popup-window.component.css'],
})
export class PopupWindowComponent implements OnInit {
  @Input() id: string;
  isActive = false;
  private element: any;
  constructor(
    private modalWindowService: ModalWindowService,
    private el: ElementRef
  ) {
    this.element = el.nativeElement;
  }

  ngOnInit(): void {
    if (!this.id) {
      console.error('modal must have an id');
      return;
    }
    document.body.appendChild(this.element);

    // close modal on background click
    // this.element.addEventListener('click', (el) => {
    //   if (el.target.className === 'jw-modal') {
    //     this.close();
    //   }
    // });

    // add self (this modal instance) to the modal service so it's accessible from controllers
    this.modalWindowService.add(this);
  }

  ngOnDestroy(): void {
    this.modalWindowService.remove(this.id);
    this.element.remove();
  }

  open(): void {
    this.isActive = true;
    document.body.classList.add('jw-modal-open');
  }

  close(): void {
    this.isActive = false;
    document.body.classList.remove('jw-modal-open');
    // this.popupClose.emit();
  }
}
