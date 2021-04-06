import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

@Injectable()
export class RecipeService {
    recipesChanged = new Subject<Recipe[]>();

    private recipes: Recipe[] = [
        new Recipe('Street Shingara',
            'Oil fried shingara, popular in asian countries',
            'https://www.indianhealthyrecipes.com/wp-content/uploads/2019/11/samosa-recipe-480x270.jpg',
            [
                new Ingredient('Meat', 1),
                new Ingredient('French fries', 20)
            ]),
        new Recipe(
            'Street Shomocha',
            'Fried in oil and used potato and vegitables',
            'https://www.topsrilankanrecipe.com/wp-content/uploads/2019/04/21a.jpg',
            [
                new Ingredient('Ata', 1),
                new Ingredient('Potato', 50)
            ])
    ];

    constructor(private slService: ShoppingListService) {}

    getRecipes() {
        return this.recipes.slice();
    }

    getRecipe(index: number) {
        return this.recipes[index];
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.slService.addIngredients(ingredients);
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, newRecipe: Recipe) {
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
    }
}