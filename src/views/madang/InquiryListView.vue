<template>
  <div class="container">
    <Sidebar ref="Sidebar"></Sidebar>
    <div class="main_container">
        Inquiry List
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/common/SidebarView.vue";
import { useUserStore } from '@/stores/user';

export default {
    components:{
        Sidebar,
    },
    data(){
        return{
            user: useUserStore().getUser,
        }
    },

    mounted() {
    this.$refs.Sidebar.setCurrentMenu(
      3,
      this.$route.path,
      this.$route.query.menuNo
    );
  },

}
</script>

<style>

</style>