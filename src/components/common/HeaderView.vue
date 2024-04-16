<template>
  <div class=header>
    <div class=navbar>
      <button class="imgbtn navbar_logo" @click="goMain">
        <img src="../../assets/images/logo_v.png" alt="LOGO">
      </button>
      <div class="vertical_line">
      </div>
      <div class="navbar_menu">
        <ul class="navbar_menu_item">
          <li><a href="#">도서대여/예약</a></li>
          <li><a href="#">도서신청</a></li>
          <li><a href="#">도서마당</a></li>
          <li><a href="#">고객센터</a></li>
          <li><a href="#">사서페이지</a></li>
        </ul>
      </div>
      <div class=navbar_icons>
        <button class="imgbtn">
          <img src="@/assets/images/cart_icon.svg" alt="cart_icon">
        </button>
        <button class="imgbtn">
          <img src="@/assets/images/user_icon.svg" alt="user_icon">
        </button>
      </div>
    </div>
    <hr>

    <div class=search>
      <input class="search_input" type="text" placeholder="검색어를 입력하여 도서를 찾아보세요."/>
      <button class="imgbtn btn_search" type="submit">
        <img src="@/assets/images/search_btn_icon.svg" alt="search_btn_icon">
      </button>
    </div>

  </div>
</template>

<script>
import api from "@/api/axios";
import { useUserStore } from '@/stores/user.js';
export default {
  data(){
    return{
      user: useUserStore().getUser,

      largeMenus: {},
      smallMenus: {}
    }
  },

  created() {
    // 필요한 메뉴 목록을 받아오기
    let level = 10; // 전체 조회 조건 부여
    api.get(`/sidebar/largeMenu/${level}`)
      .then(res => {
        if (res.common.res_code == 200) { // 응답성공
          this.largeMenus = res.data.menuList;
        } else {
          console.log("HeaderView sidebar/largeMenu 응답실패");
        }
      })
  },
  
  methods:{
    goMain() { this.$router.push({ name: 'Main' }) }, // 메인으로
    goMenu() { // 선택한 메뉴 화면으로 이동

    }
  }
}
</script>

<style>
@import "../../assets/css/common/header.css";
</style>