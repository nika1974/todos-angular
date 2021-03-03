import { Component, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  darkMode = false;
  primaryColor = '--primary: #e7f7ff';

  constructor(
    private translate: TranslateService,
    private renderer: Renderer2,
  ) {
    translate.setDefaultLang('en');
    if (!localStorage.getItem('darkMode')) {
      localStorage.setItem('darkMode', 'off');
    }
    if (localStorage.getItem('darkMode') === 'on') {
      this.renderer.addClass(document.body, 'darkMode');
    }
  }

  switchDarkMode() {
    if (localStorage.getItem('darkMode') === 'on') {
      localStorage.setItem('darkMode', 'off');
      this.renderer.removeClass(document.body, 'darkMode');
    } else {
      localStorage.setItem('darkMode', 'on');
      this.renderer.addClass(document.body, 'darkMode');
    }
  }

  /*
    TODO: arabic language aligh on right
  */
}
