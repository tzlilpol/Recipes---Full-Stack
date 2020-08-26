<template>
    <b-container  v-if="this.recipe" >
        <b-row>
            <b-container class="recipe-header" style="text-align: center">
                <h1>{{ this.recipe.title }}</h1>
            </b-container >
            <b-col lg="3" class="fontW">
                <div v-show="type=='privateRecipe'" @click="doubleNumOfDishes"><span v-b-tooltip.hover="{ variant: 'info' }" title="Click here to double number of dishes"><b-icon icon="plus-circle" scale="4" class="rounded bg-primary p-1" variant="light" animation="throb" ></b-icon></span><b-icon icon="grid3x3-gap"></b-icon>number of dishes:{{this.recipe.servings||this.recipe.numOfDishes}}</div>
                <div><b-icon icon="clock"></b-icon>Ready in {{  this.recipe.readyInMinutes||this.recipe.duration }} minutes</div>
                <div><b-icon icon="hand-thumbs-up"></b-icon>Likes: {{this.recipe.aggregateLikes||this.recipe.Likes  }} likes</div>
                <br>
                <h4  src="" v-if="this.recipe.vegetarian"  >
                    -vegetarian
                </h4>
                <h4 v-if="this.recipe.vegan"  >
                    -Vegan
                </h4>
                <h4 v-if="this.recipe.glutenFree"  >
                    -Gluten free
                </h4>


                <div class="fontW" >
                    <h3><b-icon icon="tools"></b-icon>Ingredients:</h3>
                    <ul style="list-style-type:none;">
                        <li class="whiteBackground" style="margin-top: 10px;"
                            v-for="(r, index) in this.recipe.Ingredients"
                            :key="index + '_' + r.id"
                        >
                            <p style="opacity: 1;">{{ r.amount }} {{r.name}}</p>
                        </li>
                    </ul>
                </div>
            </b-col>
            <b-col lg="5" >
                <img  :src="this.recipe.image||this.recipe.imageURL" class="center" style="margin-right: 0px; min-width: 400px"  height="300px"/>
                <br>
                <b-row v-show="$root.$store.user&&type!='privateRecipe'">
                    <b-col></b-col>
                    <b-col>
                    <span @click="updateSaved" v-b-tooltip.hover="{ variant: 'info' }" title="Click on star to add/remove to/from favorites"
                    >
                        <b-icon icon="star"  v-show="!save" font-scale="4"   animation="throb"></b-icon><b-icon icon="star-fill" v-show="save" font-scale="4" variant="warning">save recipe</b-icon>
                    </span>
                    </b-col>
                    <b-col></b-col>
                </b-row>
            </b-col>
            <b-col class="fontW" lg="4" v-if="this.recipe.instructionsAsArray&&this.recipe.instructionsAsArray.length>1">
                <h3><b-icon icon="gear"></b-icon>Instructions:</h3>
                <ul style="list-style-type:none;">
                    <li
                            v-for="(r, index) in this.recipe.instructionsAsArray"
                            :key="index + '_' + r.id"
                    >
                        {{ r.number }}) {{r.step}}
                    </li>
                </ul>
            </b-col>
            <b-col lg="3" class="fontW" v-else>
                <h3><b-icon type="gear"></b-icon>Instructions:</h3>
                {{this.recipe.instructions}}
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import VueStar from 'vue-star'
    export default {

        data() {
            return {
                recipe: Object,
                save: false,
                type:''
            };
        },
        async mounted() {
            let response;
            let par = this.$route.params.recipeId;
            let type = this.$route.params.route;
            this.type=type;
            console.log(type)
            if (type == 'search'||type == 'main'||type == 'favoriteRecipes'){
                try {
                    response = await this.axios.get(
                        `${this.$store.server_domain}/recipe/` + par
                    );
                    if (response.status !== 200)
                        this.$router.replace("/NotFound");
                    this.recipe = response.data;
                    let currUser = this.$root.$store.user;
                    console.log('user:');
                    console.log(currUser);
                    if (currUser !== "null" && currUser) {
                        const response1 = await this.axios.get(
                            `${this.$store.server_domain}/user/updateRecipeInfo/id/${this.recipe.id}/watched/true/`,
                            {withCredentials: true}
                        );
                    }
                } catch (e) {
                    console.log("error.response.status", error.response.status);
                    this.$router.replace("/NotFound");
                    return;
                }
        }
            else if (type=='privateRecipe'){
                try {
                    response = await this.axios.get(
                        `${this.$store.server_domain}/user/private/recipe/` + par, {withCredentials: true}
                    );
                    if (response.status !== 200)
                        this.$router.replace("/NotFound");

                    this.recipe = response.data;
                    console.log(this.recipe)
                } catch (e) {
                    console.log("error.response.status", error.response.status);
                    this.$router.replace("/NotFound");
                    return;
                }
            }

        }
        ,
        methods:{
            doubleNumOfDishes: async function(){
                this.recipe.numOfDishes=this.recipe.numOfDishes*2;
                for (let i = 0; i < this.recipe.Ingredients.length; i++) {
                    this.recipe.Ingredients[i].amount*=2;
                }
                console.log('doubleNumOfDishes')
                console.log(this.recipe)
                try {
                    const response = await this.axios.get(
                        `${this.$store.server_domain}/user/private/recipe/${this.recipe.recipeID}/doubleNumOfDishes/`,
                        {withCredentials: true}
                    );
                } catch (error) {
                    console.log(error);
                }

            },
            updateSaved: async function () {
                if (!this.save)
                    this.save=true;
                else
                    this.save=false;
                try {
                    const response = await this.axios.get(
                        `${this.$store.server_domain}/user/updateRecipeInfo/id/${this.recipe.id}/saved/${this.save}/`,
                        {withCredentials: true}
                    );
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }
</script>

<style scoped>
    @import "https://fonts.googleapis.com/css2?family=Kaushan+Script&display=swap";
    @import "https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap";
    .whiteBackground{
        background: rgba(204, 208, 204, 0.69);
    } .fontW{
          font-family: 'Kaushan Script', cursive;
              color: #28140b;
      }
    .center {
        display: block;
        margin-left: auto;
        margin-right: auto;
        width: 50%;
    }
    h1{
        font-family: 'Grenze Gotisch', cursive;
        font-weight: bold;
        color: gold;
        -webkit-text-stroke: 1px black;

    }
    h4 {
        font-family: 'Fredoka One', cursive;
        color: rgba(63, 195, 128, 1);
        -webkit-text-stroke: 1px black;
    }
    h6{
        font-family: "Roboto", sans-serif;
        color: gray;
    }
    button{
        font-family: 'Kaushan Script', cursive;

    }
</style>

