<!-- 소셜 로그인 등록 화면 -->
<template>
  <div class="container">
    <Sidebar ref="Sidebar"></Sidebar>

    <div class="main_container">
      <div class="m_show_box" style="height: 100%;">
        <div class="m_show_box_title">소셜 로그인 등록</div>
        <div class="inline_blank12"></div>
        <div class="social mt1rem" style="flex-direction: column; width: 100%;">
          <div class="imgbtn social_btn">
            <img src="@/assets/images/sns_google.svg" alt="google_login" v-on:click="setGoogleLogin()">
            <div style="width: 200px; cursor: pointer;" v-on:click="setGoogleLogin()">구글 로그인 등록</div>
            <div style="margin-right: 15px; font-weight: 600;">등록 상태:</div>
            <div>등록 안됨</div>
          </div>
          <div class="imgbtn social_btn">
            <img src="@/assets/images/sns_kakao.svg" alt="kakao_login" v-on:click="setKakaoLogin()">
            <div style="width: 200px; cursor: pointer;" v-on:click="setKakaoLogin()">카카오 로그인 등록</div>
            <div style="margin-right: 15px; font-weight: 600;">등록 상태:</div>
            <div>등록 안됨</div>
          </div>
          <div class="imgbtn social_btn">
            <img src="@/assets/images/sns_naver.svg" alt="naver_login">
            <div style="width: 200px; cursor: pointer;">네이버 로그인 등록</div>
            <div style="margin-right: 15px; font-weight: 600;">등록 상태:</div>
            <div>등록 안됨</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "@/api/axios";
import Sidebar from "../../components/common/SidebarView.vue";
export default {
  components: {
    Sidebar
  },

  methods: {
    setGoogleLogin() { // 구글로그인 정보 등록
      api.get(`/mypage/userInfo/googleLogin`)
      .then(res => {
        if (res.common.res_code == 200) {
          // 구글로그인 팝업창 띄우기
          window.open(res.data.google, "Google Login", "width=500, height=600, scrollbars=auto");
        } else {
          console.log("SocialView mypage/userInfo/googleLogin 응답실패");
        }
      });
    },

    setKakaoLogin() { // 카카오로그인 정보 등록
      api.get(`/mypage/userInfo/kakaoLogin`)
      .then(res => {
        if (res.common.res_code == 200) {
          // 카카오로그인 팝업창 띄우기
          console.log(res.data.kakao);
        } else {
          console.log("SocialView mypage/userInfo/kakaoLogin 응답실패");
        }
      });
    }
  }
}
</script>
<style>
@import "../../assets/css/common/index.css";
.social_btn {
  display: flex;
  width: 50%;
  align-items: center;
  margin: 20px 0px 20px 10px;
}
.social_btn > img {
  margin-right: 15px;
  cursor: pointer;
}
</style>