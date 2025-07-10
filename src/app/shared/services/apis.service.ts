import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApisService {
basesurl='http://78.142.47.247:3003'
  private change$ =  new BehaviorSubject<boolean>(false);
    poschanges$ = this.change$.asObservable();
  constructor() { }
 private http = inject(HttpClient);
 isLoading = new BehaviorSubject<boolean>(false);
   getApi(endpoint: string) {
    console.log('GET request URL -->', 'http://78.142.47.247:3001'+endpoint);
 return this.http.get(this.basesurl+endpoint);
  }
 postApi(endpoint:any,req_body:any){
   return this.http.post(this.basesurl+endpoint,req_body);
 }
  putApi(endpoint:any,req_body:any){
   return this.http.put(this.basesurl+endpoint,req_body);
 }

  deleteApi(endpoint:any){
   return this.http.delete(this.basesurl+endpoint);
 }
   show(): void {
    this.isLoading.next(true);

  }
    hide(): void {
 
    this.isLoading.next(false);
  }
  changesPos(data:any){
    this.change$.next(data)
  }

buildMenuTree(
  menus:any[],
  categories: any[],
  dishes: any[]
): any[] {

  console.log(menus,categories,dishes,'dev categories')
  return menus.map(menu => {

   
    const filteredCategories = categories.filter(c => c.dish_menu_id === menu.dish_menu_id);

    const categoryNodes = filteredCategories.map(category => {
      const filteredDishes = dishes.filter(d => d.dish_category_id === category.id);
      return {
        categoryId: category.id,
        categoryName: category.name,
             checked: false,
             
        expanded: false,
        dishes: filteredDishes.map(d => ({
          dishId: d.dish_id,
          dishName: d.dish_name,
          checked: false ,
          image_url:'assets/pizzaImg/menus/3.png'
        }))
      };
    });

    return {
      takeawayExpanded:false,
      menuId: menu.dish_menu_id,
      menuName: menu.name,
      categories: categoryNodes
    };
  });
}
}
