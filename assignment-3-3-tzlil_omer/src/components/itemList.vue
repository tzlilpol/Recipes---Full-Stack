<template>
    <b-card :header="this.head" style="min-height: 270px">
        <ul style="list-style-type: none">
            <li v-for="(r, index) in this.list" :key="index">
                    <b-button style="margin-right: 50px" v-on:click="$emit('removeFromList',{index: index,type: type})">remove</b-button>
                    <div v-if="type==='1'" style="display: inline-block">
                        {{index +1}}) {{r.amount}} , {{r.name}}
                    </div>
                    <div v-else style="display: inline-block">
                        {{index +1}}) {{r}}
                    </div>
            </li>
        </ul>
    </b-card>
</template>

<script>
    export default {
        name: "itemList"
        ,props:{
            list: {
                type: Array,
                required: true
            },
            head: {
                type: String,
                required: true
            },
            type:String
        }
    }
</script>

<style scoped>

</style>