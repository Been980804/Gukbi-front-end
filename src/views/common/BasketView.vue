<!-- 책바구니 화면 -->
<template>
  <div>
    책바구니 화면
  </div>
</template>
<script>
import api from "@/api/axios";
import { useUserStore } from '@/stores/user.js';
export default {
  data() {
    return {
      user: useUserStore().getUser,
      basketList: {}
    }
  },

  created() {
    if(this.user.mem_id == null || undefined || '') {
      this.$router.push({ name: 'Main' });
    }
    
    // 사용자 책바구니 내역 가져오기
    this.getBasket();
  },

  methods: {
    getBasket() {
      api.get(`/main/bookInfo/basketList/${this.user.mem_no}`)
        .then(res => {
          if (res.common.res_code == 200) { // 응답성공
            this.basketList = res.data.basketList;
          } else { // 응답실패
            console.log("BookListView book/bookCount 응답실패");
          }
        })
    }
  },
}
</script>