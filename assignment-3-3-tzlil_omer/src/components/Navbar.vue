<template>
        <div>
            <div>
                <b-navbar toggleable="lg" type="dark" variant="dark" >
                    <b-navbar-nav v-if="isLogged">
                        <b-nav-item-dropdown dropleftt class="navBarTitle" >
                            <!-- Using 'button-content' slot -->
                            <template v-slot:button-content>
                                Hi {{userName}}
                            </template>
                            <b-dropdown-item >
                                <router-link tag="li" active-class="active" :to="{ name: 'privateRecipe' }"><b-icon icon="person"></b-icon> My recipes</router-link>
                            </b-dropdown-item>
                            <b-dropdown-item >
                                <router-link tag="li" active-class="active" :to="{ name: 'favoriteRecipes' }"><b-icon icon="star"></b-icon> Favorites</router-link>
                            </b-dropdown-item>
                            <b-dropdown-item >
                                <router-link tag="li" active-class="active" :to="{ name: 'familyRecipe' }"><b-icon icon="people"></b-icon> Family recipes</router-link>
                            </b-dropdown-item>
                            <b-dropdown-item >
                                <router-link tag="li" active-class="active" :to="{ name: 'createRecipe' }"><b-icon icon="file-earmark-plus"></b-icon> Create recipe</router-link>
                            </b-dropdown-item>
                        </b-nav-item-dropdown>
                    </b-navbar-nav>
                    <b-navbar-brand v-else href="#" class="navBarTitle"><b-icon icon="person-circle"></b-icon> Hi Guest</b-navbar-brand>
                    <b-avatar v-if="isLogged" v-on:click="this.$emit('showUserModal')" variant="info" v-bind:src="$root.$store.user.image" class="mr-3"></b-avatar>
                    <b-collapse id="nav-collapse" is-nav class="navBarTitle">
                        <b-navbar-nav>
                            <b-nav-item >
                                <router-link tag="li" active-class="active" :to="{ name: 'main' }"><b-icon icon="house"></b-icon> Home</router-link>
                            </b-nav-item>
                        </b-navbar-nav>
                        <!-- Right aligned nav items -->
                        <b-navbar-nav class="ml-auto">
                            <b-nav-item>
                                <router-link tag="li" active-class="active" :to="{ name: 'search' }"><b-icon icon="search"></b-icon> Search</router-link>
                            </b-nav-item>
                            <b-nav-item v-if="isLogged" >
                                <a v-on:click="this.logout"><b-icon icon="power"></b-icon> Log out</a>
                            </b-nav-item>
                            <b-nav-item v-if="!isLogged">
                                <router-link tag="li" active-class="active" :to="{ name: 'register' }"><b-icon icon="person-plus"></b-icon> Register</router-link>
                            </b-nav-item>
                            <b-nav-item v-if="!isLogged">
                                <router-link tag="li" v-on:click="this.login" active-class="active" :to="{ name: 'login' }"><b-icon icon="plug"></b-icon> Log in</router-link>
                            </b-nav-item>
                            <b-nav-item >
                                <router-link tag="li" active-class="active" :to="{ name: 'about' }"><b-icon icon="question-circle-fill"></b-icon> About</router-link>
                            </b-nav-item>
                            <b-nav-form>
                                <b-form-input id="searchBar" name="searchBar" size="sm" class="mr-sm-2" v-model="search" placeholder="Search"></b-form-input>
                                <b-button
                                        type="submit"
                                        size="sm"
                                        :to="{ name: 'search' ,query:{name:search}}"
                                        class="my-2 my-sm-0"
                                ><b-icon icon="search"></b-icon>
                                </b-button>
                            </b-nav-form>
                        </b-navbar-nav>
                    </b-collapse>
                </b-navbar>
            </div>
        </div>
</template>
<script>
    export default {
        data:()=>({
            activeItem: 0,
            search: '',
        }),
        computed:{
          isLogged: function () {
              let currUser=this.$root.$store.user;
              if(currUser!=="null"&&currUser){
                  return true;
              }
              return false;
          },
          userName: function(){
              return(this.$root.$store.user.userName)
            }
        },
        methods:{
            isEmpty :function () {
                if (this.search=='')
                    return true;
                else return false;
                },
            logout: function () {
                this.$root.$store.searchResults=[];
                this.$root.$store.newRecipe=[];
                this.$emit('logoutNav')
                this.$forceUpdate();
                console.log(this.$router.currentRoute.path)
                console.log(this.$router.currentRoute.name)
                if(this.$router.currentRoute.path!=='/search' && this.$router.currentRoute.path!=='/about')
                    this.$router.push("/").catch((e)=>{console.log(e)});
            },
            login: function () {
                this.$emit('loginNav')
                this.$forceUpdate();
            }
        }
    }
</script>

<style scoped>
.navBarTitle{
    font-family: 'Kaushan Script', cursive;
}

</style>