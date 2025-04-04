import { Component } from '@angular/core';

@Component({
    selector: 'app-mode',
    imports: [],
    templateUrl: './mode.component.html',
    styleUrl: './mode.component.scss'
})

export class ModeComponent {

  public isMode: boolean = false;

  changeMode() {
    this.isMode = !this.isMode;
    this.isMode ? document.body.classList.add('dark-only') : document.body.classList.remove("dark-only");  
    }

}
