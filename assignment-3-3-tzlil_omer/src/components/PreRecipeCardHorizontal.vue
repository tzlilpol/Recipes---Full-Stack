<template>

    <b-card no-body class="overflow-hidden"   style="max-width: 540px;"  >
        <b-row no-gutters>
            <b-col md="6">
                <router-link v-if="recipe" :to="{ name: 'recipe', params: {route:this.$router.currentRoute.name, recipeId: this.recipe.id } }"
                             v-b-tooltip.hover="{ variant: 'info' }" title="Press here to watch full recipe">
                    <b-card-img v-bind:src="recipe.image" alt="Image" class="rounded-0"></b-card-img>
                </router-link>
                <small v-if="WatchedSaved!=null" v-show="$root.$store.user" class="text-muted">
                    <span
                    >
                        <b-icon icon="eye-slash" v-show="!initial_WatchedSaved.watched" font-scale="1.5"></b-icon><b-icon icon="eye-fill" v-show="initial_WatchedSaved.watched" font-scale="1.5" variant="primary"></b-icon> watched
                    </span>
                    <br>
                    <span @click="updateSaved" v-b-tooltip.hover="{ variant: 'info' }" title="Click on star to add/remove to/from favorites"
                    >
                        <b-icon icon="star"  v-show="!initial_WatchedSaved.saved" font-scale="1.5"></b-icon><b-icon icon="star-fill" v-show="initial_WatchedSaved.saved" font-scale="1.5" variant="primary"></b-icon> save
                    </span>
                </small>
            </b-col>
            <b-col md="6" v-b-tooltip.hover :title=recipe.title>
                <b-card-body :title="getTitle" >
                    <b-card-text><b-icon icon="clock"></b-icon>
                        {{ recipe.duration }} minutes
                        <br><b-icon icon="hand-thumbs-up"></b-icon>
                        {{ recipe.likes }} likes
                        <br>
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
                </b-card-body>
            </b-col>
        </b-row>
    </b-card>

</template>

<script>
    export default {
        name: "PreRecipeCard",
        data() {
            return {
                recipe:this.initial_recipe,
                WatchedSaved:this.initial_WatchedSaved


            };
        },
        props: {
            initial_recipe: {
                type: Object,
                required: true
            },
            initial_WatchedSaved: {
                type:Object,
                required: false,
                default:()=>{return {watched:false,saved:false}}
            }

        },
        methods:{
            updateSaved: async function () {
                try {
                    if(this.initial_WatchedSaved.saved)
                        this.initial_WatchedSaved.saved=false;
                    else  this.initial_WatchedSaved.saved=true;
                    const response = await this.axios.get(
                        `${this.$store.server_domain}/user/updateRecipeInfo/id/${this.recipe.id}/saved/${this.initial_WatchedSaved.saved}/`,
                        {withCredentials:true}
                    );
                } catch (error) {
                    console.log(error);
                }
            },
        },
        computed:{
            getTitle(){
                if(this.recipe.title.length>25)
                    return this.recipe.title.slice(0,25)+' . . .';
                else return this.recipe.title
            }
        }
    }
</script>

<style scoped>
    .overflow-hidden{
        font-family: 'Kaushan Script', cursive;
        color: #28140b;
    }
</style>