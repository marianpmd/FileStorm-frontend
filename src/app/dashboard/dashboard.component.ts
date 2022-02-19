import {Component, HostListener, OnInit} from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  wasTriggered : boolean = false;

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (!this.wasTriggered) {
      // 200 is the height from bottom from where you want to trigger the infintie scroll, can we zero to detect bottom of window
      if ((document.body.clientHeight + window.scrollY + 200) >= document.body.scrollHeight) {
        console.log('tiggred');
        this.wasTriggered = true;
      }
    }
  }

  constructor() { }

  ngOnInit(): void {
  }

}
