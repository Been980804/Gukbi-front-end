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
            <img src="@/assets/images/sns_google.svg" alt="google_login">
            <div style="width: 200px;">구글 로그인 등록</div>
            <div style="margin-right: 15px; font-weight: 600;">등록 상태:</div>
            <div>등록 안됨</div>
          </div>
          <div class="imgbtn social_btn">
            <img src="@/assets/images/sns_kakao.svg" alt="kakao_login">
            <div style="width: 200px;">카카오 로그인 등록</div>
            <div style="margin-right: 15px; font-weight: 600;">등록 상태:</div>
            <div>등록 안됨</div>
          </div>
          <div class="imgbtn social_btn">
            <img src="@/assets/images/sns_naver.svg" alt="naver_login">
            <div style="width: 200px;">네이버 로그인 등록</div>
            <div style="margin-right: 15px; font-weight: 600;">등록 상태:</div>
            <div>등록 안됨</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Sidebar from "../../components/common/SidebarView.vue";
export default {
  components: {
    Sidebar
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
}
</style>