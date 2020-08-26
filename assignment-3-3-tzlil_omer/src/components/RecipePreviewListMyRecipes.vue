<template>
    <b-container>
        <h1>
            {{ title }}
        </h1>
        <b-card-group >
            <b-row   v-for="(group, i) in recipeGroups" :key="group"  >
                <b-col v-for="(r, indx) in recipes.slice(i * itemsPerRow, (i + 1) * itemsPerRow)" :key="indx" :index="indx" >
                    <div>
                        <RecipePreviewMyRecipes class="recipePreview" :initial_recipe="r"/>
                    </div>
                </b-col>
            </b-row>
        </b-card-group>
    </b-container>
</template>

<script>
    import RecipePreviewMyRecipes from "./RecipePreviewMyRecipes"
    export default {
        name: "RecipePreviewListMyRecipes",
        components: {
            RecipePreviewMyRecipes
        },
        data() {
            return {
                recipes :this.initial_recipes,
                title:this.initial_title,
                itemsPerRow:4
            }
        },
        props:{
            initial_title: String,
            initial_recipes:Array
        } ,
        computed:{
            recipeGroups () {
                return Array.from(Array(Math.ceil(this.recipes.length / this.itemsPerRow)).keys())
            }
        },

    };
</script>

<style lang="scss" scoped>
    h1{
        font-family: 'Grenze Gotisch', cursive;
        font-weight: bold;
        color: gold;
        -webkit-text-stroke: 1px black;
    }
    .card-deck .card {
        max-width: calc(25% - 30px);
    }


</style>
