<!-- TODO 일단 이렇게 테스트하고 나중에 Component로 빼서 사용 -->
<template>
  <div id="sidebar">
    <div id="sidebar_title">관리자 페이지</div>
    <div class="sidebar_menu" v-for="largeMenu in largeMenus" :key="largeMenu">
      <!-- <div class="sidebar_menu_box" @click="getSmallMenu(largeMenu.menu_no)" :class="{'menu_select': selectMenu == largeMenu.menu_no}">
        <div class="sidebar_menu_img"><img :src="require(`../../assets/images/${largeMenu.menu_icon}`)"></div>
        <div class="sidebar_menu_text">{{ largeMenu.menu_name }}</div>
      </div> -->
      <div class="sidebar_menu_box" @click="goLargeMenu(largeMenu.menu_link, largeMenu.menu_no)" :class="{'menu_select': largeMenu.menu_link == currentPath}">
        <div class="sidebar_menu_img"><img :src="require(`../../assets/images/${largeMenu.menu_icon}`)"></div>
        <div class="sidebar_menu_text">{{ largeMenu.menu_name }}</div>
      </div>
      <div class="sidebar_menu_sub" v-show="largeMenu.menu_no == showSubMenu">
        <div class="sidebar_menu_box" v-for="smallMenu in smallMenus" :key="smallMenu" @click="goSmallMenu(smallMenu.menu_link)" :class="{'menu_select': smallMenu.menuLink == this.currentPath}">
          <div class="sidebar_menu_text">{{ smallMenu.menu_sub_name }}</div>
        </div>
      </div>
      <!-- <div class="sidebar_menu_sub" v-show="haveSubs && selectMenu == largeMenu.menu_no">
        <div class="sidebar_menu_box" v-for="smallMenu in smallMenus" :key="smallMenu" @click="goSmallMenu(smallMenu.menu_link)" :class="{'menu_select': smallMenu.menuLink == this.currentPath}">
          <div class="sidebar_menu_text">{{ smallMenu.menu_sub_name }}</div>
        </div>
      </div> -->
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
      subMenuPath: null, // 현재 보여지고 있는 소메뉴 링크


      selectMenu: null,
    }
  },

  methods: {
    getLargeMenu(level) {
      api.get(`/sidebar/largeMenu/${level}`)
      .then(res => {
        if (res.common.res_code == 200) { // 응답성공
          this.largeMenus = res.data.menuList;
          this.getSmallMenu();
        } else { // 응답실패
          console.log("MgrSidebar sidebar/largeMenu 응답실패");
        }
      })
    },

    getSmallMenu() {
      api.get(`/sidebar/smallMenu`)
      .then(res => {
        if (res.common.res_code == 200) { // 응답성공
          this.smallMenus = res.data.menuList;
        } else { // 응답실패
          console.log("MgrSidebar sidebar/smallMenu 응답실패");
        }
      })
    },

    goLargeMenu(menuLink, menuNo) { // 선택한 대메뉴 화면으로 이동
      console.log(menuNo);
      this.$router.push({path: `${menuLink}`, query: {menuNo: `${menuNo}`}});
    },

    // getLargeMenu(level) {
    //   api.get(`/sidebar/largeMenu/${level}`)
    //   .then(res => {
    //     if (res.common.res_code == 200) { // 응답성공
    //       this.largeMenus = res.data.menuList;
    //     } else { // 응답실패
    //       console.log("MgrSidebar sidebar/largeMenu 응답실패");
    //     }
    //   })
    // },

    // getSmallMenu(menuNo) {
    //   if(this.selectMenu == menuNo) {
    //     this.selectMenu = null; // 선택한 메뉴를 저장
    //     this.smallMenus = {};
    //     this.haveSubs = false;
    //   } else {
    //     this.selectMenu = menuNo; // 선택한 메뉴를 저장
    //     this.smallMenus = {};
    //     this.haveSubs = false;

    //     // 이미 선택했던 메뉴가 아니였을 경우
    //     api.get(`/sidebar/smallMenu/${menuNo}`)
    //     .then(res => {
    //       if (res.common.res_code == 200) { // 응답성공
    //         this.smallMenus = res.data.menuList;
    //         this.haveSubs = true;
    //       } else { // 응답실패
    //         console.log("MgrSidebar sidebar/smallMenu 응답실패");
    //       }
    //     })
    //   }
    // },

    setCurrentMenu(level, menuLink, menuNo) { // 현재 선택된 메뉴 표시
      this.getLargeMenu(level);
      
      menuLink = menuLink.substr(1);
      this.currentPath = menuLink;
      console.log("currentPath:::" + this.currentPath);
      console.log("menuNo:::" + menuNo);

      let haveSub = false;
      console.log(this.smallMenus);
      for(let smallMenu in this.smallMenus) {
        console.log("menuLink:::" + menuLink);
        console.log("smallMenu.menu_link:::" + smallMenu.menu_link);
        if(menuLink == smallMenu.menu_link) {
          haveSub = true; // 서브메뉴를 가지고 있음
          break;
        }
      }

      if(haveSub) {
        // 서브메뉴를 보일지말지
        // 어떤 서브메뉴를 선택표시할지
        console.log("aaaaaa")
        this.showSubMenu = menuNo;
        this.subMenuPath = menuLink;
      } else {
        this.showSubMenu = null;
        this.subMenuPath = null;
      }

    //   if(haveSub) {
    //     // 서브메뉴 목록 보이기
    //     showSubMenu = menuNo;
    //   } else { // 서브메뉴가 없을 경우
    //     showSubMenu = null;
    //   }

    //   this.$router.push({path: `${menuLink}`});
    },

    goSmallMenu(menuLink) { // 선택한 소메뉴로 이동
      // 대메뉴 선택을 해제
      this.selectMenu = null;
      
      this.currentPath = menuLink;
      this.$router.push({path: `${menuLink}`});
    }
  }
}
</script>
<style>
  @import "../../assets/css/common/index.css";
  @import "../../assets/css/manage/manage.css";
</style>