<template>
  <div id="sidebar">
    <div id="sidebar_title">마이 페이지</div>
    <div class="sidebar_menu" v-for="largeMenu in largeMenus" :key="largeMenu">
      <div
        class="sidebar_menu_box"
        @click="goLargeMenu(largeMenu.menu_link, largeMenu.menbu_no)"
        :class="{ menu_select: largeMenu.menu_link == currentPath }"
      >
        <div class="sidebar_menu_img">
          <img :src="require(`../../assets/images/${largeMenu.menu_icon}`)" />
        </div>
        <div class="sidebar_menu_text">{{ largeMenu.menu_name }}</div>
      </div>
      <div class="sidebar_menu_sub" v-show="largeMenu.menu_no == showSubMenu">
        <div
          class="sidebar_menu_box"
          v-for="smallMenu in filterSmallMenu(largeMenu.menu_no)"
          :key="smallMenu"
          @click="goSmallMenu(smallMenu.menu_link, smallMenu.menu_sub_no)"
          :class="{ menu_select: smallMenu.menu_link == this.currentSubPath }"
        >
          <div class="sidebar_menu_text">{{ smallMenu.menu_sub_name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@/stores/user.js";
import api from "@/api/axios";

export default {
  data() {
    return {
      user: useUserStore().getUser,
      largeMenus: {},
      smallMenus: {},
      level: "8",

      showSubMenu: null,
      currentPath: null,
      currentSubPath: null,
    };
  },

  methods: {
    async getLargeMenu(level) {
      return api.get(`/myPageSidebar/largeMenu/${level}`);
    },

    async getSmallMenu() {
      return api.get(`/myPageSidebar/smallMenu`);
    },

    filterSmallMenu(menuNo) {
      let result = {};
      let count = 0;
      Array.from(this.smallMenus).forEach((smallMenu) => {
        // 대메뉴에 해당되는 소메뉴 result에 저장
        if (smallMenu.menu_no == menuNo) {
          result[count] = smallMenu;
          count++;
        }
      });

      return result;
    },

    async changeMenu(menuLink, menuNo) {
      menuLink = menuLink.substr(1);
      this.currentPath = menuLink;

      let haveSub = false;
      this.smallMenus.forEach((smallMenu) => {
        if (menuLink == smallMenu.menu_link) {
          haveSub = true;
          return;
        }
      });

      if(haveSub){
        this.currentPath = null;
        this.showSubMenu = menuNo;
        this.currentSubPath = menuLink;
      }else{
        this.showSubMenu = null;
        this.currentSubPath = null;
      }
    },

    goLargeMenu(menuLink, menuNo){
      this.$router.push({path: `${menuLink}`, query: {menuNo: `${menuNo}`}});
    },

    goSmallMenu(menuLink, menuNo){
      if(menuNo.equals('logout')){
        const userStore = useUserStore();
        userStore.setUser({});
        this.$router.push({ name: "Main" });
      } else{     
         this.$router.push({path: `${menuLink}`, query: {menuNo: `${menuNo}`}});
      }

    },

    async setCurrentMenu(level, menuLink, menuNo){
      let largeResult = await this.getLargeMenu(level);
      if(largeResult.common.res_code == 200){
        this.largeMenus = largeResult.data.menuList;
      }else{
        alert('실패');
      }

      let smallResult = await this.getSmallMenu();
      if(smallResult.common.res_code == 200){
        this.smallMenus = smallResult.data.menuList;

        this.smallMenus.push({
          menu_sub_no : 'logout',
          menu_no : 'menu000001',
          menu_sub_name : '로그아웃',
          menu_link : '',
        });
      }else{
        alert('실패');
      }

      await this.changeMenu(menuLink, menuNo);
    }
  },
};
</script>

<style>
@import "../../assets/css/common/sidebar.css";
</style>
