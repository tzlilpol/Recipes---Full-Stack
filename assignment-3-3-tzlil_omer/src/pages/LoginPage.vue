<template>
  <div class="container">
    <LoginForm></LoginForm>
  </div>
</template>

<script>
import LoginForm from "../components/LoginForm";
export default {
    components: {LoginForm}
};
</script>
<style lang="scss" scoped>
.container {
  max-width: 400px;
  font-family: 'Kaushan Script', cursive;

}

</style>
