<template>
  <div class="bookPlUpdate_popup">
    <div class="bookPlUpdate_popup_main">
      <div class="bookPlUpdate_popup_body">
        <div class="bookPlUpdate_popup_title">
          <input
            type="text"
            id="bookPlUpdate_popup_title_input"
            :placeholder="updateBpl.bpl_name"
            autocomplete="off"
          />
        </div>
        <div class="bookPlUpdate_popup_content">
          <textarea
            name="textarea"
            cols="30"
            rows="10"
            :placeholder="updateBpl.bpl_intro"
            maxlength="250"
            id="bookPlUpdate_textarea"
          ></textarea>
        </div>
        <div class="bookPlUpdate_popup_category">
          <input
            name="prefer"
            type="radio"
            id="prefer01"
            value="01"
            v-model="updateBpl.bpl_category"
          />
          <label for="prefer01">자기계발</label>
          <input
            name="prefer"
            type="radio"
            id="prefer02"
            value="02"
            v-model="updateBpl.bpl_category"
          />
          <label for="prefer02">문학</label>
          <input
            name="prefer"
            type="radio"
            id="prefer03"
            value="03"
            v-model="updateBpl.bpl_category"
          />
          <label for="prefer03">건강/스포츠</label>
          <input
            name="prefer"
            type="radio"
            id="prefer04"
            value="04"
            v-model="updateBpl.bpl_category"
          />
          <label for="prefer04">가정</label>
          <input
            name="prefer"
            type="radio"
            id="prefer05"
            value="05"
            v-model="updateBpl.bpl_category"
          />
          <label for="prefer05">종교</label>
          <input
            name="prefer"
            type="radio"
            id="prefer06"
            value="06"
            v-model="updateBpl.bpl_category"
          />
          <label for="prefer06">사회/역사</label>
          <input
            name="prefer"
            type="radio"
            id="prefer07"
            value="07"
            v-model="updateBpl.bpl_category"
          />
          <label for="prefer07">과학/기술</label>
          <input
            name="prefer"
            type="radio"
            id="prefer08"
            value="08"
            v-model="updateBpl.bpl_category"
          />
          <label for="prefer08">경제</label>
          <input
            name="prefer"
            type="radio"
            id="prefer09"
            value="09"
            v-model="updateBpl.bpl_category"
          />
          <label for="prefer09">예술</label>
          <input
            name="prefer"
            type="radio"
            id="prefer10"
            value="10"
            v-model="updateBpl.bpl_category"
          />
          <label for="prefer10">기타</label>
        </div>
        <div class="bookPlUpdate_buttonBox">
          <button
            class="button button_charcoal text_white bplUpdate_btn"
            @click="bplUpdate_submit"
          >
            확인
          </button>
          <button
            class="button button_charcoal text_white bplUpdate_btn"
            @click="bplUpdate_cancel"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@/stores/user.js";

export default {
  props: {
    bookPlyInfo: Object,
  },

  data() {
    return {
      user: useUserStore().getUser,
      updateBpl: { ...this.bookPlyInfo },
    };
  },
  methods: {
    // 북플리 수정 팝업 닫기
    bplUpdate_cancel() {
      if (confirm("취소하시겠습니가?")) {
        this.$emit("close");
      }
    },
    // 북플리 수정
    bplUpdate_submit() {
      const reqBody = {
        bpl_no: this.bookPlyInfo.bpl_no,
        mem_no: this.user.mem_no,
        bpl_name: document.querySelector("#bookPlUpdate_popup_title_input")
          .value,
        bpl_intro: document.querySelector("#bookPlUpdate_textarea").value,
        bpl_category: this.updateBpl.bpl_category,
      };

      this.$api
        .post("/mypage/bookPly/updateBpl", reqBody)
        .then((res) => {
          const common = res.common;
          if (common.res_code == 200) {
            alert("북플리 업데이트 성공");
            this.$emit("close");
            window.location.reload(true);
          } else {
            alert("북플리 업데이트 실패");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
@import "../../../assets/css/mypage/popup/updateBookPlyP.css";
</style>
