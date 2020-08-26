<template>
    <b-container>
    <div>
        <b-card  no-body class="overflow-hidden" >
            <b-row no-gutters>
                <b-col md="6">
                    <b-card-img v-if="image_load" :src="recipe.image" alt="Image" class="rounded-0"></b-card-img>
                </b-col>
                <b-col md="6">
                    <b-card-body :title="recipe.name" >
                        {{ recipe.name }} - {{recipe.recipeOwner}}
                        <b-card-text >
                            Ingredients:
                            <li
                                    v-for="(r, index) in recipe.ingredients"
                                    :key="index + '_' + r.id"
                            >
                                {{ r.amount }} {{r.ingredient}}
                            </li>
                        </b-card-text>
                        <b-card-text>
                            Instructions:
                            <ol
                                    v-for="(r, index) in recipe.Instructions"
                                    :key="index + '_' + r.id"
                            >
                                {{r.step}}) {{ r.instruction }}
                            </ol>
                        </b-card-text>
                    </b-card-body>
                </b-col>
            </b-row>
        </b-card>
    </div>
    </b-container>
</template>

<script>
export default {
    name: "FamilyRecipe",
    mounted() {
        this.axios.get(this.recipe.image).then((i) => {
            this.image_load = true;
        });
    },
    data() {
        return {
            image_load: false
        };
    },
    props: {
        recipe: {
            type: Object,
            required: true
        }

    }
};
</script>

<style scoped>
    .overflow-hidden{
        font-family: 'Kaushan Script', cursive;
        color: #28140b;
    }
</style>