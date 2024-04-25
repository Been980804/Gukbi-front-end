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
              <th class="modify_th">판매상태</th>
              <td class="modify_td">
                <select v-model="selectedState" class="modify_select">
                  <option value="판매중">판매중</option>
                  <option value="판매완료">판매완료</option>
                </select>
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
          <button
            class="button button_charcoal text_white"
            @click="submit_tradeModi"
          >
            확인
          </button>
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
      SidebarNo : this.$route.params.SidebarNo,

      tradeInfo: [],
      selectedValue: null,
      conditionText: "",
      selectedState: "",

    };
  },
  created() {
    api.get(`/madang/bookTrade/tradeDetail/${this.tradeNo}`).then((res) => {
      if (res.common.res_code == 200) {
        this.tradeInfo = res.data.tradeInfo;
        this.conditionText = this.tradeInfo.trade_condition;
        this.selectedState = this.tradeInfo.trade_state;

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
      this.SidebarNo,
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

    submit_tradeModi() {
       const reg = /^[0-9]+$/;
      let title = this.tradeInfo.trade_title;
      let book_title = this.tradeInfo.trade_book_title;
      let publisher = this.tradeInfo.trade_publisher;
      let price = this.tradeInfo.trade_price;
      let content = this.tradeInfo.trade_content;

      if (!title) {
        alert("제목을 입력하세요.");
        return;
      } else if (!book_title) {
        alert("도서명을 입력하세요.");
        return;
      } else if (!publisher) {
        alert("출판사를 입력하세요.");
        return;
      } else if (!price) {
        alert("가격을 입력하세요.");
        return;
      } else if (!reg.test(price)) {
        alert("가격은 숫자만 입력해 주세요.");
        return;
      }

      const reqBody = {
        trade_no: this.tradeInfo.trade_no,
        trade_title: title,
        trade_book_title: book_title,
        trade_publisher: publisher,
        trade_price: price,
        trade_condition: this.conditionText,
        trade_content: content,
        trade_state: this.selectedState,
      };

      api.put("/madang/bookTrade/tradeModi", reqBody).then((res) => {
        if (res.common.res_code == 200) {
          alert("수정되었습니다.");
          this.$router.push({
            name: "BookTradeDetail",
            params: { tradeNo: this.tradeNo },
            query: {
              path: `${this.$route.query.path}`,
              menuNo: `${this.$route.query.menuNo}`,
            },
          });
        } else {
          console.log("수정 실패");
        }
      })
      .catch(err => {
        console.log(err);
      })
    },

    cancel_tradeModi() {
     this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
@import "../../assets/css/madang/bookTradeModi.css";
</style>
