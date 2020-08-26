<template>
    <b-container  class="style" v-on:keypress="updateNewRecipe" v-on:click="updateNewRecipe">
        <h1 class="title">Create Recipe</h1>
        <b-form  v-if="show">
            <b-row style="margin-bottom: 0px">
                <b-col lg="8">
                    <b-form-group :state="validateState('title')"  label="Recipe's name:" >
                        <b-form-input style="width: 400px" v-model="form.title" required ></b-form-input>
                        <b-form-invalid-feedback v-if="$v.form.title.required">
                            Title is required
                        </b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group :state="validateState('image')"  label="Image url:">
                        <b-form-input style="width: 750px" v-model="form.image" required></b-form-input>
                        <b-form-invalid-feedback v-if="!$v.form.image.required">
                            Image url is required
                        </b-form-invalid-feedback>
                    </b-form-group>
                </b-col>
                <b-col lg="4" style="padding: 80px">
                    <div>
                        <b-button type="button"  v-on:click="onSubmit()" size="lg" pill variant="success" style="margin-bottom: 25px;width: 200px">Submit</b-button>
                    </div>
                    <div style="padding-left: 60px">
                        <b-button type="button" v-on:click="reset()" pill variant="outline-secondary" >Reset</b-button>
                    </div>
                </b-col>
            </b-row>
                <b-row style="margin-top: 0px">
                    <b-col lg="3">
                        <b-form-group :state="validateState('duration')"  label="Duration:" >
                            <b-form-input style="width: 130px" v-model="form.duration" placeholder="ex: 10"  required></b-form-input>
                            <b-form-invalid-feedback v-if="!$v.form.duration.required">
                                duration is required
                            </b-form-invalid-feedback>
                        </b-form-group>
                    </b-col>
                    <b-col lg="3">
                        <b-form-group :state="validateState('numOfDishes')"  label="Number of dishes:" >
                            <b-form-input style="width: 130px" v-model="form.numOfDishes" placeholder="ex: 4"  required></b-form-input>
                            <b-form-invalid-feedback v-if="!$v.form.numOfDishes.required">
                                number of dishes is required
                            </b-form-invalid-feedback>
                        </b-form-group>
                    </b-col>
                    <b-col lg="6">
                        <b-form-group label="Is your recipe:">
                                <b-form-checkbox v-model="form.vegan" >vegan?</b-form-checkbox>
                                <b-form-checkbox v-model="form.vegetarian">vegetarian?</b-form-checkbox>
                                <b-form-checkbox v-model="form.glutenFree">gluten free?</b-form-checkbox>
                        </b-form-group>
                    </b-col>
                </b-row>
            <b-row>
                <b-col>
                    <b-form-group label="Add ingredient">
                        <div style="display: inline-flex">
                            amount
                            <b-form-input style="width: 80px" placeholder="ex: 2" v-model="ingredient.amount" ></b-form-input>
                            measure unit-igredient name
                            <b-form-input style="width: 170px" title=" " placeholder="ex:spoons-sugar" v-model="ingredient.name" ></b-form-input>
                            <button type="button" v-on:click="addIngredient()">add</button>
                        </div>
                        <itemList :key="this.ingKey" :list="form.ingredients" type="1" :head="'Ingredients'" v-on:removeFromList="removeFromList($event,ret)"></itemList>
                    </b-form-group>
                </b-col>
                <b-col>
                    <b-form-group label="Add instruction">
                        <div style="display: inline-flex">
                            <b-form-input style="width: 400px" v-model="order" placeholder="ex: mix the sugar in the bowl"></b-form-input>
                            <button type="button" v-on:click="addOrder()">add</button>
                        </div>
                        <itemList :key="this.ordKey" :list="instructions" type="2" :head="'Instructions'" v-on:removeFromList="removeFromList($event,ret)"></itemList>
                    </b-form-group>
                </b-col>
            </b-row>
        </b-form>
    </b-container>
</template>

<script>
    import itemList from "../components/itemList";
    import {required} from 'vuelidate/lib/validators'
    export default {
        name: "createRecipePage",
        components: {itemList},
        data() {
            return {
                form: {
                    title: '',
                    image: '',
                    duration: '',
                    numOfDishes:'',
                    vegan: false,
                    vegetarian:false,
                    glutenFree:false,
                    orders: [],
                    ingredients: [],
                },
                errors: [],
                validated: false,
                show: true,
                ingKey:0,
                ordKey:0,
                order:'',
                instructions:[],
                ingredient:{amount: '',name: ''},
            }
        },
        validations: {
            form: {
                title: { required},
                image: { required },
                duration: { required },
                numOfDishes: { required },
            }
        },
        created() {
            let newRecipe=this.$root.$store.newRecipe.form;
            if(newRecipe) {
                this.form=newRecipe;
            }

        },
        methods: {
            updateNewRecipe :function () {
                this.$root.$store.newRecipe.form=this.form;
            }
            ,
            validateState(param) {
                const { $dirty, $error } = this.$v.form[param];
                return $dirty ? !$error : null;
            },
            onSubmit() {
                console.log(this.form.vegetarian);
                this.$v.form.$touch();
                if (this.$v.form.$anyError) {
                    return;
                }
                this.instructions.map((ins,index)=>{
                    this.form.orders.push({number: (index+1),step:ins})
                });
                this.axios.post(`${this.$store.server_domain}/user` +'/addRecipe', {
                    title: this.form.title ,
                    image: this.form.image ,
                    duration: this.form.duration ,
                    numOfDishes: this.form.numOfDishes,
                    ingredients: this.form.ingredients,
                    vegan: this.form.vegan,
                    vegetarian: this.form.vegetarian,
                    glutenFree: this.form.glutenFree,
                    orders: this.form.orders
                },{withCredentials:true})
                    .then((response) => {
                        console.log("from the response");
                        console.log(response);
                        if(response.status===201){
                            this.$root.$store.newRecipe=[];
                            this.$root.toast("Nice!", "your recipe was saved. you can view it under - my recipes tab", "success");
                            this.$router.push("/");
                        }
                        else {
                            this.reset();
                            this.$root.toast("Error", "your recipe was not saved. please try again", "success");
                        }
                    }, (error) => {
                        console.log(error);
                    });
            },
            reset() {
                this.form.title = '';
                this.form.image = '';
                this.form.duration = '';
                this.numOfDishes='';
                this.vegan=false;
                this.vegetarian=false;
                this.glutenFree=false;
                this.form.ingredients=[];
                this.instructions=[];
                // Trick to reset/clear native browser form validation state
                this.show = false
                this.$nextTick(() => {
                    this.show = true
                })
            },
            removeFromList(ret){
                if(ret.type==1){
                    this.form.ingredients.splice(ret.index, 1);
                    this.ingKey++;
                }else {
                    this.instructions.splice(ret.index, 1);
                    this.ordKey++;
                }
            },
            addOrder(){
                console.log('pushed to array:' + this.order);
                this.instructions.push(this.order);
                this.ordKey++;
                this.order='';
            },
            addIngredient(){
                this.form.ingredients.push({amount: this.ingredient.amount,name: this.ingredient.name});
                this.ingKey++;
                this.ingredient.amount='';
                this.ingredient.name='';
            }
        }
    }
</script>

<style scoped>
    @import "https://fonts.googleapis.com/css2?family=Kaushan+Script&display=swap";
    .style{
font-family: "Cooper Black";
        font-size: x-large;
        color: gold;
        -webkit-text-stroke: 1px black;
    }

    input[type=text] {
        font-family:"-apple-system";
    }
    ::placeholder {
        color: gray;
        font-size: x-small;
        font-family: David;
        -webkit-text-stroke: 0px black;
    }
    .title{
        font-family: 'Grenze Gotisch', cursive;
        font-weight: bold;
        color: gold;
        -webkit-text-stroke: 1px black;
        text-align: center;
    }
</style>
