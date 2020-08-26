import Vue from "vue";
import App from "./App.vue";
import VueAxios from "vue-axios";
import axios from "axios";
import routes from "./routes";
import VueRouter from "vue-router";
import { shared_data } from "./shared_data";
import VueCookies from 'vue-cookies';


Vue.prototype.$store = shared_data;
Vue.use(VueRouter);
const router = new VueRouter({
  routes,
});
import Vuelidate from "vuelidate";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import {
  FormGroupPlugin,
  FormPlugin,
  FormInputPlugin,
  ButtonPlugin,
  CardPlugin,
  NavbarPlugin,
  FormSelectPlugin,
  AlertPlugin,
  ToastPlugin,
  LayoutPlugin,
  FormRadioPlugin,
  VBTogglePlugin,
  ModalPlugin,
  FormTagsPlugin,
  SpinnerPlugin,
  FormCheckboxPlugin,
  VBTooltipPlugin,
  IconsPlugin,
  SidebarPlugin,
  DropdownPlugin
} from "bootstrap-vue";
[
  FormGroupPlugin,
  FormPlugin,
  FormInputPlugin,
  ButtonPlugin,
  CardPlugin,
  NavbarPlugin,
  FormSelectPlugin,
  AlertPlugin,
  ToastPlugin,
  LayoutPlugin,
  FormRadioPlugin,
  VBTogglePlugin,
  ModalPlugin,
  FormTagsPlugin,
  SpinnerPlugin,
  FormCheckboxPlugin,
  VBTooltipPlugin,
  IconsPlugin,
  SidebarPlugin,
  DropdownPlugin
].forEach((x) => Vue.use(x));
Vue.use(Vuelidate);
Vue.use(VueCookies);
import VAnimateCss from 'v-animate-css';
Vue.use(VAnimateCss);

axios.interceptors.request.use(
    function(config) {
      // Do something before request is sent
      return config;
    },
    function(error) {
      // Do something with request error
      return Promise.reject(error);
    }
);

// Add a response interceptor
axios.interceptors.response.use(
    function(response) {
      // Do something with response data
      return response;
    },
    function(error) {
      // Do something with response error
      return Promise.reject(error);
    }
);
Vue.use(VueAxios, axios);


Vue.config.productionTip = false;
import { AvatarPlugin } from 'bootstrap-vue';
Vue.use(AvatarPlugin);
Vue.config.errorHandler = (e, vmc, info) => {
  // err: error trace
  console.log("from the error handler in main js (by omer)");
  console.log(e)
  // vm: component in which error occured
  // info: Vue specific error information such as lifecycle hooks, events etc.
};

new Vue({
  router,
  data() {
    return {
      store: shared_data,
    };
  },
  methods: {
    toast(title, content, variant = null, append = false) {
      this.$bvToast.toast(`${content}`, {
        title: `${title}`,
        toaster: "b-toaster-top-center",
        variant: variant,
        solid: true,
        appendToast: append,
        autoHideDelay: 3000,
      });
    },
  },
  render: (h) => h(App),
}).$mount("#app");
