<template>
  <div class="container">
    <Sidebar ref="Sidebar"></Sidebar>
    <div class="main_container">
      <div class="notiDetail_page">
        <div class="notiDetail_page_title f1-875rem">
          <b>{{notiInfo.noti_title}}</b>
        </div>

        <div class="notiInfo">
          <table class="notiInfo_table">
            <tr class="notiInfo_tr">
              <th class="notiInfo_th">작성자</th>
              <td class="notiInfo_td">{{notiInfo.mem_name}}</td>
            </tr>
            <tr class="notiInfo_tr">
              <th class="notiInfo_th">등록일</th>
              <td class="notiInfo_td">{{notiInfo.reg_date}}</td>
            </tr>
            <tr class="notiInfo_tr">
              <th class="notiInfo_th">내용</th>
              <td class="notiInfo_td">
                <div class="notiInfo_subTitle"><b>{{notiInfo.noti_subtitle}}</b></div>
                <div class="notiInfo_content">{{notiInfo.noti_content}}</div>
              </td>
            </tr>
          </table>
        </div>

        <div class="notiDetail_btnBox">
          <button class="button text_gray" @click="goPrevView">목록</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/axios";
import Sidebar from "../../components/common/SidebarView.vue";
import { useUserStore } from "@/stores/user";

export default {
  components: { Sidebar },
  data() {
    return {
      user: useUserStore().getUser,
      SidebarNo: this.$route.params.SidebarNo,
      notiNo: this.$route.params.notiNo,
      nowPage: this.$route.params.nowPage,

      notiInfo:[],
    };
  },
  created() {
    if (sessionStorage.getItem("notiNo") != null || undefined) {
      this.notiNo = sessionStorage.getItem("notiNo");
    }

    if (this.$route.params.notiNo != null || undefined) {
      this.notiNo = this.$route.params.notiNo;
    }

    if (sessionStorage.getItem("SidebarNo") != null || undefined) {
      this.SidebarNo = sessionStorage.getItem("SidebarNo");
    }

    if (this.$route.params.SidebarNo != null || undefined) {
      this.SidebarNo = this.$route.params.SidebarNo;
    }

   api.get(`/madang/noti/notiDetail/${this.notiNo}`)
   .then(res => {
    if(res.common.res_code == 200){
      this.notiInfo = res.data.notiInfo;
    } else{
      console.log('공지사항 상세정보 불러오기 실패');
    }
   })
  },
  mounted() {
    this.$refs.Sidebar.setCurrentMenu(
      4,
      this.$route.path,
      this.$route.query.menuNo
    );
  },
  methods:{
    goPrevView(){
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
@import "../../assets/css/madang/notificationDetail.css";
</style>
