<template>
  <div class="modal">
    <div class="modal_main">
      <div class="modal_body">
        <div class="modal_title">도서 전체 목록</div>
        <div class="modal_title_line_box"></div>
        <input type="radio" v-model="category" value="자기계발">자기계발
        <input type="radio" v-model="category" value="기타">자기계발
      </div>
    </div>
  </div>
</template>
<script>
import api from "@/api/axios";
export default {
  data() {
    return {
      category: null
    }
  },

  created() {
    this.getCategory();
  },

  methods: {
    getCategory() { // 카테고리 목록 받아오기
      api.get(`/main/category`)
        .then(res => {
          if (res.common.res_code == 200) { // 응답성공
            console.log(res.data.category);
          } else { // 응답실패
            console.log("CategoryP user/category 응답실패");
          }
        })
    }
  },
}
</script>
<style src="../../assets/css/common/index.css"></style>
