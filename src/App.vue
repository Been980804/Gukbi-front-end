<template>
  <Header class="header" ref="header"/>
  <router-view class="router" :key="$route.fullPath"/>
  <Footer class="footer" ref="footer"/>
</template>

<script>
import Header from '@/components/common/HeaderView.vue';
import Footer from '@/components/common/FooterView.vue';


export default {
  name: 'App',
  components: {
    Header,
    Footer,
  },

  mounted() {
    this.$router.afterEach(() => {
      this.$refs.header.setUser();
      this.$refs.footer.setUser();
    })
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
