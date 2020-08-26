<template>
  <div id="app" >
    <Navbar v-on:logoutNav="Logout()" v-on:loginNav="Login($event)" v-on:showUserModal="showUserModal($event)"></Navbar>
    <router-view :key="logIndisplay"/>
    <Footer></Footer>
  </div>
</template>

<script>
  import Navbar from "./components/Navbar";
  import Footer from "./components/Footer";
  import UserModal from "./components/UserModal";
export default {
  name: "App",
  components: {Footer ,Navbar},
  methods: {
     Logout: async function () {
      try {
        const response = await this.axios.get(
                `${this.$store.server_domain}/logout`, {withCredentials: true}
        );
        if(response.status==200){
          this.$root.store.logout();
          this.$root.toast("Logout", "User logged out successfully", "success");
          this.$forceUpdate();
          console.log(" heyyyyyyyyy" )
        }else {
          this.$root.toast("Logout", "Unauthorized access (error code : " + response.status +")", "failure");
        }
      }catch (e) {
        this.$root.store.logout();
        this.$root.toast("Logout", "Unauthorized access (error code : " + response.status +")", "failure");
      }
    },
    Login: function () {
      this.logIndisplay++;
    },
    showUserModal:function () {
      this.userModalOn=true;
      console.log("yyyy");
    },
    OffUserModal:function () {
      this.userModalOn=false;
    }
  },
  data(){
    return{
      userModalOn : false,
      logIndisplay : 0
    }
  },mounted() {
  }
}
</script>

<style lang="scss">
  @import "https://fonts.googleapis.com/css2?family=Grenze+Gotisch:wght@100;700&family=Kaushan+Script&display=swap";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  overflow: hidden;
  /*position: fixed;*/
/*  background: rgb(66, 185, 131);
  background: linear-gradient(90deg, rgb(66, 185, 131) 0%, rgba(239,249,236,1) 50%, rgb(66, 185, 131) 100%);*/
  background:url("./assets/3822966.jpg")no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;

}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
