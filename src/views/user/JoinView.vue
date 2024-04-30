<template>
  <div class="join">
    <button class="imgbtn logo_h" @click="goMain">
      <img src="../../assets/images/logo_h.png" alt="LOGO">
    </button>
    <div class="input_form w20rem">
      <div class="con">
        <input type="text" placeholder="이름을 입력하세요." v-model="name">
        <div class="input-err" :style="{ display: isShowNameErrMsg ? 'block' : 'none'}">
          이름을 확인하세요.
        </div>
      </div>
      <div class="con">
        <div class="flex-sb">
          <input class="wCalc-20" type="text" placeholder="아이디를 입력하세요." v-model="id">
          <button class="btn_charcoal rad10 wCalc-80 h1rem f0-8rem" @click="checkDuplicate()">중복확인</button>
        </div>
        <div class="input-err" :style="{ display: isShowIdErrMsg ? 'block' : 'none'}">
          아이디를 확인하세요.
        </div>
      </div>
      <div class="con">
        <input type="password" placeholder="비밀번호를 입력하세요.">
        <div class="input-err" :style="{ display: isShowPasswordErrMsg ? 'block' : 'none'}">
          비밀번호를 확인하세요.
        </div>
      </div>
      <div class="con">
        <input type="text" placeholder="생년월일 8자리를 입력하세요.">
        <div class="input-err" :style="{ display: isShowBirthErrMsg ? 'block' : 'none'}">
          생년월일을 확인하세요.
        </div>
      </div>
      <div class="con">
        <input type="email" placeholder="이메일주소를 입력하세요.">
        <div class="input-err" :style="{ display: isShowEmailErrMsg ? 'block' : 'none'}">
          이메일 주소를 확인하세요.
        </div>
      </div>
      <div class="con">
        <input type="text" placeholder="휴대폰 번호를 입력하세요.">
        <div class="input-err" :style="{ display: isShowPhoneErrMsg ? 'block' : 'none'}">
          휴대폰 번호를 확인하세요.
        </div>
      </div>
      <button class="btn_charcoal rad20 mt1rem" @click="joinCheck()">회원가입</button>
    </div>
    <div class="flex-sb mt1rem w13-5rem f0-8rem">
      <img src="../../assets/images/user_icon2.svg" alt="user_icon2">
      <div class="gray">이미 계정이 있으신가요?</div>
      <router-link to="/Login" class="underline_a">로그인</router-link>
    </div>
  </div>
</template>
<script>
import api from "@/api/axios";
import cUtil from "@/utils/commonUtil";
export default {
  data() {
    return {
      id: '',
      name: '',

      isShowNameErrMsg: false,
      isShowIdErrMsg: false,
      isShowBirthErrMsg: false,
      isShowEmailErrMsg: false,
      isShowPhoneErrMsg: false,
      isShowPasswordErrMsg: false
    }
  },

  methods: {
    goMain() { // 메인으로
      this.$router.push({ name: 'Main' })
    },

    checkDuplicate() { // 중복체크
      if(this.id == '') {
        return;
      }

      api.get(`/user/duplicate/${this.id}`)
        .then(res => {
          if (res.common.res_code == 200) { // 응답성공
            console.log(res.data.userInfo);
          } else { // 응답실패
            console.log("BookListView book/bookCount 응답실패");
          }
        })
    },

    joinCheck() { // 회원가입 유효성 체크
      this.isShowNameErrMsg = cUtil.checkName(this.name);
      this.isShowIdErrMsg = cUtil.checkId(this.id);
    }
  }
}
</script>
<style>
@import "../../assets/css/join.css";
</style>