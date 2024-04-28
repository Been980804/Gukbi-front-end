<!-- 책바구니 화면 -->
<template>
  <div>
    책바구니 화면
  </div>
</template>
<script>
import { useUserStore } from '@/stores/user.js';
export default {
  data() {
    return {
      user: useUserStore().getUser  
    }
  },

  created() {
    if(this.user.mem_id == null || undefined || '') {
      this.$router.push({ name: 'Main' });
    }
    console.log("aaaaaaaa");
  },
}
</script>