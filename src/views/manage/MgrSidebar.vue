<!-- TODO 일단 이렇게 테스트하고 나중에 Component로 빼서 사용 -->
<template>
  <div id="sidebar">
    <div id="sidebar_title">관리자 페이지</div>
    <div class="sidebar_menu" v-for="largeMenu in largeMenus" :key="largeMenu">
      <div class="sidebar_menu_box" @click="getSmallMenu(largeMenu.menu_no)" :class="{'menu_select': selectMenu == largeMenu.menu_no}">
        <div class="sidebar_menu_img"><img :src="require(`../../assets/images/${largeMenu.menu_icon}`)"></div>
        <div class="sidebar_menu_text">{{ largeMenu.menu_name }}</div>
      </div>
      <div class="sidebar_menu_sub" v-show="haveSubs && selectMenu == largeMenu.menu_no">
        <div class="sidebar_menu_box" v-for="smallMenu in smallMenus" :key="smallMenu">
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
      selectMenu: null,
      haveSubs: false // 서브메뉴들이 있는지 확인
    }
  },

  methods: {
    getLargeMenu(level) {
      api.get(`/sidebar/largeMenu/${level}`)
      .then(res => {
        if (res.common.res_code == 200) { // 응답성공
          this.largeMenus = res.data.menuList;
        } else { // 응답실패
          console.log("MgrSidebar sidebar/largeMenu 응답실패");
        }
      })
    },

    getSmallMenu(menuNo) {
      if(this.selectMenu == menuNo) {
        this.selectMenu = null; // 선택한 메뉴를 저장
        this.smallMenus = {};
        this.haveSubs = false;
      } else {
        this.selectMenu = menuNo; // 선택한 메뉴를 저장
        this.smallMenus = {};
        this.haveSubs = false;

        // 이미 선택했던 메뉴가 아니였을 경우
        api.get(`/sidebar/smallMenu/${menuNo}`)
        .then(res => {
          if (res.common.res_code == 200) { // 응답성공
            this.smallMenus = res.data.menuList;
            this.haveSubs = true;
          } else { // 응답실패
            console.log("MgrSidebar sidebar/smallMenu 응답실패");
          }
        })
      }
    }
  }
}
</script>
<style>
  @import "../../assets/css/common/index.css";
  @import "../../assets/css/manage/manage.css";
</style>