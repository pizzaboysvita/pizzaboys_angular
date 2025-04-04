import { Route, Routes } from "@angular/router";
import { TranslationComponent } from "./translation/translation.component";
import { CurrencyRateComponent } from "./currency-rate/currency-rate.component";

export default [
    {
        path: 'translation',
        component: TranslationComponent
    },
    {
        path: 'currency-rates',
        component: CurrencyRateComponent
    },
] as Routes