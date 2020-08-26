<template>
  <b-container>
    <h1 class="title">
      {{ title }}
    </h1>
      <b-card-group >
        <b-row   v-for="(group, i) in recipeGroups" :key="group"  >
            <b-col v-for="(r, indx) in recipes.slice(i * itemsPerRow, (i + 1) * itemsPerRow)" :key="indx" :index="indx" >
              <div>
              <RecipePreview class="recipePreview" :initial_recipe="r" :initial_-watched-saved=WatchedSaved[r.id] />
              </div>
            </b-col>
        </b-row>
      </b-card-group>
  </b-container>
</template>

<script>
  import RecipePreview from "./RecipePreview.vue";
export default {
  name: "RecipePreviewList",
  components: {
    RecipePreview
  },
  data() {
    return {
      WatchedSaved:[],
      recipes :this.initial_recipes,
      title:this.initial_title,
      itemsPerRow:4
    }
  },
  props:{
    initial_title: String,
    initial_recipes:Array
  } ,
  computed:{
    recipeGroups () {
      return Array.from(Array(Math.ceil(this.recipes.length / this.itemsPerRow)).keys())
    }
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
        console.log(results)
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
    font-weight: bold;
    color: gold;
    -webkit-text-stroke: 1px black;
    text-align: center;
  }
  .card-deck .card {
    max-width: calc(25% - 30px);
  }


</style>
