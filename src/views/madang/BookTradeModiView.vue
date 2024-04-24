<template>
  <div class="container">
    <Sidebar ref="Sidebar"></Sidebar>
    <div class="main_container">
      <div class="tradeModify_page">
        <div class="tradeModify_page_title f1-875rem">
          <b>도서거래 게시글 수정</b>
        </div>

        <div class="tradeModify">
          <table class="modify_table">
            <tr class="modify_tr">
              <th class="modify_th">판매자</th>
              <td class="modify_td">{{ tradeInfo.mem_name }}</td>
            </tr>
            <tr class="modify_tr">
              <th class="modify_th">제목</th>
              <td class="modify_td">
                <input
                  class="modify_text_input"
                  type="text"
                  maxlength="50"
                  v-model="tradeInfo.trade_title"
                />
              </td>
            </tr>
            <tr class="modify_tr">
              <th class="modify_th">도서명</th>
              <td class="modify_td">
                <input
                  class="modify_text_input"
                  type="text"
                  maxlength="50"
                  v-model="tradeInfo.trade_book_title"
                />
              </td>
            </tr>
            <tr class="modify_tr">
              <th class="modify_th">출판사</th>
              <td class="modify_td">
                <input
                  class="modify_text_input"
                  type="text"
                  maxlength="15"
                  v-model="tradeInfo.trade_publisher"
                />
              </td>
            </tr>
            <tr class="modify_tr">
              <th class="modify_th">가격</th>
              <td class="modify_td">
                <input
                  class="modify_text_input"
                  type="text"
                  maxlength="5"
                  v-model="tradeInfo.trade_price"
                />
              </td>
            </tr>
            <tr class="modify_tr">
              <th class="modify_th">도서 상태</th>
              <td class="modify_td">
                <div class="bookState">{{ conditionText }}</div>
                <input
                  class="modify_range_input"
                  type="range"
                  min="1"
                  max="5"
                  v-model="selectedValue"
                  @change="valueToCondition(selectedValue)"
                />
              </td>
            </tr>
            <tr class="modify_tr_content">
              <th class="modify_th">도서 설명</th>
              <td class="modify_td">
                <textarea
                  class="modify_content_input"
                  maxlength="500"
                  cols="30"
                  rows="10"
                  v-model="tradeInfo.trade_content"
                />
              </td>
            </tr>
            <tr class="modify_tr">
              <th class="modify_th">전화번호</th>
              <td class="modify_td">{{ tradeInfo.mem_phone }}</td>
            </tr>
            <tr class="modify_tr">
              <th class="modify_th">이메일</th>
              <td class="modify_td">{{ tradeInfo.mem_email }}</td>
            </tr>
            <tr class="modify_tr">
              <th class="modify_th">등록일</th>
              <td class="modify_td">{{ tradeInfo.reg_date }}</td>
            </tr>
          </table>
        </div>

        <div class="tradeModi_btnBox">
          <button class="button button_charcoal text_white">확인</button>
          <button
            class="button button_charcoal text_white"
            @click="cancel_tradeModi"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@/stores/user";
import Sidebar from "@/components/common/SidebarView.vue";
import api from "@/api/axios";

export default {
  components: { Sidebar },
  data() {
    return {
      user: useUserStore().getUser,
      tradeNo: this.$route.params.trade_no,
      tradeInfo: [],
      selectedValue: null,
      conditionText: '',
    };
  },
  created() {
    api.get(`/madang/bookTrade/tradeDetail/${this.tradeNo}`).then((res) => {
      if (res.common.res_code == 200) {
        this.tradeInfo = res.data.tradeInfo;
        this.conditionText = this.tradeInfo.trade_condition;

        this.selectedValue = this.mapConditionToValue(
          this.tradeInfo.trade_condition
        );
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
    mapConditionToValue(condition) {
      switch (condition) {
        case "매우나쁨":
          return 1;
        case "나쁨":
          return 2;
        case "보통":
          return 3;
        case "좋음":
          return 4;
        case "매우좋음":
          return 5;
        default:
          return 3;
      }
    },

    valueToCondition(value) {
      if (value == 1) {
        this.conditionText = "매우나쁨";
      } else if (value == 2) {
        this.conditionText = "나쁨";
      } else if (value == 3) {
        this.conditionText = "보통";
      } else if (value == 4) {
        this.conditionText = "좋음";
      } else if (value == 5) {
        this.conditionText = "매우좋음";
      }
    },

    cancel_tradeModi() {
      this.$router.push({
        name: "BookTradeDetail",
        params: { tradeNo: this.tradeNo },
        query: {
          path: `${this.$route.query.path}`,
          menuNo: `${this.$route.query.menuNo}`,
        },
      });
    },
  },
};
</script>

<style scoped>
@import "../../assets/css/madang/bookTradeModi.css";
</style>
