<template>
    <div v-b-tooltip.hover :title=recipe.title>
            <b-card :title=getTitle  style="width: 15rem; height: 30rem;"  class="mb-2" >
                <router-link v-if="recipe"
                             :to="{ name: 'recipe', params: { route:this.$router.currentRoute.name,recipeId: recipe.id } }"
                             v-b-tooltip.hover="{ variant: 'info' }" title="Press here to watch full recipe"
                >
                <b-card-img-lazy :src="recipe.image"  fluid img-alt="Image"></b-card-img-lazy>
                </router-link>
                <b-card-text >  <b-icon icon="clock"></b-icon>
                    {{ recipe.duration }} minutes
                    <br>  <b-icon icon="hand-thumbs-up"></b-icon>
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
                <template  v-slot:footer>
                    <small v-show="$root.$store.user" v-if="WatchedSaved!=null" class="text-muted">
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
                </template>
            </b-card>
    </div>
</template>

<script>
    export default {
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
        methods: {
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
                if(this.recipe.title.length>50)
                return this.recipe.title.slice(0,50)+' . . .';
                else return this.recipe.title
            }
        }
    };
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