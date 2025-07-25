import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApisService {
  basesurl='http://78.142.47.247:3003'
  // basesurl = 'http://localhost:3003'
  private change$ = new BehaviorSubject<boolean>(false);
  poschanges$ = this.change$.asObservable();
  constructor() { }
  private http = inject(HttpClient);
  isLoading = new BehaviorSubject<boolean>(false);
  getApi(endpoint: string) {
    console.log('GET request URL -->', 'http://78.142.47.247:3001' + endpoint);
    return this.http.get(this.basesurl + endpoint);
  }
  postApi(endpoint: any, req_body: any) {
    return this.http.post(this.basesurl + endpoint, req_body);
  }
  putApi(endpoint: any, req_body: any) {
    return this.http.put(this.basesurl + endpoint, req_body);
  }

  deleteApi(endpoint: any) {
    return this.http.delete(this.basesurl + endpoint);
  }
  show(): void {
    this.isLoading.next(true);

  }
  hide(): void {

    this.isLoading.next(false);
  }
  changesPos(data: any) {
    this.change$.next(data)
  }

  buildMenuTree(
    menus: any[],
    categories: any[],
    dishes: any[]
  ): any[] {

    console.log(menus, categories, dishes, 'dev categories')
    return menus.map(menu => {

      console.log(categories, 'categories dev categories')
      const filteredCategories = categories.filter(c => c.dish_menu_id === menu.dish_menu_id);

      const categoryNodes = filteredCategories.map(category => {
        console.log(category, 'category')
        const filteredDishes = dishes.filter(d => d.dish_category_id === category.id);
        return {
          categoryId: category.id,
          categoryName: category.name,
          checked: false,

          expanded: false,
          dishes: filteredDishes.map(d => ({
            dishId: d.dish_id,
            dishName: d.dish_name,
            checked: false,
            image_url: 'assets/pizzaImg/menus/3.png'
          }))
        };
      });

      return {
        takeawayExpanded: false,
        menuId: menu.dish_menu_id,
        menuName: menu.name,
        categories: categoryNodes
      };
    });
  }

//   posMenuTree(categories: any[],
//     dishes: any[]) {
     
//    return categories.map(category => {
//   const filteredDishes = dishes.filter(d => d.dish_category_id === category.id);
//   filteredDishes.forEach(dishes =>{
//     dishes.dish_option_set_array=JSON.parse(dishes.dish_option_set_json)
//     if(dishes.dish_option_set_array.length >0){
//       console.log(dishes.dish_option_set_array,'opt set')
//       dishes.dish_option_set_array.forEach((opt_set:any)=>{
//         console.log(opt_set,'opt set 2')
//         opt_set.option_set_array=JSON.parse(opt_set.option_set_combo_json)
//       })
//     }
//   })
//   console.log(filteredDishes,'filteredDishes')
  
//   return {
//     ...category, // Spread category fields (e.g., id, name, image, etc.)
//     dishes: filteredDishes.map(d => ({
//       ...d, // Spread dish fields
    
//     }))
//   };
// });
//   }
posMenuTree(categories: any[], dishes: any[]) {
  return categories.map(category => {
    // Filter dishes by category ID
    const filteredDishes = dishes
      .filter(d => d.dish_category_id === category.id)
      .map(dish => {
        // Initialize option set array
        let dish_option_set_array = [];

        try {
          // Parse dish_option_set_json if present
          dish_option_set_array = JSON.parse(dish.dish_option_set_json ?? '[]');

          // Parse inner option_set_combo_json
          dish_option_set_array = dish_option_set_array.map((optSet: any) => {
            let option_set_array = [];
            try {
              option_set_array = JSON.parse(optSet.option_set_combo_json ?? '[]');
            } catch (e) {
              console.error('Invalid option_set_combo_json:', optSet.option_set_combo_json, e);
            }
            return {
              ...optSet,
              option_set_array
            };
          });
        } catch (e) {
          console.error('Invalid dish_option_set_json:', dish.dish_option_set_json, e);
        }

        return {
          ...dish,
          dish_option_set_array
        };
      });

    return {
      ...category,
      dishes: filteredDishes
    };
  });
}

}
