<template>
  <div class="bookPlCreate_popup">
    <div class="bookPlCreate_popup_main">
      <div class="bookPlCreate_popup_body">
        <div class="bookPlCreate_popup_title">
          <input
            type="text"
            id="bookPlCreate_popup_title_input"
            placeholder="북플리 제목을 입력해주세요."
          />
        </div>
        <div class="bookPlCreate_popup_content">
          <textarea
            name="textarea"
            cols="30"
            rows="10"
            placeholder="북플리 소개글을 입력하세요."
            maxlength="250"
            id="bookPlCreate_textarea"
          ></textarea>
        </div>
        <div class="bookPlCreate_popup_category">
          <input name="prefer" type="radio" id="prefer01" value="01" />
          <label for="prefer01">자기계발</label>
          <input name="prefer" type="radio" id="prefer02" value="02" />
          <label for="prefer02">문학</label>
          <input name="prefer" type="radio" id="prefer03" value="03" />
          <label for="prefer03">건강/스포츠</label>
          <input name="prefer" type="radio" id="prefer04" value="04" />
          <label for="prefer04">가정</label>
          <input name="prefer" type="radio" id="prefer05" value="05" />
          <label for="prefer05">종교</label>
          <input name="prefer" type="radio" id="prefer06" value="06" />
          <label for="prefer06">사회/역사</label>
          <input name="prefer" type="radio" id="prefer07" value="07" />
          <label for="prefer07">과학/기술</label>
          <input name="prefer" type="radio" id="prefer08" value="08" />
          <label for="prefer08">경제</label>
          <input name="prefer" type="radio" id="prefer09" value="09" />
          <label for="prefer09">예술</label>
          <input name="prefer" type="radio" id="prefer10" value="10" />
          <label for="prefer10">기타</label>
        </div>
        <div class="bookPlCreate_buttonBox">
          <button
            class="button button_charcoal text_white bplCreate_btn"
            @click="bplCreate_submit"
          >
            확인
          </button>
          <button
            class="button button_charcoal text_white bplCreate_btn"
            @click="bplCreate_cancel"
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
  data() {
    return {
      user: useUserStore().getUser,
      formData: {
        bpl_name: "",
        mem_no: "",
        bpl_intro: "",
        bpl_category: "",
      },
    };
  },
  methods: {
    // 북플리 생성 팝업 닫기
    bplCreate_cancel() {
      if (confirm("취소하시겠습니가?")) {
        this.$emit("close");
      }
    },
    // 북플리 생성
    bplCreate_submit() {
      this.formData.bpl_name = document.querySelector(
        "#bookPlCreate_popup_title_input"
      ).value;
      this.formData.bpl_intro = document.querySelector(
        "#bookPlCreate_textarea"
      ).value;
      this.formData.bpl_category = document.querySelector(
        'input[name="prefer"]:checked'
      ).value;

      this.formData.mem_no = this.user.mem_no;

      this.$api
        .post("/mypage/bookPly/createBpl", this.formData)
        .then((res) => {
          const common = res.common;
          if (common.res_code == 200) {
            alert("북플리 생성 성공");
            this.$emit("close");
            window.location.reload(true);
          } else {
            alert("북플리 생성 실패");
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
@import "../../../assets/css/mypage/popup/createBookPlyP.css";
</style>
