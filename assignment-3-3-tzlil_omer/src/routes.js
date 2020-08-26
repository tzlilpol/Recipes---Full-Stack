import Main from "./pages/MainPage";
import NotFound from "./pages/NotFoundPage";

const routes = [
  {
    path: "/",
    name: "main",
    component: ()=> import("./pages/MainPage"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("./pages/RegisterPage"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("./pages/LoginPage"),
  },
  {
    path: "/about",
    name: "about",
    component: () => import("./pages/aboutPage"),
  },
  {
    path: "/createRecipe",
    name: "createRecipe",
    component:()=>import("./pages/createRecipePage")
  },
  {
    path: "/search",
    name: "search",
    component: () => import("./pages/SearchPage"),
  },
  {
    path: "/:route/recipe/:recipeId",
    name: "recipe",
    component: () => import("./pages/RecipeViewPage"),
  },
  {
    path: "/user/privateRecipes",
    name: "privateRecipe",
    component: () => import("./pages/MyRecipesPage"),
  },
  {
    path: "/user/familyRecipes",
    name: "familyRecipe",
    component: () => import("./pages/familyRecipesPage"),
  },
  {
    path: "/user/favoriteRecipes",
    name: "favoriteRecipes",
    component: () => import("./pages/favoriteRecipesPage"),
  },
  {
    path: "*",
    name: "notFound",
    component: NotFound,
  },
];

export default routes;
