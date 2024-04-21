<template>
  <Header class="header"/>
  <router-view class="router" :key="$route.fullPath"/>
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
  color: #2c3e50;
}
.router {
  min-height: 50vh;
  background-color: #CEC6EA;
}
</style>
