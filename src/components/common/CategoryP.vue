<template>
  <div class="modal">
    <div class="modal_main">
      <div class="modal_body">
        <div class="modal_title">관심분야 카테고리 목록</div>
        <div class="modal_title_line_box"></div>
        <div v-for="prefer in categoryInfo" :key="prefer" style="font-size: 24px; margin: 8px 0px">
          <input class="modal_input" type="radio" v-model="category" :value="`${prefer.pf_name}`">{{ prefer.pf_name }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "@/api/axios";
export default {
  data() {
    return {
      category: "자기개발",
      categoryInfo: null
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
            this.categoryInfo = res.data.category;
          } else { // 응답실패
            console.log("CategoryP user/category 응답실패");
          }
        })
    }
  },
}
</script>
<style src="../../assets/css/common/index.css"></style>
