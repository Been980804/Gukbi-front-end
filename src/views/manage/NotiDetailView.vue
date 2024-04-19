<!-- 공지사항상세화면 -->
<template>
  <div class="container">
    <Sidebar ref="Sidebar"></Sidebar>

    <div class="main_container">
      <div class="m_show_box">
        <div class="m_show_box_title">{{ notiInfo.noti_title }}</div>
        <div class="m_title_line_box"></div>

        <div class="m_table_list">
          <div class="m_table_row">
            <div class="m_table_column">작성자</div>
            <div class="m_table_column_result">{{ memName }}</div>
          </div>
          <div class="m_table_row">
            <div class="m_table_column">등록일</div>
            <div class="m_table_column_result">{{ notiInfo.reg_date }}</div>
          </div>
          <div class="m_table_row">
            <div class="m_table_column">내용</div>
            <div class="m_table_column_result">
              {{ notiInfo.noti_subtitle }}<br>
              {{ notiInfo.noti_content }}
            </div>
          </div>
        </div>

        <div class="inline_blank24"></div>

        <div class="m_button_line_box">
          <div class="button button_purple" @click="goRegView()">
            <div class="text_white">수정</div>
          </div>
          <div class="margin_right10"></div>
          <div class="button button_red" @click="deleteNoti()">
            <div class="text_white">삭제</div>
          </div>
          <div class="margin_right10"></div>
          <div class="button" @click="goPrevView()">
            <div class="text_gray">목록</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "@/api/axios";
import Sidebar from "../../components/common/SidebarView.vue"
export default {
  components: {
    Sidebar
  },
  
  data() {
    return {
      notiNo: this.$route.params.notiNo,
      memName: this.$route.params.memName,
      notiInfo: {}
    }
  },

  created() {
    if(sessionStorage.getItem("memName") != null || undefined) {
      this.memName = sessionStorage.getItem("memName");
    }

    if(sessionStorage.getItem("notiNo") != null || undefined) {
      this.notiNo = sessionStorage.getItem("notiNo");
    }

    api.get(`/manage/board/notice/notiInfo/${this.notiNo}}`)
      .then(res => {
        if(res.common.res_code == 200 && res.data.notiInfo != '') {
          this.notiInfo = res.data.notiInfo;
          console.log(this.notiInfo)
        } else {
          console.log("BookDetailView book/notiInfo 응답실패");
        }
      })
  },

  // DOM이 만들어진 후 실행
  mounted() {
    this.$refs.Sidebar.setCurrentMenu(9, this.$route.query.path, this.$route.query.menuNo);
  },

  methods: {
    goRegView() { // 수정
      // 이전 화면으로 돌아올 때 데이터를 sessionStorage에 저장
      sessionStorage.setItem("memName", this.memName);
      sessionStorage.setItem("notiNo", this.notiNo);
      this.$router.push({ name: 'MgrNotiDetailReg', params: { 'notiInfo': JSON.stringify(this.notiInfo), 'memName': this.memName},
        query: { path: `${this.$route.query.path}`, menuNo: `${this.$route.query.menuNo}` }});
    },

    deleteNoti() {
      api.put(`/manage/board/notice/notiDelete/${this.notiNo}`)
        .then(res => {
          if(res.common.res_code == 200) {
            this.$router.go(-1);
          } else {
            console.log("BookDetailView notice/delete 응답실패")
          }
        })
    },

    goPrevView() { // 뒤로 돌아가기
      this.$router.go(-1);
    }
  },
}
</script>
<style>
@import "../../assets/css/common/index.css";
@import "../../assets/css/manage/manage.css";
</style>