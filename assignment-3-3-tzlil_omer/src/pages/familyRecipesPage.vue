<template>
    <div class="container">
        <h1 class="title">Family Recipes</h1>

        <b-row v-for="r in recipes" :key="r.recipeID">
            <b-card-group>
            <FamilyRecipe class="recipePreview" :recipe="r" />
            </b-card-group>
        </b-row>

    </div>
</template>
<script>
    import RecipePreviewList from "../components/RecipePreviewList";
    import FamilyRecipe from "../components/FamilyRecipe";
    export default {
        components: {
            FamilyRecipe
        },
        data(){
            return{
                recipes:[]
            }
        },
        methods: {},
        async created() {
            this.recipe=[];
                try {
                    let response;
                    let recipesAns = [];
                    try {
                        const response = await this.axios.get(
                            `${this.$store.server_domain}/user/family`, {withCredentials: true}
                        );
                        recipesAns = response.data;
                        // console.log("response.status", response.status);
                        if (response.status !== 200)
                            this.$router.replace("/NotFound");
                    } catch (error) {
                        console.log("error.response.status", error.response.status);
                        this.$router.replace("/NotFound");
                        return;
                    }
                    for (let recipe of recipesAns) {
                        let {
                            recipeID,
                            recipeOwner,
                            Instructions,
                            ingredients,
                            image,
                            name
                        } = recipe;

                        let _recipe = {
                            recipeID,
                            recipeOwner,
                            Instructions,
                            ingredients,
                            image,
                            name
                        };

                        this.recipes.push(_recipe);

                    }
                    this.$root.$store.familyRecipes=[];
                    this.$root.$store.familyRecipes=this.recipes;
                } catch (error) {
                    console.log(error);
                }

        }
    };
</script>

<style lang="scss" scoped>
    h1{
        font-family: 'Grenze Gotisch', cursive;
        font-weight: bold;
        color: gold;
        -webkit-text-stroke: 1px black;
        text-align: center;
    }
    .RandomRecipes {
        margin: 10px 0 10px;
    }
    .blur {
        -webkit-filter: blur(5px); /* Safari 6.0 - 9.0 */
        filter: blur(2px);
    }
    ::v-deep .blur .recipe-preview {
        pointer-events: none;
        cursor: default;
    }
</style>


