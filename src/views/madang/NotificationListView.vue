<template>
    <div class="container">
        <Sidebar ref="Sidebar"></Sidebar>
        <div class="main_container">
            notification list
        </div>
    </div>
</template>

<script>
import api from "@/api/axios";
import Sidebar from "../../components/common/SidebarView.vue";

export default {
  components: { Sidebar },
  mounted() {
    this.$refs.Sidebar.setCurrentMenu(
      3,
      this.$route.path,
      this.$route.query.menuNo
    );
  },
};
</script>

<style>

</style>