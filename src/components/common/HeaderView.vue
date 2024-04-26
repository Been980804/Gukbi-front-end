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
          <li v-for="(navMenu, i) in navMenus" :key="i" :ref="`${i}`" @mouseover="showSubMenu(i)" @mouseleave="hideSubMenu(i)">
            <a href="#">{{ navMenu }}</a>
            <ul>
              <template v-for="menu in largeMenus" :key="menu">
                <li v-if="menu.menu_level == menuLevels[i]" @click="goMenu(menu.menu_link, menu.menu_no, menu.menu_name)"><a href="#">{{ menu.menu_name }}</a></li>
              </template>
            </ul>
          </li>
        </ul>
      </div>
      <div class="navbar_icons">
        <button class="imgbtn">
          <img src="@/assets/images/cart_icon.svg" alt="cart_icon">
        </button>
        <button class="imgbtn" @mouseleave="hideMyMenu()">
          <img src="@/assets/images/user_icon.svg" alt="user_icon" @click="showMyMenu()">
          <ul ref="userIcon">
            <template v-for="menu in userMenus" :key="menu">
              <li @click="goMyMenu(menu)"><a href="#">{{ menu }}</a></li>
            </template>
          </ul>
        </button>
      </div>
    </div>
    <hr>

    <div class=search>
      <input class="search_input" type="text" placeholder="검색어를 입력하여 도서를 찾아보세요." @keyup.enter="setSearchText($event)"/>
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

      navMenus: ["도서대여/예약", "도서신청", "도서마당", "고객센터", "사서페이지"],
      menuLevels: [1, 2, 3, 4, 9],

      largeMenus: {},
      userMenus: []
    }
  },

  created() {
    // 필요한 메뉴 목록을 받아오기
    let level = 10; // 전체 조회 조건 부여
    api.get(`/sidebar/largeMenu/${level}`)
      .then(res => {
        if (res.common.res_code == 200) { // 응답성공
          this.largeMenus = res.data.menuList;
          for(const myMenu of this.largeMenus) {
            if(myMenu.menu_level == 8) {
              this.userMenus.push(myMenu.menu_name);
            }
          }
          // 로그인 상태인지 확인해서 분류
          if(this.user.mem_id != null || undefined || '') {
            this.userMenus.push("로그아웃");
          }
        } else {
          console.log("HeaderView sidebar/largeMenu 응답실패");
        }
      })
  },
  
  methods:{
    goMain() { this.$router.push({ name: 'Main' }) }, // 메인으로
    goMenu(menuLink, menuNo, menuName) { this.$router.push({path: `${menuLink}`, query: {menuNo: `${menuNo}`, menuName: `${menuName}`}}); }, // 선택한 메뉴 화면으로 이동
    showSubMenu(num) { this.$refs[num][0].children[1].style.display = 'block'; },
    hideSubMenu(num) { this.$refs[num][0].children[1].style.display = 'none'; },
    showMyMenu() { // 사용자 아이콘 클릭 이벤트
      this.user = useUserStore().getUser;
      if(this.user.mem_id == null || undefined || '') {
        // 로그인 정보가 없을 경우
        this.$router.push({ path: '/Login' });      
      } else {
        // 서브메뉴 보이기
        if(this.$refs.userIcon.style.display == 'block') {
          this.$refs.userIcon.style.display = 'none';
          this.userMenus = this.userMenus.filter(item => item != "로그아웃");
        } else {
          this.$refs.userIcon.style.display = 'block';
          this.userMenus.push("로그아웃");
        }
      }
    },

    hideMyMenu() {
      this.$refs.userIcon.style.display = 'none';
      this.userMenus = this.userMenus.filter(item => item != "로그아웃");
    },

    goMyMenu(menuName) {
      if(menuName == "로그아웃") {
        this.logout();
      } else {
        for(const menu of this.largeMenus) {
          if(menuName == menu.menu_name) {
            this.$router.push({path: `${menu.menu_link}`, query: {menuNo: `${menu.menu_no}`, menuName: `${menu.menu_mame}`}});
          }
        }
      }
    },

    setSearchText(event) {
      this.$router.push({ path: '/Search', query: { searchText: `${event.target.value}` }});      
    },

    logout() {
      const userStore = useUserStore();
			userStore.setUser({});
      this.$router.push({ name: 'Main' })
      window.location.reload(true);
    }
  }
}
</script>

<style>
@import "../../assets/css/common/header.css";
</style>