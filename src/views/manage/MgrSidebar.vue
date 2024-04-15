<!-- TODO 일단 이렇게 테스트하고 나중에 Component로 빼서 사용 -->
<template>
  <div id="sidebar">
    <div id="sidebar_title">관리자 페이지</div>
    <div class="sidebar_menu" v-for="largeMenu in largeMenus" :key="largeMenu">
      <div class="sidebar_menu_box" @click="goLargeMenu(largeMenu.menu_link, largeMenu.menu_no)" :class="{'menu_select': largeMenu.menu_link == currentPath}">
        <div class="sidebar_menu_img"><img :src="require(`../../assets/images/${largeMenu.menu_icon}`)"></div>
        <div class="sidebar_menu_text">{{ largeMenu.menu_name }}</div>
      </div>
      <div class="sidebar_menu_sub" v-show="largeMenu.menu_no == showSubMenu">
        <div class="sidebar_menu_box" v-for="smallMenu in filterSmallMenu(largeMenu.menu_no)" :key="smallMenu"
          @click="goSmallMenu(smallMenu.menu_link, smallMenu.menu_no)" :class="{'menu_select': smallMenu.menu_link == this.currentSubPath}">
          <div class="sidebar_menu_text">{{ smallMenu.menu_sub_name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "@/api/axios";
export default {
  data() {
    return {
      largeMenus: {},
      smallMenus: {},

      showSubMenu: null, // 선택된 대메뉴 중 서브메뉴가 있는 경우
      currentPath: null, // 현재 보여지고 있는 대메뉴 링크
      currentSubPath: null, // 현재 보여지고 있는 소메뉴 링크
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
    async changeMenu(menuLink, menuNo) {
      menuLink = menuLink.substr(1);
      this.currentPath = menuLink;

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
        console.log(this.currentSubPath);
        console.log(this.showSubMenu);
      } else {
        this.showSubMenu = null;
        this.currentSubPath = null;
      }
    },

    goLargeMenu(menuLink, menuNo) { // 선택한 대메뉴 화면으로 이동
      this.$router.push({path: `${menuLink}`, query: {menuNo: `${menuNo}`}});
    },

    goSmallMenu(menuLink, menuNo) { // 선택한 소메뉴로 이동
      // this.currentSubPath = menuLink;
      // console.log(this.currentSubPath);
      this.$router.push({path: `${menuLink}`, query: {menuNo: `${menuNo}`}});
    },

    // 다른 화면에서 호출용
    async setCurrentMenu(level, menuLink, menuNo) {
      let largeResult = await this.getLargeMenu(level);
      if (largeResult.common.res_code == 200) { // 응답성공
        this.largeMenus = largeResult.data.menuList;
      } else { // 응답실패
        console.log("MgrSidebar sidebar/largeMenu 응답실패");
      }

      let smallResult = await this.getSmallMenu();
      if (smallResult.common.res_code == 200) { // 응답성공
        this.smallMenus = smallResult.data.menuList;
      } else { // 응답실패
        console.log("MgrSidebar sidebar/smallMenu 응답실패");
      }

      await this.changeMenu(menuLink, menuNo);
    }
  }
}
</script>
<style>
  @import "../../assets/css/common/index.css";
  @import "../../assets/css/manage/manage.css";
</style>