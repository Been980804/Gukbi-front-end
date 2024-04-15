<template>
  <div class="review_popup">
    <div class="review_popup_main">
      <div class="review_popup_body">
        <div class="rating">          
          <div class="star" v-for="index in 5" :key="index" @click="check(index)">
            <span v-if="index &lt; score" class="after_click">⭐</span>
            <span v-if="index &gt;= score" class="before_click">⭐</span>
          </div>
          <div class="starCnt">{{score &lt;= 0 ? 0 : score - 1 }}</div>
        </div>
        <div class="review_content">
          <textarea
            cols="20"
            rows="8"
            maxlength="150"
            placeholder="리뷰를 작성해주세요."
            v-model="reviewContent"
          ></textarea>
        </div>
        <div class="review_buttonBox">
          <button class="button button_charcoal text_white review_btn" @click="review_submit">확인</button>
          <button class="button button_charcoal text_white review_btn" @click="review_cancel">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@/stores/user.js";

export default {
  props:{
    reviewBook : Object,
  },
  data() {
    return {
      user: useUserStore().getUser,
      score: 0,
      rentedBook : {...this.reviewBook},
      reviewContent : "",
    };
  },
  methods: {
    // 리뷰팝업 닫기
    review_cancel() {
      if (confirm("취소하시겠습니까?")) {
        this.$emit("close");
      }
    },
    // 별점 띄워주기
    check(index){
      this.score = index + 1;
    },
    // 리뷰 작성
    review_submit(){
      const reqBody={
        rent_no : this.reviewBook.rent_no,
        mem_no : this.user.mem_no,
        book_no : this.reviewBook.book_no,
        rev_scope : this.score - 1,
        rev_content : this.reviewContent
      };

      this.$api
      .post('mypage/rent/review', reqBody)
      .then(res => {
        const common = res.common;
        if(common.res_code == 200){
          alert('리뷰가 작성되었습니다.');
          this.$emit("close");
        } else{
          alert('리뷰작성 실패');
        }
      })
      .catch(err => {
        console.log(err);
      })
    },
  },
};
</script>

<style scoped>
/* @import "../../../assets/css/mypage/popup/reviewP.css"; */
</style>
