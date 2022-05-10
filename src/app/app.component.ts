import {Component, HostBinding} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl} from "@angular/forms";
import {OverlayContainer} from "@angular/cdk/overlay";
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
              private sidenavService: SidenavService,
  ) {
  }

  ngOnInit(): void {
  }

  toggleSidenav() {
    this.sidenavService.toggle();
  }

  isLocalPath() : boolean {
    return this.router.url === "/login";
  }
}
