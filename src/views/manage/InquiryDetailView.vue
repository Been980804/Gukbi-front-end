<!-- 문의사항상세화면 -->
<template>
  <div class="container">
    <Sidebar ref="Sidebar"></Sidebar>

    <div class="main_container">
      <div class="m_show_box">
        <div class="m_show_box_title">{{ inquiryInfo.qes_title }}</div>
        <div class="m_title_line_box"></div>

        <div class="m_table_list">
          <div class="m_table_row">
            <div class="m_table_column">작성자</div>
            <div class="m_table_column_result">{{ memName }}</div>
          </div>
          <div class="m_table_row">
            <div class="m_table_column">내용</div>
            <div class="m_table_column_result">
              {{ inquiryInfo.qes_content }}
            </div>
          </div>
          <div class="m_table_row">
            <div class="m_table_column">등록일</div>
            <div class="m_table_column_result">{{ inquiryInfo.qes_reg_date }}</div>
          </div>
          <div class="m_table_row"  v-if="inquiryInfo.ans_content != null">
            <div class="m_table_column">답변내용</div>
            <div class="m_table_column_result">{{ inquiryInfo.ans_content }}</div>
          </div>
          <div class="m_table_row" v-if="inquiryInfo.ans_reg_date != null">
            <div class="m_table_column">답변 등록일</div>
            <div class="m_table_column_result">{{ inquiryInfo.ans_reg_date }}</div>
          </div>
        </div>

        <div class="inline_blank24"></div>

        <div class="m_button_line_box" v-if="inquiryInfo.ans_content == null">
          <div class="button button_blue" @click="isOpenAnswer()">
            <div class="text_white">답변하기</div>
          </div>
        </div>

        <div v-show="isOpen">
          <div class="m_title_line_box"></div>
          <div class="m_show_box_title">문의사항 답변</div>

          <div class="inline_blank24"></div>
          <textarea class="answer_box" style="width: 100%;" rows="10"></textarea>

          <div class="inline_blank24"></div>

          <div class="m_button_line_box">
            <div class="button button_purple" @click="regist()">
              <div class="text_white">답변등록</div>
            </div>
          </div>
        </div>
        
        <div class="inline_blank24"></div>

        <div class="m_button_line_box">
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
      inquiryNo: this.$route.params.inquiryNo,
      memName: this.$route.params.memName,
      isOpen: false,
      inquiryInfo: {}
    }
  },

  created() {
    if(sessionStorage.getItem("memName") != null || undefined) {
      this.memName = sessionStorage.getItem("memName");
    }

    if(sessionStorage.getItem("inquiryNo") != null || undefined) {
      this.inquiryNo = sessionStorage.getItem("inquiryNo");
    }

    api.get(`/manage/board/inquiry/inquiryInfo/${this.inquiryNo}}`)
      .then(res => {
        if(res.common.res_code == 200 && res.data.inquiryInfo != '') {
          this.inquiryInfo = res.data.inquiryInfo;
          console.log(this.inquiryInfo)
        } else {
          console.log("BookDetailView book/inquiryInfo 응답실패");
        }
      })
  },

  // DOM이 만들어진 후 실행
  mounted() {
    this.$refs.Sidebar.setCurrentMenu(9, this.$route.query.path, this.$route.query.menuNo);
  },

  methods: {
    isOpenAnswer() {
      this.isOpen = !this.isOpen;
    },

    goPrevView() { // 뒤로 돌아가기
      this.$router.go(-1);
    },

    regist() { // 답변등록
      api.get(`/manage/board/inquiry/inquiryInfo/${this.inquiryNo}}`)
      .then(res => {
        if(res.common.res_code == 200 && res.data.inquiryInfo != '') {
          this.inquiryInfo = res.data.inquiryInfo;
          console.log(this.inquiryInfo)
        } else {
          console.log("BookDetailView book/inquiryInfo 응답실패");
        }
      })
    }
  },
}
</script>
<style>
@import "../../assets/css/common/index.css";
@import "../../assets/css/manage/manage.css";
</style>