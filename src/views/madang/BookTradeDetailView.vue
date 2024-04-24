<template>
  <div class="container">
    <Sidebar ref="Sidebar"></Sidebar>
    <div class="main_container">
      <div class="bookTradeDetail_page">
        <div class="bookTradeDetail_page_title f1-875rem">
          <b>{{ tradeInfo.trade_title }}</b>
        </div>

        <div class="tradeInfo">
          <table class="info_table">
            <tr class="info_tr">
              <th class="info_th">판매자</th>
              <td class="info_td">{{ tradeInfo.mem_name }}</td>
            </tr>
            <tr class="info_tr">
              <th class="info_th">도서명</th>
              <td class="info_td">{{ tradeInfo.trade_book_title }}</td>
            </tr>
            <tr class="info_tr">
              <th class="info_th">출판사</th>
              <td class="info_td">{{ tradeInfo.trade_publisher }}</td>
            </tr>
            <tr class="info_tr">
              <th class="info_th">가격</th>
              <td class="info_td">
                {{
                  formatPrice(
                    tradeInfo.trade_price != null ? tradeInfo.trade_price : null
                  )
                }}
              </td>
            </tr>
            <tr class="info_tr">
              <th class="info_th">도서 상태</th>
              <td class="info_td">{{ tradeInfo.trade_condition }}</td>
            </tr>
            <tr class="info_tr_content">
              <th class="info_th">도서 설명</th>
              <td class="info_td">{{ tradeInfo.trade_content }}</td>
            </tr>
            <tr class="info_tr">
              <th class="info_th">판매 상태</th>
              <td class="info_td">{{ tradeInfo.trade_state }}</td>
            </tr>
            <tr class="info_tr">
              <th class="info_th">전화번호</th>
              <td class="info_td">{{ tradeInfo.mem_phone }}</td>
            </tr>
            <tr class="info_tr">
              <th class="info_th">이메일</th>
              <td class="info_td">{{ tradeInfo.mem_email }}</td>
            </tr>
            <tr class="info_tr">
              <th class="info_th">등록일</th>
              <td class="info_td">{{ tradeInfo.reg_date }}</td>
            </tr>
          </table>
        </div>

        <div class="bookTradeDetail_btnBox">
          <button
            class="button button_charcoal text_white"
            v-if="isCurrentUser(tradeInfo.mem_no)"
            @click="goModiView"
          >
            수정
          </button>
          <button class="button button_charcoal text_white" @click="goPrevView">
            목록
          </button>
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
      tradeNo: this.$route.params.tradeNo,
      tradeInfo: {},
      nowPage : this.$route.params.nowPage, // 목록으로 돌아갈때를 위한 페이지 저장
    };
  },
  created() {
    api.get(`/madang/bookTrade/tradeDetail/${this.tradeNo}`).then((res) => {
      if (res.common.res_code == 200) {
        this.tradeInfo = res.data.tradeInfo;
      } else {
        console.log("도서거래 상세정보 불러오기 실패");
      }
    });
  },
  mounted() {
    this.$refs.Sidebar.setCurrentMenu(
      3,
      this.$route.path,
      this.$route.query.menuNo
    );
  },
  methods: {
    // 가격 18000 -> 18,000 으로 변경
    formatPrice(price) {
      if (price == null) {
        return "";
      }

      const changePrice = parseInt(price);
      if (!isNaN(changePrice)) {
        return changePrice.toLocaleString("ko-KR");
      } else {
        return changePrice;
      }
    },
    // 판매 상태에 따른 색 변경
    getStateClass(state) {
      return {
        text_blue: state === "판매중",
        text_green: state === "판매완료",
      };
    },

    goPrevView() {
      this.$router.push({
        name: "BookTradeList",
        params: { nowPage: this.nowPage },
        query: { path: `${this.$route.query.path}`, menuNo: `${this.$route.query.menuNo}` }
      });
    },
    goModiView() {
      this.$router.push({
        name: "BookTradeModi",
        params: { trade_no: this.tradeNo },
        query: { path: `${this.$route.query.path}`, menuNo: `${this.$route.query.menuNo}` }
      });
    },

    isCurrentUser(mem_no) {
      return mem_no == this.user.mem_no;
    },
  },
};
</script>

<style scoped>
@import "../../assets/css/madang/bookTradeDetail.css";
</style>
