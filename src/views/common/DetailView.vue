<template>
  <div>
    {{ isbn }}
  </div>
</template>
<script>
import api from "@/api/axios";
export default {
  data() {
    return {
      isbn: this.$route.params.isbn,
      bookInfo: {}
    }
  },

  created() {
    this.getBookInfo();
  },

  methods: {
    getBookInfo() { // 도서 정보 가져오기
      api.get(`/main/bookInfo/${this.isbn}`)
        .then(res => {
          if(res.common.res_code == 200 && res.data.book_no != '') {
            this.bookInfo = res.data.bookInfo;
            console.log(this.bookInfo);
            // this.sumCategory();
          } else {
            console.log("DetailView main/bookInfo 응답실패");
          }
        })
      // this.getDescript(event.target.value);
    },
  }
}
</script>
<style>
@import "../../assets/css/main/main.css";
</style>