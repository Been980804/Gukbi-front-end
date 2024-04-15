<template>
  <div class="container">
    <MyPageSidebar />
    <div class="main_container">
      <div class="myBookTrade_page">
        <div class="myBookTrade_page_title f2-5rem">
          <b>내가 판매중인 도서목록</b>
        </div>

        <div class="myBookTradeList">
          <table class="myTrade_table">
            <tr class="myTrade_table_header">
              <th class="myTrade_num t_header">번호</th>
              <th class="myTrade_userName t_header">판매자</th>
              <th class="myTrade_title t_header">제목</th>
              <th class="myTrade_bookTitle t_header">도서명</th>
              <th class="myTrade_publisher t_header">출판사</th>
              <th class="myTrade_price t_header">가격</th>
              <th class="myTrade_state t_header">판매상태</th>
              <th class="myTrade_update t_header">수정</th>
              <th class="myTrade_delete t_header">삭제</th>
            </tr>

            <tr
              class="list_row"
              v-for="(trade, index) in tradeList"
              :key="index"
            >
              <td class="myTrade_num t_list">{{ index + 1 }}</td>
              <td class="myTrade_userName t_list">{{ trade.mem_name }}</td>
              <td class="myTrade_title t_list">{{ trade.trade_title }}</td>
              <td class="myTrade_bookTitle t_list">
                {{ trade.trade_book_title }}
              </td>
              <td class="myTrade_publisher t_list">
                {{ trade.trade_publisher }}
              </td>
              <td class="myTrade_price t_list">
                {{ formatPrice(trade.trade_price) }}
              </td>
              <td class="myTrade_state t_list" :class="getStateClass(trade.trade_state)">{{ trade.trade_state }}</td>
              <td class="myTrade_update">
                <button class="button button_charcoal text_white">수정</button>
              </td>
              <td class="myTrade_delete">
                <button
                  class="button button_charcoal text_white"
                  @click="deleteTrade(trade.trade_no)"
                >
                  삭제
                </button>
              </td>
            </tr>
          </table>
          <div class="myTrade_create">
            <button class="button button_charcoal text_white">등록</button>
          </div>
          <div class="page_line_box">
            <div class="page_box_img">
              <img src="../../assets/images/arrow-left.svg" />
            </div>
            <div class="page_box_text">
              &nbsp;1&nbsp;&nbsp;2&nbsp;&nbsp;3&nbsp;&nbsp;4&nbsp;&nbsp;5&nbsp;&nbsp;
            </div>
            <div class="page_box_img">
              <img src="../../assets/images/arrow-right.svg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@/stores/user";
import MyPageSidebar from "@/components/mypage/MypageSidebar.vue";

export default {
  components: { MyPageSidebar },
  data() {
    return {
      user: useUserStore().getUser,
      tradeList: [],
    };
  },
  created() {
    this.getMyTradeList();
  },

  methods: {
    // 도서거래 리스트 조회
    getMyTradeList() {
      this.$api
        .get(`/mypage/trade/getTradeList/${this.user.mem_no}`)
        .then((res) => {
          const common = res.common;
          if (common.res_code == 200) {
            const data = res.data;
            this.tradeList = data.tradeList;
          } else {
            alert("내도서거래 리스트 조회 실패");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 가격 18000 -> 18,000 으로 변경
    formatPrice(price) {
      const changePrice = parseInt(price);
      if (!isNaN(changePrice)) {
        return changePrice.toLocaleString("ko-KR");
      } else {
        return changePrice;
      }
    },
    // 도서거래 게시글 삭제
    deleteTrade(trade_no) {
      const reqBody = {
        trade_no: trade_no,
        mem_no: this.user.mem_no,
      };

      if (confirm("정말 삭제하시겠습니까?")) {
        this.$api
          .post("/mypage/trade/deleteTrade", reqBody)
          .then((res) => {
            const common = res.common;
            if (common.res_code == 200) {
              alert("도서거래 게시글이 삭제되었습니다.");
              window.location.reload(true);
            } else {
              alert("도서거래 게시글 삭제 실패");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    // 판매 상태에 따른 색 변경
    getStateClass(state){
      return{
        'text_blue' : state === '판매중',
        'text_green' : state === '판매완료'
      }
    }
  },
};
</script>

<style scoped>
@import "../../assets/css/mypage/myBookTrade.css";
</style>
