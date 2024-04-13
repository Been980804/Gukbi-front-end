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
import { useUserStore } from '@/stores/user.js';

export default {
  data(){
    return{
      user: useUserStore().getUser
    }
  },
  
  methods:{
    // 메인으로
    goMain() {
      this.$router.push({ name: 'Main' })
    }
  }
}
</script>

<style>
@import "../../assets/css/common/header.css";
@import "../../assets/css/common/header.css";
</style>