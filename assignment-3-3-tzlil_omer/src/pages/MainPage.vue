<template>
  <div class="container">
    <h1 class="title">Try some, it's delicious
    </h1>
    <b-row>
      <b-col>
        <RecipePreListCarousel :key="randomPress" v-if="randomRecipes.length>0" :initial_recipes=randomRecipes initial_title="Explore this recipes" class="RandomRecipes center" />
        <b-button class="rndbtn" pill variant="primary" :disabled="randombuttonH" v-on:click="mainRequest" >For other amazing recipes just click! <b-icon icon="arrow-counterclockwise" animation="spin-reverse" v-show="randombuttonH"></b-icon></b-button>
      </b-col>
      <b-col v-if="isLogged" >
        <RecipePreListCarousel v-if="userRecipes.length>0"  style="margin-left: 150px" :initial_recipes=userRecipes initial_title="Last Recipes" class="RandomRecipes center" />
      </b-col>
      <b-col v-else>
        <b-row>
          <LoginForm ></LoginForm>
        </b-row>
      </b-col >
    </b-row>
  </div>
</template>

<script>
import RecipePreListCarousel from "../components/RecipePreListCarousel";
import LoginForm from "../components/LoginForm";
export default {
  components: {
    RecipePreListCarousel
    ,LoginForm
  },
  data() {
    return {
      randomRecipes: [],
      userRecipes: [],
      randomPress:0,
      randombuttonH: true,
    }
  },computed:{
    isLogged: function () {
      let currUser=this.$root.$store.user;
      console.log(currUser);
      if(currUser!=="null" && currUser){
        return true;
      }
      return false;
    }
  },
  methods:{
    async mainRequest(){

      this.randombuttonH=true;
      try {
        const response = await this.axios.get(
                `${this.$store.server_domain}/`,{withCredentials:true}
        );
        if(response.status=='201'){
          this.userRecipes = response.data.slice(3);
          this.randomRecipes=response.data.slice(0,3);
        }
        if(response.status=='200'){
          this.randomRecipes=response.data;
        }
        this.randomPress++;
        this.randombuttonH=false;
      } catch (error) {
        console.log("get recipes function error");
        console.log(error);
      }
    }
  },
  async created() {
    await this.mainRequest();
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
}
button{
  font-family: 'Kaushan Script', cursive;

}
</style>
