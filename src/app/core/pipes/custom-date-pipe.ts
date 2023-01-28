import { formatDate } from '@angular/common';
import { Pipe } from '@angular/core';

export interface PipeTransform {
  transform(value: any, ...args: any[]): any;
}

@Pipe({ name: 'customDate' })
export class CustomDatePipe implements PipeTransform {
  transform(date: Date, param: string = 'time'): string {
    var currentDate = new Date();
    date = new Date(date);
    if (
      date.getFullYear() === currentDate.getFullYear() &&
      date.getMonth() === currentDate.getMonth() &&
      date.getDate() === currentDate.getDate()
    ) {
      if(param === 'time') {
        var formattedDate = formatDate(date, 'H:mm', 'en-US');
      } else {
        var formattedDate = 'Today';
      }
    } else if (
      date.getFullYear() === currentDate.getFullYear() &&
      date.getMonth() === currentDate.getMonth() &&
      date.getDate() < currentDate.getDate() &&
      date.getDate() > currentDate.getDate() - 7
    ) {
      if(param === 'time') {
        var formattedDate = formatDate(date, 'EEE', 'en-US');
      } else {
        var formattedDate = formatDate(date, 'EEEE', 'en-US');
      }
    } else {
      //   var formattedDate = formatDate(date, 'mediumDate', 'en-US');
      var formattedDate = formatDate(date, 'shortDate', 'en-US');
    }
    return formattedDate;
  }
}
