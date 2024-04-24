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
      descript: null,
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
      this.getDescript(this.isbn);
    },

    getDescript(value) { // 도서정보마루 api 통신
      api.get(`/main/descript/${value}`)
        .then(res => {
          if(res.common.res_code == 200) {
            this.descript = res.data.descript;
            console.log(this.descript);
          } else {
            console.log("DetailView main/descript 응답실패");
          }
        })
    }
  }
}
</script>
<style>
@import "../../assets/css/main/main.css";
</style>