import { Component } from '@angular/core';
import { CookieUtils } from './utils/cookieUtils';

@Component({
  // moduleId: module.id,
  selector: 'my-app',
  templateUrl: './app.component.html',
  // styleUrls: ['../styles/platform.css'],
  providers: [CookieUtils]
})
export class AppComponent  {

}
