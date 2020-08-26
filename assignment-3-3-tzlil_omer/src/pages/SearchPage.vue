<template>
<div>
    <div class="modalB">
        <b-modal v-model="modalShow"  class="modalB">{{message}}</b-modal>
    </div>
    <b-container class="containerB" >

            <br>
        <h1>What would you like to cook?</h1>
        <b-row  >
            <b-col></b-col>
            <b-col sm="6">
            <b-form-input
                    id="search"
                    v-model="searchQuery"
                    type="text"
                    placeholder="Find a Recipe"
            >

            </b-form-input>
            </b-col>
            <b-col >
                <b-button variant="outline-secondary" type="submit"
                          v-on:click="executeQuery">
                    <b-icon icon="search" v-show="!load_recipes"></b-icon><b-icon icon="arrow-counterclockwise" animation="spin-reverse" v-show="load_recipes"></b-icon>search</b-button>
                <b-button v-b-toggle.sidebar-right >
                <b-icon icon="list"></b-icon>Filter</b-button>
                <b-dropdown id="dropdown-1" text="Sort" class="m-md-2" v-show="showResults && recipes.length>0" icon="bar-chart-fill">
                    <b-form-group>
                    <b-form-checkbox-group
                            v-model="selectedSort"
                            :options="sortType"
                            class="mb-3"
                            value-field="item"
                            text-field="name"
                            stacked
                            v-on:input="sortRecipes"
                    ></b-form-checkbox-group>
                    </b-form-group>
                </b-dropdown>

            </b-col>
        </b-row>


            <b-sidebar id="sidebar-right" title="Advanced search" right shadow>
                <div class="px-3 py-2">
            <b-form-group variant="dark"
                        label="Number of recipes:">
                    <b-form-radio-group variant="dark"
                            id="radio-group-1"
                            v-model="num"
                            :options="numRecipes"
                    ></b-form-radio-group>
                </b-form-group>


<!--        cuisine            -->
                    <div >
                        <b-form-group
                            label="Cuisine:"
                            label-for="cuisine">
                            <!-- prop `add-on-change` is needed to enable adding tags vie the `change` event -->
                            <b-form-tags v-model="cuisine" size="lg" add-on-change no-outer-focus class="mb-2">
                                <template v-slot="{ tags, inputAttrs, inputHandlers, disabled, removeTag }">
                                    <ul v-if="tags.length > 0" class="list-inline d-inline-block mb-2">
                                        <li v-for="tag in tags" :key="tag" class="list-inline-item">
                                            <b-form-tag
                                                    @remove="removeTag(tag)"
                                                    :title="tag"
                                                    :disabled="disabled"
                                                    variant="dark"
                                            >{{ tag }}</b-form-tag>
                                        </li>
                                    </ul>
                                    <b-form-select
                                            v-bind="inputAttrs"
                                            v-on="inputHandlers"
                                            :disabled="disabled || availableOptionsCuisines.length === 0 ||cuisines.length-availableOptionsCuisines.length===1"
                                            :options="availableOptionsCuisines"
                                    >
                                        <template v-slot:first>
                                            <!-- This is required to prevent bugs with Safari -->
                                            <option disabled value="">Choose a cuisine...</option>
                                        </template>
                                    </b-form-select>
                                </template>
                            </b-form-tags>
                        </b-form-group>

<!--                    -->
            <!--        diets            -->
                <b-form-group
                        label="Diet:"
                        label-for="diet">
                    <!-- prop `add-on-change` is needed to enable adding tags vie the `change` event -->
                    <b-form-tags v-model="diet" size="lg" add-on-change no-outer-focus class="mb-2">
                        <template v-slot="{ tags, inputAttrs, inputHandlers, disabled, removeTag }">
                            <ul v-if="tags.length > 0" class="list-inline d-inline-block mb-2">
                                <li v-for="tag in tags" :key="tag" class="list-inline-item">
                                    <b-form-tag
                                            @remove="removeTag(tag)"
                                            :title="tag"
                                            :disabled="disabled"
                                            variant="dark"
                                    >{{ tag }}</b-form-tag>
                                </li>
                            </ul>
                            <b-form-select
                                    v-bind="inputAttrs"
                                    v-on="inputHandlers"
                                    :disabled="disabled || availableOptionsDiets.length === 0 ||diets.length-availableOptionsDiets.length===1"
                                    :options="availableOptionsDiets"
                            >
                                <template v-slot:first>
                                    <!-- This is required to prevent bugs with Safari -->
                                    <option disabled value="">Choose a diet...</option>
                                </template>
                            </b-form-select>
                        </template>
                    </b-form-tags>
                </b-form-group>
            <!--                    -->
            <!--        intolerances            -->
                <b-form-group
                        label="Intolerance:"
                        label-for="diet">
                    <!-- prop `add-on-change` is needed to enable adding tags vie the `change` event -->
                    <b-form-tags v-model="intolerance" size="lg" add-on-change no-outer-focus class="mb-2">
                        <template v-slot="{ tags, inputAttrs, inputHandlers, disabled, removeTag }">
                            <ul v-if="tags.length > 0" class="list-inline d-inline-block mb-2">
                                <li v-for="tag in tags" :key="tag" class="list-inline-item">
                                    <b-form-tag
                                            @remove="removeTag(tag)"
                                            :title="tag"
                                            :disabled="disabled"
                                            variant="dark"
                                    >{{ tag }}</b-form-tag>
                                </li>
                            </ul>
                            <b-form-select
                                    v-bind="inputAttrs"
                                    v-on="inputHandlers"
                                    :disabled="disabled || availableOptionsIntolerances.length === 0||intolerances.length-availableOptionsIntolerances.length===1"
                                    :options="availableOptionsIntolerances"
                            >
                                <template v-slot:first>
                                    <!-- This is required to prevent bugs with Safari -->
                                    <option disabled value="">Choose a diet...</option>
                                </template>
                            </b-form-select>
                        </template>
                    </b-form-tags>
                </b-form-group>
            </div>
                </div>
            <b-row>
                <b-col>
                <b-button @click="resetFilters" type="submit" variant="dark">Reset</b-button>
                </b-col>
                <b-col>
                <b-button v-b-toggle.sidebar-right type="submit" variant="dark">Close</b-button>
                </b-col>

            </b-row>
            </b-sidebar>
            <!--                    -->
        <b-row v-if="showResults && recipes.length>0" >
            <b-card-group>
                <RecipePreviewList :key="render" :initial_recipes="recipes"   initial_title="Results"  />
            </b-card-group>
        </b-row>
        <br>
                <RecipePreviewList v-if="this.$store.searchResults.length>0" initial_title="Last Search" :initial_recipes="this.$store.searchResults" />


    </b-container>
</div>
</template>

<script>
    import cuisines from "../assets/cuisines";
import RecipePreviewList from "../components/RecipePreviewList";
import RecipePreListCarousel from "../components/RecipePreListCarousel"
    import diets from "../assets/diets";
    import intolerances from "../assets/intolerances";
    import {required} from "vuelidate/lib/validators";
    export default {
     name : "search",
    data(){
      return{
          searchQuery : "",
          showResults :false,
          num :5,
          search_params:[],
          recipes:[],
          cuisines: [{ value: null, text: "", disabled: true}],
          diets: [{ value: null, text: "", disabled: true }],
          intolerances: [{ value: null, text: "", disabled: true }],
          selected: '5',
          numRecipes: [
              { value:5,text: '5',default :5},
              { value:10,text: '10'},
              { value:15,text: '15'},
          ],
          cuisine:[],
          diet:[],
          intolerance:[],
          selectedSort: [],
          sortType: [
              { item: 'Time', name: 'Time' },
              { item: 'Likes', name: 'Likes' },
          ],
          render:'0',
          modalShow:false,
          message :String,
          load_recipes:false
        }
      },
        methods: {
            resetFilters: function(){
                this.num=5
                this.cuisine=[]
                this.diet=[]
                this.intolerance=[]
            },
            executeQuery: async function () {
                this.load_recipes=true
                let search_params={};
                if(this.diet!=null) search_params.diet=this.diet[0];
                if(this.cuisine!=null) search_params.cuisine=this.cuisine[0];
                if(this.intolerance!=null) search_params.intolerance=this.intolerance[0];
                if(this.searchQuery==''||this.searchQuery==undefined)
                {
                    this.message='Please insert recipe image';
                    this.modalShow=true;
                }
                else{
                try {
                    const response = await this.axios.get(
                        `${this.$store.server_domain}/recipe/search/query/${this.searchQuery}/amount/${this.num}`,
                        {
                            params:search_params
                        }
                    );

                     if (response.status !== 200 || !response.data|| response.data.length==0) {
                        this.message='No results found';
                        this.modalShow = true;
                        this.load_recipes=false;

                    }
                    else{
                        this.recipes = [];
                        this.recipes = response.data;
                        this.render+='1';
                        if(this.$store.searchResults.length>0) {
                            let contain = false;
                            for (let r in this.recipes) {
                                for (let s in this.$store.searchResults) {
                                    if (this.recipes[r].id == this.$store.searchResults[s].id) {
                                        contain = true;
                                        break;
                                    }
                                }
                                if (!contain) {
                                    this.$store.searchResults.push(this.recipes[r]);
                                    contain = false;
                                }
                            }
                        }
                        else {
                            this.$store.searchResults.push(...this.recipes)
                        }
                        console.log('SearchPageRecipes');
                        console.log(this.recipes);
                        this.searchQuery='';
                        this.showResults = true;
                        this.load_recipes=false;
                    }
                } catch (error) {
                    this.load_recipes=false;
                    this.message=error;
                    this.modalShow = true;
                    console.log(error);
                }
                }
            },
            sortRecipes: function () {

                let tempArr = new Array();
                tempArr = this.recipes;
                this.recipes=[];
                if (this.selectedSort.includes("Time")) {
                    console.log('sortByTime')
                    let n = tempArr.length;
                    let i = 0
                    for (; i < n - 1; i++) {
                        let j = 0
                        for (; j < n - i - 1; j++)
                            if (tempArr[j].duration > tempArr[j + 1].duration) {
                                let temp = tempArr[j];

                                tempArr[j] = tempArr[j + 1];

                                tempArr[j + 1] = temp;
                            }
                    }
                    this.render+='1';
                }
                else if (this.selectedSort.includes("Likes")) {
                    console.log('sortByLikes')
                    let n = tempArr.length;
                    let i = 0
                    for (; i < n - 1; i++) {
                        let j = 0;
                        for (; j < n - i - 1; j++)
                            if (tempArr[j].likes > tempArr[j + 1].likes) {
                                let temp = tempArr[j];
                                tempArr[j] = tempArr[j + 1];

                                tempArr[j + 1] = temp;
                            }
                    }
                    this.render+='1';
                }
                this.recipes = tempArr;
            }
        },
        created() {
                this.searchQuery=this.$route.query.name;
            if (this.searchQuery!=null&&this.searchQuery!="")
                this.executeQuery();
        },
        mounted() {
            this.cuisines.push(...cuisines);
            this.diets.push(...diets);
            this.intolerances.push(...intolerances);

        },
        computed: {
            availableOptionsCuisines() {
                return this.cuisines.filter(opt => this.cuisine.indexOf(opt) === -1)
            },
            availableOptionsDiets() {
                return this.diets.filter(opt => this.diet.indexOf(opt) === -1)
            },
            availableOptionsIntolerances() {
                return this.intolerances.filter(opt => this.intolerance.indexOf(opt) === -1)
            },
        },
        components:{
/*
            RecipePreListCarousel ,
*/
            RecipePreviewList
        ,
        }
    }
</script>

<style lang="scss" scoped>
    .containerB{
        font-family: 'Kaushan Script', cursive;
    }
    .modalB{
        font-family: 'Kaushan Script', cursive;
         }
h1{
    font-family: 'Grenze Gotisch', cursive;
    font-weight: bold;
    color: gold;
    -webkit-text-stroke: 1px black;
    text-align: center;
}
</style>
