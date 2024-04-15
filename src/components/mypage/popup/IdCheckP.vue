<template>
  <div class="idCheck_popup">
    <div class="idCheck_popup_main">
      <div class="idCheck_popup_body">
        <div class="idCheck_popup_title">
          <b>※ ID 중복 체크</b>
        </div>
        <div class="idCheck_popup_info">
          아이디는 영문, 숫자 조합으로 최대 16자 이내로 입력해 주세요.
        </div>
        <div class="idCheck_popup_idCheck">
          <input
            class="idCheck_popup_input"
            id="id_check"
            autocomplete="off"
            v-model="user.mem_id"
          />
          <button class="button_charcoal text_white button duplicate_button" @click="checkDuplicate">
            중복 확인
          </button>
          <div
            id="idCheck_popup_errorMessage"
            :style="{ color: errorMessageColor }"
          >
            {{ errorMessage }}
          </div>
        </div>
        <div class="idCheck_popup_foot">
          <button class="button_charcoal text_white button idCheck_button" @click="idCheck_submit">사용하기</button>
          <button
            class="button_charcoal text_white button idCheck_button"
            @click="idCheck_cancel"
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
      originalUserId: "",
      errorMessage: "",
      errorMessageColor: "",
      isIdValid : false,
    };
  },
  methods: {
    // 아이디 중복 체크
    checkDuplicate() {
      const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,16}$/;  // 5~16자, 영어,숫자 포함

      if(this.user.mem_id == ''){
        this.errorMessage = "아이디를 입력해 주세요.";
        this.errorMessageColor = "red";
        this.isIdValid = false;
        return;
      }

      if (!regex.test(this.user.mem_id)) {
        this.errorMessage = "아이디 형식이 맞지 않습니다.";
        this.errorMessageColor = "red";
        this.isIdValid = false;
        return;
      }

      this.$api
        .get(`/mypage/userInfo/idCheck/${this.user.mem_id}`)
        .then((res) => {
          if (res.data.isDuplicate) {
            this.errorMessage = "이미 사용 중인 아이디입니다.";
            this.errorMessageColor = "red";
            this.isIdValid = false;
          } else {
            this.errorMessage = "사용 가능한 아이디입니다.";
            this.errorMessageColor = "green";
            this.isIdValid = true;
          }
        })
        .catch((err) => {
          console.log(err);
          this.errorMessage = "서버 오류가 발생했습니다.";
          this.isIdValid = false;
        });
    },
    // 아이디 중복없을시 userInfo페이지 적용
    idCheck_submit(){
      if(this.isIdValid){
        alert("아이디 등록이 완료되었습니다.");
        this.$emit('close');
      }else{
        alert("입력한 아이디가 조건에 맞지 않습니다. 다시 확인해주세요.");
        return;
      }
    },
    // 아이디 중복체크 팝업 닫기
    idCheck_cancel() {
      if (confirm("취소하시겠습니까?")) {
        this.user.mem_id = this.originalUserId;
        this.$emit("close");
      }
    },
  },
  mounted() {
    this.originalUserId = this.user.mem_id;    
  },
};
</script>

<style scoped>
@import "../../../assets/css/mypage/popup/idCheckP.css";
</style>
