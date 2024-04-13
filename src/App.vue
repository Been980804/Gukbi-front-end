<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  <Header class="header"/>
  <router-view class="router"/>
  <Footer class="footer"/>
</template>

<script>
import Header from './components/common/HeaderView.vue';
import Footer from './components/common/FooterView.vue';

export default {
  name: 'App',
  components: {
    Header,
    Footer,
  }
}
</script>

<style>
@import '/src/assets/css/common/com.css';
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}
.router {
  min-height: 50vh;
  background-color: #CEC6EA;
}

/* html, body {
  min-width: 1040px;
  overflow-x: hidden;
} */
</style>
