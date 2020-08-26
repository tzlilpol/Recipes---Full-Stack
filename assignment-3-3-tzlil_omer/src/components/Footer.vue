<template>
        <div id="footer"
                absolute
                class="font-weight-medium"
        >
            <b-col
                    class="text-center"
                    cols="12"
            >
                {{ new Date().getFullYear() }} — <strong>Powered by SPOONACULAR API</strong>
            </b-col>
        </div>
</template>

<script>
    export default {
        name: "Footer"
    }
</script>

<style scoped>
    #footer{
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        text-align: center;
    }
</style>