<template>
  <div class="pwdUpdate_popup">
    <div class="pwdUpdate_popup_main">
      <div class="pwdUpdate_popup_body">
        <div class="pwdUpdate_popup_title">
          <b>비밀번호 변경을 원하시면 새로운 비밀번호를 입력하세요.</b>
        </div>

        <div class="pwd">
          <div class="pwd_box">현재 비밀번호</div>
          <div class="pwd_input">
            <input type="password" v-model="nowPwd" />
          </div>
          <div class="pwd_noti"></div>
        </div>
        <div class="pwd">
          <div class="pwd_box">새 비밀번호</div>
          <div class="pwd_input">
            <input type="password" v-model="newPwd" />
          </div>
          <div class="pwd_noti">※ 영문,숫자,특수기호 조합 8~18자리</div>
        </div>
        <div class="pwd">
          <div class="pwd_box">새 비밀번호 확인</div>
          <div class="pwd_input">
            <input type="password" v-model="newPwdCheck" />
          </div>
          <div class="pwd_noti">※ 영문,숫자,특수기호 조합 8~18자리</div>
        </div>

        <div class="pwdUpdate_popup_footer">
          <div id="error_text" :style="{ display: errorDisplay }">
            {{ errorMessage }}
          </div>
          <div class="pwdUpdate_btnBox">
          <button
            class="button_charcoal text_white button pwdUpdate_button"
            @click="changePwd"
          >
            확인
          </button>
          <button
            class="button_charcoal text_white button pwdUpdate_button"
            @click="pwdUpdate_cancel"
          >
            취소
          </button>
          </div>
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
      nowPwd: "",
      currentPwd: "",
      newPwd: "",
      newPwdCheck: "",
      errorMessage: "",
      errorDisplay: "none",
    };
  },
  created() {
    this.getCurrentPwd();
  },
  methods: {
    // 현재 로그인되어있는 회원의 비밀번호 가져오기(보안상의 이유로 삭제함)
    getCurrentPwd() {
      this.$api
        .get(`/mypage/userInfo/getCurrentPwd/${this.user.mem_no}`)
        .then((res) => {
          const common = res.common;
          if (common.res_code == 200) {
            this.currentPwd = res.data.currentPwd;
          } else {
            alert("실패");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 비밀번호 수정
    changePwd() {
      const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,18}$/;

      if (!this.nowPwd) {
        this.errorMessage = "현재 비밀번호를 입력해주세요.";
        this.errorDisplay = "block";
        return;
      }
      if (!this.newPwd) {
        this.errorMessage = "새 비밀번호를 입력해주세요.";
        this.errorDisplay = "block";
        return;
      }
      if (!this.newPwdCheck) {
        this.errorMessage = "새 비밀번호를 확인해주세요.";
        this.errorDisplay = "block";
        return;
      }
      if (this.nowPwd != this.currentPwd) {
        this.errorMessage = "현재 비밀번호가 일치하지 않습니다.";
        this.errorDisplay = "block";
        return;
      }
      if (this.newPwd != this.newPwdCheck) {
        this.errorMessage =
          "입력하신 새 비밀번호와 확인이 서로 다릅니다. 동일한 비밀번호를 입력해주세요.";
        this.errorDisplay = "block";
        return;
      }
      if (this.currentPwd == this.newPwd) {
        this.errorMessage =
          "현재 비밀번호와 새 비밀번호는 같을 수 없습니다. 다른 비밀번호를 입력해주세요.";
        this.errorDisplay = "block";
        return;
      }
      if(!regex.test(this.newPwd)){
        this.errorMessage =
          "비밀번호는 8-18자리, 특수문자,영어,숫자를 포함해야 합니다.";
        this.errorDisplay = "block";
        return;
      }

      this.$api.post("/mypage/userInfo/pwdUpdate", {
        mem_no: this.user.mem_no,
        newPwd: this.newPwd,
      }).then(res => {
        const common = res.common;
        if(common.res_code == 200){
          alert('비밀번호가 수정되었습니다.');
          this.$emit('close');
        }else{
          alert('비밀번호 수정을 실패하였습니다.');
        }
      })
      .catch(err => {
        console.log(err);
      })
    },
    // 비밀번호 수정 팝업 닫기
    pwdUpdate_cancel() {
      if (confirm("취소하시겠습니까?")) {
        this.$emit("close");
      }
    },
  },
};
</script>

<style scoped>
/* @import "../../../assets/css/mypage/popup/pwdUpdateP.css"; */
</style>
