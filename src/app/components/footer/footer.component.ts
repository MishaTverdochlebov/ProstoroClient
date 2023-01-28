import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  currentLang: string;
  constructor() {}

  ngOnInit(): void {
    this.currentLang = localStorage.getItem('lang') || 'ua'
  }

  changeLang(lang: string): void {
    if(this.currentLang == lang) {
      return;
    }
    this.currentLang = lang;
    localStorage.setItem('lang', lang);
    window.location.reload();
  }
}
