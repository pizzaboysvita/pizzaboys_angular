import { Component } from '@angular/core';
import { ApisService } from '../../services/apis.service';

@Component({
    selector: 'app-loader',
    imports: [],
    templateUrl: './loader.component.html',
    styleUrl: './loader.component.scss'
})

export class LoaderComponent {

  public show: boolean = true;
  
  constructor(private apis:ApisService) {
  this.apis.isLoading.subscribe(data=>{
  console.log(data,'test')
  this.show=data
})
  }

}
