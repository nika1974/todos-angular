import { Component, OnInit, Output, EventEmitter, Inject, HostListener } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() darkModeSwitcherCallback = new EventEmitter();
  logoutErr: string;
  lang = localStorage.getItem('lang') || 'en';
  checked = localStorage.getItem('darkMode') === 'on';
  viewportWidth: number;

  constructor(
    public auth: AuthService,
    private router: Router,
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document
  ) {
    if (localStorage.getItem('lang') === 'ar') {
      this.translate.use('ar');
    } else {
      this.translate.use('en');
    }
    this.onResize();
  }

  ngOnInit(): void {
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.viewportWidth = window.innerWidth;
  }

  logout(headerRef) {
    this.logoutErr = undefined;
    this.auth.logout().then(res => {
      if (this.viewportWidth <= 768) {
        this.toggleBurger(headerRef);
      }
      this.router.navigate(['/sign-in']);
    }).catch(err => {
      this.logoutErr = err?.message;
    });
  }

  handleDarkModeSwitch() {
    this.checked = !this.checked;
    this.darkModeSwitcherCallback.emit();
  }

  switchLanguage() {
    this.translate.use(this.lang);
    localStorage.setItem('lang', this.lang);
  }

  toggleProfile(elem) {
    elem.classList.toggle('d-none');
  }

  getLangFromStorage() {
    return localStorage.getItem('lang');
  }

  toggleBurger(ref) {
    if (this.viewportWidth <= 768) {
      ref.classList.toggle('burger-active');
      this.document.body.classList.toggle('disableScroll');
    }
  }
}
