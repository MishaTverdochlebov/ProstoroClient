import { formatDate } from '@angular/common';
import { Pipe } from '@angular/core';
import { libraryEN } from 'src/app/test-data/library-en';
import { libraryUA } from 'src/app/test-data/library-ua';

export interface PipeTransform {
  transform(value: any, ...args: any[]): any;
}

@Pipe({ name: 'translate' })
export class TranslatePipe implements PipeTransform {
  currentLang: string;
  libraryUa = libraryUA;
  libraryEn = libraryEN;
  constructor() {
    this.currentLang = localStorage.getItem('lang') || 'ua';
  }
  transform(code: string): string {
    if (this.currentLang == 'ua') {
      return this.libraryUa[code];
    } else {
      return this.libraryEn[code];
    }
  }
}
