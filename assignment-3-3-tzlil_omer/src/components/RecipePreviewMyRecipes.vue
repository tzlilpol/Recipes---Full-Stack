<template>
    <div v-b-tooltip.hover :title=recipe.title>
        <b-card :title=getTitle  style="width: 15rem; height: 25rem;"  class="mb-2" >
            <router-link v-if="recipe"
                         :to="{ name: 'recipe', params: {route:this.$router.currentRoute.name, recipeId: recipe.id } }"
                         v-b-tooltip.hover="{ variant: 'info' }" title="Press here to watch full recipe"
            >
                <b-card-img-lazy :src="recipe.image"  fluid img-alt="Image"></b-card-img-lazy>
            </router-link>
            <b-card-text >  <b-icon icon="clock"></b-icon>
                {{ recipe.duration }} minutes
                <b-form-checkbox disabled
                                 v-model="recipe.glutenFree" name="checkbox-1" value="true"
                >
                    gluten free
                </b-form-checkbox>
                <b-form-checkbox disabled
                                 v-model=" recipe.vegan" name="checkbox-1" value="true"
                >
                    vegan
                </b-form-checkbox>
                <b-form-checkbox disabled
                                 v-model=" recipe.vegetarian" name="checkbox-1" value="true"
                >
                    vegetarian
                </b-form-checkbox>

            </b-card-text>
        </b-card>
    </div>
</template>

<script>
    export default {
        name: "RecipePreviewMyRecipes",
        data() {
            return {
                recipe:this.initial_recipe,
            };
        },
        props: {
            initial_recipe: {
                type: Object,
                required: true
            },
        }
        ,
        computed:{
            getTitle(){
                if(this.recipe.title.length>50)
                    return this.recipe.title.slice(0,50)+' . . .';
                else return this.recipe.title
            }
        }
    }
</script>

<style scoped>
    .mb-2{
        font-family: 'Kaushan Script', cursive;
        color: #28140b;
        /*        overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;*/
    }

    </style>