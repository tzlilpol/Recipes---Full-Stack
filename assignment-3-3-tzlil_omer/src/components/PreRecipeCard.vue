<template>

        <b-card no-body class="overflow-hidden"   style="max-width: 540px;"  >
            <b-row no-gutters>
                <b-col md="6">
                    <router-link v-if="recipe" :to="{ name: 'recipe', params: { recipeId: this.recipe.id } }"
                                 v-b-tooltip.hover="{ variant: 'info' }" title="Press here to watch full recipe">
                    <b-card-img v-bind:src="recipe.image" alt="Image" class="rounded-0"></b-card-img>
                    </router-link>
                    <small v-if="WatchedSaved!=null" v-show="$root.$store.user" class="text-muted">
                        <b-form-checkbox disabled
                                v-model="initial_WatchedSaved.watched" name="checkbox-1" value="true"
                        >
                            <b-icon icon="eye" v-show="!initial_WatchedSaved.watched" font-scale="1.2"></b-icon><b-icon icon="eye-fill" v-show="initial_WatchedSaved.watched"></b-icon> watched
                        </b-form-checkbox>
                        <b-form-checkbox v-on:input="updateSaved"
                                v-model="initial_WatchedSaved.saved" name="checkbox-1" value="true"
                        >
                            <b-icon icon="star" v-show="!initial_WatchedSaved.saved" font-scale="1.2"></b-icon><b-icon icon="star-fill" v-show="initial_WatchedSaved.saved"></b-icon> saved
                        </b-form-checkbox>
                    </small>
                </b-col>
                <b-col md="6" v-b-tooltip.hover :title=recipe.title>
                    <b-card-body :title="getTitle" >
                        <b-card-text> <b-icon icon="clock"></b-icon>
                            {{ recipe.duration }} minutes
                            <br>
                            {{ recipe.likes }} likes
                            <br> <b-icon icon="hand-thumbs-up"></b-icon>
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
            mounted() {
                this.axios.get(this.recipe.image,{}).then((i) => {
                    this.image_load = true;
                }).catch(function (e){console.log(e)});
            },
            data() {
                return {
                    image_load: false,
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
    }
</script>

<style scoped>
.overflow-hidden{
    font-family: 'Kaushan Script', cursive;
    color: #28140b;
}
</style>