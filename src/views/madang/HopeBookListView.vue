<template>
  <div class="container">
    <Sidebar ref="Sidebar"></Sidebar>
    <div class="main_container">hi</div>
  </div>
</template>

<script>
// import api from '@/api/axios';
import Sidebar from "@/components/common/SidebarView.vue";

export default {
  components: { Sidebar },
  data() {
    return {};
  },
  mounted() {
    this.$refs.Sidebar.setCurrentMenu(
      2,
      this.$route.path,
      this.$route.query.menuNo
    );
  },
};
</script>

<style scoped>
@import "../../assets/css/madang/hopeBook.css";
</style>
