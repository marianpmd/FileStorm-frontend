import {Component, HostBinding} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl} from "@angular/forms";
import {OverlayContainer} from "@angular/cdk/overlay";
import {CookieService} from "ngx-cookie-service";
import {SidenavService} from "../service/sidenav.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @HostBinding('class') className = '';

  toggleControl = new FormControl(false);

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private overlay: OverlayContainer,
              private sidenavService : SidenavService) {
  }

  ngOnInit(): void {
    if (localStorage.getItem("darkMode") === null) {
      localStorage.setItem('darkMode', "off");
    }

    if (localStorage.getItem("darkMode") === "on") {
      this.toggleControl.setValue(!this.toggleControl.value);
      this.className = 'darkMode';
      this.overlay.getContainerElement().classList.add(this.className);
    } else if (localStorage.getItem("darkMode") === "off") {
      this.className = '';
      this.overlay.getContainerElement().classList.remove('darkMode');
    }
    this.toggleControl.valueChanges.subscribe((darkMode) => {
      const darkClassName = 'darkMode';

      this.className = darkMode ? darkClassName : '';
      if (darkMode) {
        localStorage.setItem("darkMode", "on");
        this.overlay.getContainerElement().classList.add(darkClassName);
      } else {
        localStorage.setItem("darkMode", "off");
        this.overlay.getContainerElement().classList.remove(darkClassName);
      }
    });
  }

  toggleSidenav() {
    this.sidenavService.toggle();
  }
}
