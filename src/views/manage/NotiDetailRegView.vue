<!-- 공지사항등록수정화면 -->
<template>
  <div class="container">
    <MgrSidebar ref="mgrSidebar"></MgrSidebar>

    <div class="main_container">
      <div class="m_show_box">
        <div class="m_show_box_title">공지사항 {{ status }}</div>
        <div class="m_title_line_box"></div>

        <div class="inline_blank24"></div>

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
            <div class="m_table_column">제목</div>
            <input type="text" class="m_table_column_result_insert" :value="notiInfo.noti_title">
          </div>
          <div class="m_table_row">
            <div class="m_table_column">내용</div>
            <input type="text" class="m_table_column_result_insert result_insert_full" :value="getContent()">
          </div>
        </div>
        
        <div class="inline_blank24"></div>

        <div class="m_button_line_box">
          <div class="button button_purple">
            <div class="text_white" v-if="status == `등록`">등록</div>
            <div class="text_white" v-else>수정</div>
          </div>
          <div class="margin_right10"></div>
          <div class="button" @click="goPrevView()">
            <div class="text_gray" v-if="status == `등록`">목록</div>
            <div class="text_gray" v-else>취소</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import MgrSidebar from "../manage/MgrSidebar.vue"
export default {
  components: {
    MgrSidebar
  },

  data() {
    return {
      status: "등록",
      memName: this.$route.params.memName,
      notiInfo: []
    }
  },

  created() {
    // 화면 만들어질때 등록, 수정 구분
    if(this.$route.params.notiInfo != "" || null) {
      this.status = "수정";
      this.notiInfo = JSON.parse(this.$route.params.notiInfo);
    }
  },

  // DOM이 만들어진 후 실행
  mounted() {
    this.$refs.mgrSidebar.getLargeMenu(9);
  },

  methods: {
    goPrevView() {
      this.$router.go(-1);
    },

    getContent() {
      if(this.$route.params.notiInfo != "" || null) {
        return this.notiInfo.noti_subtitle + this.notiInfo.noti_content;  
      }
      return "";
    }
  },
}
</script>
<style>
@import "../../assets/css/common/index.css";
@import "../../assets/css/manage/manage.css";
</style>