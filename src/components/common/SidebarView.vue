<template>
  <div id="sidebar">
    <div id="sidebar_title">{{ pageName }}</div>
    <div class="sidebar_menu" v-for="largeMenu in largeMenus" :key="largeMenu">
      <div class="sidebar_menu_box" @click="goMenu(largeMenu.menu_link, largeMenu.menu_no)" :class="{'menu_select': largeMenu.menu_link == currentPath}">
        <div class="sidebar_menu_img"><img :src="require(`../../assets/images/${largeMenu.menu_icon}`)"></div>
        <div class="sidebar_menu_text">{{ largeMenu.menu_name }}</div>
      </div>
      <div class="sidebar_menu_sub" v-show="largeMenu.menu_no == showSubMenu">
        <div class="sidebar_menu_box" v-for="smallMenu in filterSmallMenu(largeMenu.menu_no)" :key="smallMenu"
          @click="goMenu(smallMenu.menu_link, smallMenu.menu_no)" :class="{'menu_select': smallMenu.menu_link == this.currentSubPath}">
          <div class="sidebar_menu_text">{{ smallMenu.menu_sub_name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "@/api/axios";

import { useUserStore } from '@/stores/user';
export default {
  data() {
    return {
      largeMenus: {},
      smallMenus: {},

      showSubMenu: null, // 선택된 대메뉴 중 서브메뉴가 있는 경우
      currentPath: null, // 현재 보여지고 있는 대메뉴 링크
      currentSubPath: null, // 현재 보여지고 있는 소메뉴 링크
      
      levelList: [{"3":"도서마당 페이지"}, {"4":"고객센터 페이지"}, {"9":"관리자 페이지"}, {"8":"마이 페이지"}],
      pageName: null
    }
  },

  methods: {
    async getLargeMenu(level) {
      return api.get(`/sidebar/largeMenu/${level}`)
    },

    async getSmallMenu() {
      return api.get(`/sidebar/smallMenu`)
    },

    filterSmallMenu(menuNo) { // 소메뉴 목록 필터링
      let result = {};
      let count = 0;
      Array.from(this.smallMenus).forEach(smallMenu => {
        if(smallMenu.menu_no == menuNo) {
          result[count] = smallMenu;
          count++;
        }
      });

      return result;
    },

    // 선택한 메뉴로 바꾸기
    async changeMenu(menuLink, menuNo, level) {
      menuLink = menuLink.substr(1);
      this.currentPath = menuLink;

      for(const page of this.levelList) {
        if(page[level] != null || undefined) {
          this.pageName = page[level];
        }
      }

      let haveSub = false;
      this.smallMenus.forEach(smallMenu => {
        if(menuLink == smallMenu.menu_link) {
          haveSub = true; // 서브메뉴를 가지고 있음
          return;
        }
      });
     
      if(haveSub) {
        this.currentPath = null;
        this.showSubMenu = menuNo; // 서브메뉴를 보일지말지
        this.currentSubPath = menuLink; // 어떤 서브메뉴를 선택표시할지
      } else {
        this.showSubMenu = null;
        this.currentSubPath = null;
      }
    },

    goMenu(menuLink, menuNo) { // 선택한 메뉴 화면으로 이동
      if(menuLink != 'Logout'){
        this.$router.push({path: `${menuLink}`, query: {menuNo: `${menuNo}`}});
      } else{
        const userStore = useUserStore();
        userStore.setUser({});
        this.$router.push({ name: "Main" });
      }
    },

    // 다른 화면에서 호출용
    async setCurrentMenu(level, menuLink, menuNo) {
      let largeResult = await this.getLargeMenu(level);
      if (largeResult.common.res_code == 200) { // 응답성공
        this.largeMenus = largeResult.data.menuList;
      } else { // 응답실패
        console.log("Sidebar sidebar/largeMenu 응답실패");
      }

      let smallResult = await this.getSmallMenu();
      if (smallResult.common.res_code == 200) { // 응답성공
        this.smallMenus = smallResult.data.menuList;
      } else { // 응답실패
        console.log("Sidebar sidebar/smallMenu 응답실패");
      }

      await this.changeMenu(menuLink, menuNo, level);
    }
  }
}
</script>
<style>
  @import "../../assets/css/common/index.css";
  @import "../../assets/css/common/sidebar.css";
</style>