<template>
    <div class="container">
        <b-row>
            <b-card-group>
                <RecipePreviewList initial_title="Your Favorite Recipes" v-if="userRecipes.length>0" :initial_recipes="userRecipes"/>
            </b-card-group>
        </b-row>
    </div>
</template>
<script>
    import RecipePreviewList from "../components/RecipePreviewList";
    export default {
        data() {
            return {
                userRecipes: []
            }
        },
        components: {
            RecipePreviewList
        },
        async created() {
            try {
                const response = await this.axios.get(
                    `${this.$store.server_domain}/user/myfavorite`,{withCredentials:true},
                );
                const recipes = response.data;
                console.log(recipes)
                this.userRecipes = [];
                this.userRecipes.push(...recipes);
                console.log(this.userRecipes)
            } catch (error) {
                console.log(error);
            }
        }
    };
</script>

<style lang="scss" scoped>
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
    h1{
        font-family: 'Grenze Gotisch', cursive;
        font-weight: bold;
        color: gold;
        -webkit-text-stroke: 1px black;
        text-align: center;
    }
</style>
