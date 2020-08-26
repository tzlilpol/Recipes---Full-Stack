<template>

    <b-container fluid="md">

        <h1>
            {{ title }}:
            <slot></slot>
        </h1>
        <hooper :shortDrag="true" :infiniteScroll="true" :vertical="true" :itemsToShow="2.2" style="height: 550px ; width: 500px"  :centerMode="true"  >
            <slide v-for="(r, indx) in recipes" :key="indx" :index="indx"  >
                    <PreRecipeCardHorizontal class="recipePreview" :initial_recipe="r" :initial_-watched-saved="WatchedSaved[r.id]" />
            </slide>
            <hooper-navigation slot="hooper-addons"></hooper-navigation>
        </hooper>
    </b-container>
</template>

<script>
    import { Hooper, Slide,Navigation as HooperNavigation } from 'hooper';
    import 'hooper/dist/hooper.css';
    import PreRecipeCardHorizontal from "./PreRecipeCardHorizontal";
    export default {
        name: "RecipePreListCarousel",
        data() {
            return {
                WatchedSaved:[],
                recipes:this.initial_recipes,
                title:this.initial_title,
            }
        },
        components: {
            PreRecipeCardHorizontal,
            Hooper,
            Slide,
            HooperNavigation
        },
            props:{
                initial_recipes:Array,
                initial_title: String,
            },

         async mounted(){
             let currUser=this.$root.$store.user;
             console.log(currUser);
             if(currUser!=="null" && currUser){
            try {
                let ids=new Array();
               for(let r in this.recipes)
               {
                   ids.push(this.recipes[r].id);
                }
                const response = await this.axios.get(
                    `${this.$store.server_domain}/user/recipeInfo/${JSON.stringify(ids)}`, {withCredentials: true}
                )
                let results = response.data;
                this.WatchedSaved = results;
            } catch (error) {
                console.log(error);
            }
        }
        }

    };
</script>

<style lang="scss" scoped>
    h1{
        font-family: 'Grenze Gotisch', cursive;
    }
</style>
