<template>
    <div class="container">
        <b-row>
            <b-card-group>
                <RecipePreviewListMyRecipes  initial_title="Your Personal Recipes" v-if="userRecipes.length>0" :initial_recipes="userRecipes"/>
            </b-card-group>
        </b-row>
    </div>

</template>
<script>
import RecipePreviewListMyRecipes from "../components/RecipePreviewListMyRecipes";
export default {
        data() {
            return {
                userRecipes: []
            }
        },
        components: {
            RecipePreviewListMyRecipes,
        },
    async created() {
        try {
            const response = await this.axios.get(
                `${this.$store.server_domain}/user/private`,{withCredentials:true},
            );
            let recipes = response.data;
            this.userRecipes = [];
            this.userRecipes.push(...recipes)
            console.log('userRecipes')
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
</style>
