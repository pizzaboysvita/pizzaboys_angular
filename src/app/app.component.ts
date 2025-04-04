import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from "./shared/components/loader/loader.component";
import { TapTopComponent } from "./shared/components/tap-top/tap-top.component";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, LoaderComponent, TapTopComponent]
})

export class AppComponent {
  
    
}
