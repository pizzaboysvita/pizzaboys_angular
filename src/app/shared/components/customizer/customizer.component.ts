import { Component } from '@angular/core';

@Component({
    selector: 'app-customizer',
    imports: [],
    templateUrl: './customizer.component.html',
    styleUrl: './customizer.component.scss'
})

export class CustomizerComponent {

  public layoutType: string = "rtl";

  customizeLayoutType(value: string) {
    this.layoutType = value;
    if (value == "rtl") {
      document.getElementsByTagName("html")[0].setAttribute("dir", value);
      document.body.className = "rtl";
      this.layoutType = 'ltr';
    } else {
      document.getElementsByTagName("html")[0].removeAttribute("dir");
      document.body.className = "";
      this.layoutType = 'rtl';
    }
  }

}
