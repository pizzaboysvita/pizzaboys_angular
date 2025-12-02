import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ApisService {

  basesurl = "http://78.142.47.247:3003";
  
  // basesurl = 'http://localhost:3003'
  private change$ = new BehaviorSubject<boolean>(false);
  poschanges$ = this.change$.asObservable();
  constructor() {}
  private http = inject(HttpClient);
  isLoading = new BehaviorSubject<boolean>(false);
  getApi(endpoint: string) {
    console.log("GET request URL -->", environment.apiUrl + endpoint);
    return this.http.get(environment.apiUrl + endpoint);
  }
  postApi(endpoint: any, req_body: any) {
    return this.http.post(environment.apiUrl + endpoint, req_body);
  }
  putApi(endpoint: any, req_body: any) {
    return this.http.put(environment.apiUrl + endpoint, req_body);
  }

  deleteApi(endpoint: any) {
    return this.http.delete(environment.apiUrl + endpoint);
  }
  patchStatusApi(reqbody: any) {
    console.log(reqbody, "patchStatusApi");

    return this.http.put(environment.apiUrl + "/api/updatedetails", reqbody);
  }

  show(): void {
    this.isLoading.next(true);
  }
  hide(): void {
    this.isLoading.next(false);
  }
  changesPos(data: any) {
    this.change$.next(data);
  }

  buildMenuTree(menus: any[], categories: any[], dishes: any[]): any[] {
    console.log(menus, categories, dishes, "dev categories");
    return menus.map((menu) => {
      console.log(categories, "categories dev categories");
      const filteredCategories = categories.filter(
        (c) => c.dish_menu_id === menu.dish_menu_id
      );

      const categoryNodes = filteredCategories.map((category) => {
        console.log(category, "category");
        const filteredDishes = dishes.filter(
          (d) => d.dish_category_id === category.id
        );
        return {
          categoryId: category.id,
          categoryName: category.name,
          checked: false,

          expanded: false,
          dishes: filteredDishes.map((d) => ({
            dishId: d.dish_id,
            dishName: d.dish_name,
            checked: false,
            image_url: "assets/pizzaImg/menus/3.png",
          })),
        };
      });

      return {
        takeawayExpanded: false,
        menuId: menu.dish_menu_id,
        menuName: menu.name,
        categories: categoryNodes,
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
  // Converts a single dish object to the same structure as in posMenuTree, without category context
  convertDishObject(dish: any) {
    // Initialize option set array
    dish.dish_ingredient_array = JSON.parse(dish.dish_ingredients_json);

    dish.dish_ingredient_array.forEach((element: any) => {
      element.selected = true;
      // element.quantity = 0;
    });
    let dish_option_set_array = [];
    try {
      // Parse dish_option_set_json if present
      dish_option_set_array = JSON.parse(dish.dish_option_set_json ?? "[]");
      // Parse inner option_set_combo_json
      dish_option_set_array = dish_option_set_array.map((optSet: any) => {
        console.log(optSet, "optSet");
        let option_set_array = [];
        try {
          option_set_array = JSON.parse(optSet.option_set_combo_json ?? "[]");
          option_set_array.forEach((element: any) => {
            element.selected = false;
            element.quantity = 0;
          });
        } catch (e) {
          console.error(
            "Invalid option_set_combo_json:",
            optSet.option_set_combo_json,
            e
          );
        }
console.log(optSet, "optSet.option_type");
        const type = optSet.option_type === "Checkbox" ?"Counter": optSet.option_type;
        return {
          ...optSet,
          option_set_array,
          type,
        };
      });
    } catch (e) {
      console.error(
        "Invalid dish_option_set_json:",
        dish.dish_option_set_json,
        e
      );
    }
    return {
      ...dish,
      dish_option_set_array,
    };
  }
  posMenuTree(categories: any[], dishes: any[]) {
    return categories.map((category) => {
      // Filter dishes by category ID
      const filteredDishes = dishes
        .filter((d) => d.dish_category_id === category.id)
        .map((dish) => {
          // Initialize option set array
          dish.dish_ingredient_array = JSON.parse(dish.dish_ingredients_json);
          let dish_option_set_array = [];

          try {
            // Parse dish_option_set_json if present
            dish_option_set_array = JSON.parse(
              dish.dish_option_set_json ?? "[]"
            );
            //  dish_option_set_array.forEach((element:any)=>{
            //                 element.quantity=1
            //               })
            // Parse inner option_set_combo_json
            dish_option_set_array = dish_option_set_array.map((optSet: any) => {
              let option_set_array = [];
              try {
                option_set_array = JSON.parse(
                  optSet.option_set_combo_json ?? "[]"
                );
                option_set_array.forEach((element: any) => {
                  element.selected = false;
                  element.quantity = 0;
                });
              } catch (e) {
                console.error(
                  "Invalid option_set_combo_json:",
                  optSet.option_set_combo_json,
                  e
                );
              }
              return {
                ...optSet,
                option_set_array,
              };
            });
          } catch (e) {
            console.error(
              "Invalid dish_option_set_json:",
              dish.dish_option_set_json,
              e
            );
          }

          return {
            ...dish,
            dish_option_set_array,
          };
        });

      return {
        ...category,
        dishes: filteredDishes,
      };
    });
  }
  // getItemSubtotal(item: any): number {
  //   // Sum (price * quantity) for each selected option
  //   // console.log(item, "optionsTotal");
  //   const optionsTotal = item?.dish_option_set_array
  //     .flatMap((optSet: any) => optSet?.option_set_array)
  //     .filter((option: any) => option?.selected)
  //     .reduce((sum: number, option: any) => {
  //       const price = Number(option?.price) || 0;
  //       const qty = Number(option?.quantity) || 0;
  //       return sum + price * qty;
  //     }, 0);
  //   // console.log(optionsTotal, "optionsTotal");
  //   const subtotal =
  //     (Number(item.dish_price) + optionsTotal) * Number(item.dish_quantity);

  //   // ✅ store subtotal inside item itself
  //   item.item_total_price = subtotal;
  //   // console.log(subtotal);
    
  //   return subtotal;
  // }

  getItemSubtotal(item: any): number {

  // 👇 CASE 1: Combo item (simple calculation)
  if (item.dish_type === "combo") {
    return (item.dish_price || 0) * (item.dish_quantity || 1);
  }

  // 👇 CASE 2: STANDARD dishes
  let basePrice = item.dish_price || item.duplicate_dish_price || 0;
  let quantity = item.dish_quantity || 1;

  // ---- Safe arrays (NO more undefined.flatMap errors) ---- //
  const optionSets = item.standed_option_selected_array || [];
  const comboOptions = item.combo_selected_dishes || [];
  const ingredients = item.dish_ingredient_array || [];
  const toppings = item.selectedOptions || [];

  let extraPrice = 0;

  // Option sets
  extraPrice += optionSets
    .flatMap((set: any) => set.choose_option || [])
    .reduce((sum: number, opt: any) => sum + (opt.price || 0), 0);

  // Combo options
  extraPrice += comboOptions
    .flatMap((c: any) => c.combo_option_selected_array || [])
    .flatMap((opt: any) => opt.choose_option || [])
    .reduce((sum: number, opt: any) => sum + (opt.price || 0), 0);

  // Ingredients
  extraPrice += ingredients.reduce(
    (sum: number, ing: any) => sum + (ing.price || 0),
    0
  );

  // Toppings
  extraPrice += toppings
    .filter((t: any) => t.selected)
    .reduce((sum: number, t: any) => sum + (t.price || 0), 0);

  // FINAL
  return (basePrice + extraPrice) * quantity;
}


  combotItemSubtotal(fullcomboDetails: any): number {
    let grandTotal: number = 0;
    console.log(fullcomboDetails, "fullcomboDetails");
    if (
      fullcomboDetails &&
      typeof fullcomboDetails.comboDishList === "object"
    ) {
      grandTotal = Object.values(fullcomboDetails.comboDishList)
        .flatMap((dish: any) => dish.dish_option_set_array)
        .flatMap((optSet: any) => optSet.option_set_array)
        .filter((option: any) => option.selected === true)
        .reduce((sum: number, option: any) => {
          const price = Number(option.price) || 0;
          const qty = Number(option.quantity) || 0;
          return sum + price * qty;
        }, 0);
    }
    console.log(grandTotal, "grandTotal");
    return (
      (Number(fullcomboDetails.dish_price) + grandTotal) *
      Number(fullcomboDetails.dish_quantity)
    );
  }
  orderItemSubtotal(item: any) {
    console.log(item, "orderItemSubtotal");
    const optionsTotal = item.selectedOptions
      .filter((option: any) => option.selected === true)
      .reduce((sum: number, option: any) => {
        const price = Number(option.price) || 0;
        const qty = Number(option.quantity) || 0;
        return sum + price * qty;
      }, 0);
    return (
      (Number(item.dish_price) + optionsTotal) * Number(item.dish_quantity)
    );
  }

  combotItemConvert(fullcomboDetails: any): any {
    console.log(fullcomboDetails, "fullcomboDetails step 1");
    console.log(
      this.transformData(fullcomboDetails),
      "fullcomboDetails step 2"
    );
    //   let grandTotal: any;
    //   console.log(fullcomboDetails, 'fullcomboDetails')
    //   if (fullcomboDetails && typeof fullcomboDetails.comboDishList === 'object') {
    //  grandTotal = Object.values(fullcomboDetails.comboDishList)
    //   .flatMap((dish: any) => dish.dish_option_set_array)
    //   // .flatMap((optSet: any) => optSet.option_set_array)
    //   // .filter((option: any) => option.selected === true)
    //   // .reduce((sum: number, option: any) => {
    //   //   const price = Number(option.price) || 0;
    //   //   const qty = Number(option.quantity) || 0;
    //   //   return sum + (price * qty);
    //   // }, 0);
    // }
    // console.log(grandTotal, 'grandTotal')
    // return (Number(fullcomboDetails.dish_price) + grandTotal) * Number(fullcomboDetails.dish_quantity);
  }
  transformData(data: any) {
    console.log(data);
    return data.map((element: any) => {
      if (element.dish_type === "combo") {
        const selectedDishes = Object.values(element.comboDishList || {}).map(
          (dish: any) => {
            return {
              combo_option_name: dish.combo_option_name,
              combo_option_dish_name: dish.dish_name,
              combo_option_selected_array: dish.dish_option_set_array
                .map((optionSet: any) => {
                  const chosen = optionSet.option_set_array
                    .filter((opt: any) => opt.selected)
                    .map((opt: any) => ({
                      name: opt.name,
                      price: opt.price,
                      quantity: opt.quantity,
                    }));

                  return {
                    dish_opt_type: optionSet.dispaly_name, // <-- fixed spelling
                    choose_option: chosen,
                  };
                })
                .filter((item: any) => item.choose_option.length > 0),
            };
          }
        );

        return {
          ...element,
          dish_name: element.dish_name,
          dish_id: element.dish_id,
          // dish_quantity: element.dish_quantity,
          dish_type: element.dish_type,
          combo_selected_dishes: selectedDishes,
        };
      } else {
        
        const dish_ingredient_array = element.dish_ingredient_array
          .filter((ingredient: any) => ingredient.selected === false) // only false
          .map((ingredient: any) => ({
           // category label
          
              name: ingredient.name,
            
          }));
         const dish_ingredient_array_obj = {
            dish_opt_type: "Ingredients",
            choose_option: dish_ingredient_array
          }
        const standed_option_selected_array = element.dish_option_set_array
            .map((optionSet: any) => {
              const chosen = optionSet.option_set_array
                .filter((opt: any) => opt.selected)
                .map((opt: any) => ({
                  name: opt.name,
                  price: opt.price,
                  quantity: opt.quantity,
                }));

              return {
              
                dish_opt_type: optionSet.dispaly_name, // <-- fixed spelling
                choose_option: chosen,
              };
            })
            .filter((item: any) => item.choose_option.length > 0);
const mergedArray = [
  ...standed_option_selected_array, // Options
   dish_ingredient_array_obj,
];
        // console.log(dish_ingredient_array_obj, 'element.dish_ingredient_array')
        return {
          ...element,
          dish_name: element.dish_name,
          dish_id: element.dish_id,
          // dish_quantity: element.dish_quantity,
          dish_type: element.dish_type,
          // combo_selected_dishes: chosen

          standed_option_selected_array: mergedArray
          
        };
      }
    });
  }
}
