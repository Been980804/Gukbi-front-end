<template>
  <div id="sidebar">
    <div id="sidebar_title">마이 페이지</div>
    <div v-for="(menu, index) in menus" :key="index" class="sidebar_menu">
      <div class="sidebar_menu_box" :class="{ menu_selected : menu.open }" @click="showSubMenu(index)">
        <div class="sidebar_menu_img">
          <img v-bind:src="menu.imgSrc" v-bind:alt="menu.alt" />
        </div>
        <div class="sidebar_menu_text">{{ menu.text }}</div>
      </div>
      <div v-if="menu.open" class="sidebar_menu_sub">
        <div
          v-for="(subMenu, subIndex) in menu.subMenus"
          :key="subIndex"
          class="sidebar_menu_box"
          @click="clickSubMenu(menu,subMenu)"
        >
          <div class="sidebar_menu_img">
            <img v-bind:src="subMenu.imgSrc" v-bind:alt="subMenu.alt" />
          </div>
          <div class="sidebar_menu_text">{{ subMenu.text }}</div>
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
      menus: [
        {
          text:"회원 정보",
          imgSrc:require("../../assets/images/menu-user.svg"),
          alt:"menu-user",
          open: false,          
          subMenus:[
            { text: "회원정보 조회.수정", action:{type:"page",name:"UserInfo"}},
            { text: "간편 로그인 연동", action:{type:"page", name:"SocialLogin"}},
            { text: "로그아웃", action:{name:"logout"}}
          ]
        },
        {
          text:"대여 내역",
          imgSrc:require("../../assets/images/menu-book-alt.svg"),
          alt:"menu-book-alt",
          open:false,          
          subMenus:[
            {text:"대여/예약 도서 조회", action:{type:"page",name:"RentReservation"}},
            {text:"대여 내역 조회", action: {type: "page", name: "RentedList"}}
          ]
        },
        {
          text:"희망도서 신청",
          imgSrc:require("../../assets/images/menu-book-alt.svg"),
          alt:"menu-book-alt",
          action:{type:"page", name:"HopeBook"},
          open:false          
        },
        {
          text:"북플리",
          imgSrc:require("../../assets/images/menu-duplicate.svg"),
          alt:"menu-duplicate",
          open:false,         
          subMenus:[
            {text:"북플리 조회/수정", action:{type:"page", name:"MyBookPly"}}
          ]
        },
        {
          text: "개별 문의 내역",
          imgSrc:require("../../assets/images/menu-duplicate.svg"),
          alt:"menu-duplicate",
          open:false,
          action:{type:"page",name:"MyInquiry"}
        },
        {
          text: "도서 거래",
          imgSrc:require("../../assets/images/menu-duplicate.svg"),
          alt:"menu-duplicate",
          open:false,
          action:{type:"page",name:"MyBookTrade"}          
        }
      ],
    };
  },

  methods: {   
    // 서브메뉴가 없으면 페이지 이동, 있으면 서브메뉴 열기
    showSubMenu(index){
      const menu =this.menus[index];

      this.menus.forEach((item,idx) => {
        if( idx !== index){
          item.open = false;
        }
      })

      if(menu.subMenus && menu.subMenus.length >0){
        menu.open = !menu.open;
      }else{
        this.$router.push({name:menu.action.name});
      }
    },
    // 서브메뉴누르면 페이지 이동
    clickSubMenu(menu, subMenu){
      if(subMenu.action.type === "page"){
        this.$router.push({name: subMenu.action.name});
        menu.open = false;
      } else if(subMenu.action.name === "logout"){
        this.logout();
      }
    },
    // 로그아웃
    logout() {
      const userStore = useUserStore();
      userStore.setUser({});
      this.$router.push({ name: "Main" });
    },
  },
};
</script>

<style>
/* @import "../../assets/css/common/sidebar.css"; */
</style>
