import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, HostListener } from '@angular/core';

@Component({
    selector: 'app-tap-top',
    imports: [CommonModule],
    templateUrl: './tap-top.component.html',
    styleUrl: './tap-top.component.scss'
})

export class TapTopComponent {

  public show: boolean = false;

  constructor(private viewScroller: ViewportScroller) {}

  ngOnInit(): void {}

  @HostListener("window:scroll", [])
  onWindowScroll() {
    let number =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    if (number > 500) {
      this.show = true;
    } else {
      this.show = false;
    }
  }

  tapToTop() {
    this.viewScroller.scrollToPosition([0, 0]);
  }

}
