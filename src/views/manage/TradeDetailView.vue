<!-- 도서거래상세화면 -->
<template>
  <div class="container">
    <MgrSidebar ref="mgrSidebar"></MgrSidebar>

    <div class="main_container">
      <div class="m_show_box">
        <div class="m_show_box_title">{{ tradeInfo.trade_title }}</div>
        <div class="m_title_line_box"></div>

        <div class="m_table_list">
          <div class="m_table_row">
            <div class="m_table_column">작성자</div>
            <div class="m_table_column_result">{{ tradeInfo.mem_name }}</div>
          </div>
          <div class="m_table_row">
            <div class="m_table_column">출판사</div>
            <div class="m_table_column_result">{{ tradeInfo.trade_publisher }}</div>
          </div>
          <div class="m_table_row">
            <div class="m_table_column">가격</div>
            <div class="m_table_column_result">{{ tradeInfo.trade_price }}</div>
          </div>
          <div class="m_table_row">
            <div class="m_table_column">책 상태</div>
            <div class="m_table_column_result">{{ tradeInfo.trade_condition }}</div>
          </div>
          <div class="m_table_row">
            <div class="m_table_column">설명</div>
            <div class="m_table_column_result">{{ tradeInfo.trade_content }}</div>
          </div>
          <div class="m_table_row">
            <div class="m_table_column">전화번호</div>
            <div class="m_table_column_result">{{ tradeInfo.mem_phone }}</div>
          </div>
          <div class="m_table_row">
            <div class="m_table_column">이메일</div>
            <div class="m_table_column_result">{{ tradeInfo.mem_email }}</div>
          </div>
          <div class="m_table_row">
            <div class="m_table_column">판매 상태</div>
            <div class="m_table_column_result">{{ tradeInfo.trade_state }}</div>
          </div>
          <div class="m_table_row">
            <div class="m_table_column">등록일</div>
            <div class="m_table_column_result">{{ tradeInfo.reg_date }}</div>
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
import MgrSidebar from "../manage/MgrSidebar.vue"
export default {
  components: {
    MgrSidebar
  },

  data() {
    return {
      tradeNo: this.$route.params.tradeNo,
      tradeInfo: {}
    }
  },

  created() {
    api.get(`/manage/board/trade/tradeInfo/${this.tradeNo}}`)
      .then(res => {
        if(res.common.res_code == 200 && res.data.tradeInfo != '') {
          this.tradeInfo = res.data.tradeInfo;
          console.log(this.tradeInfo)
        } else {
          console.log("BookDetailView book/bookInfo 응답실패");
        }
      })
  },

  // DOM이 만들어진 후 실행
  mounted() {
    this.$refs.mgrSidebar.getLargeMenu(9);
  },

  methods: {
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