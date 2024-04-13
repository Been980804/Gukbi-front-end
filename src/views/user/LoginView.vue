<template>
  <div class="login">
    <button class="imgbtn logo_h" @click="goMain">
      <img src="../../assets/images/logo_h.png" alt="LOGO">
    </button>
    <div class="input_form w20rem h9-5rem">
      <div class="con">
        <input type="text" v-model="loginData.id" maxlength="16" placeholder="아이디를 입력하세요." @keyup.enter="login"> 
      </div>
      <div class="con">
        <input type="password" v-model="loginData.pwd" maxlength="18" placeholder="비밀번호를 입력하세요." @keyup.enter="login">
      </div>
      <button class="btn_charcoal rad20 mt1rem" @click="login"><span>로그인</span></button>
    </div>
    <div class="hr-text">다른 계정으로 간편 로그인</div>
      
    <div class="social mt1rem">
      <button class="imgbtn">
        <img src="@/assets/images/sns_google.svg" alt="google_login">
      </button>
      <button class="imgbtn">
        <img src="@/assets/images/sns_kakao.svg" alt="kakao_login">
      </button>
      <button class="imgbtn">
        <img src="@/assets/images/sns_naver.svg" alt="naver_login">
      </button>
    </div>

    <div class="flex-sb w12-5rem f0-8rem mt1rem">
      <img src="../../assets/images/user_icon2.svg" alt="user_icon2">
      <div class="gray">계정이 없으신가요?</div>
      <router-link to="/Join" class="underline_a">회원가입</router-link>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user';

export default {
  // name: 'login',
  data() {
    return {
      loginData: {
        id: '',
        pwd: '',
      }
    }
  },

  methods: {

    // 메인으로
    goMain() {
      this.$router.push({ name: 'Main' })
    },
    
    /**
     * 로그인
     */
    login() {
      if((this.loginData.id.trim().length == 0) || (this.loginData.pwd.trim().length == 0)) {
        alert('아이디 또는 비밀번호를 입력하세요.');
        return;
      }

      const params = {
        id : this.loginData.id,
        pwd : this.loginData.pwd,
      }

      this.$api
      .post('/user/login', params)
      .then(res => {
        const common = res.common; //common : 응답코드, 응답메시지
        if(common.res_code == 200) {
          const data = res.data; //data : 응답데이터
          const userStore = useUserStore();
          userStore.setUser(data.userInfo);
          this.$router.push({ name: 'Main' })
        } else {
          this.loginData.id = '';
          this.loginData.pwd = '';
          alert('아이디 또는 비밀번호가 잘못 입력되었습니다.');
        }
      })

    }
  },
}
</script>

<style>
@import "../../assets/css/login.css";
</style>