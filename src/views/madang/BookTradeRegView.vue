<template>
  <div class="container">
    <Sidebar ref="Sidebar"></Sidebar>
    <div class="main_container">
      <div class="tradeReg_page">
        <div class="tradeReg_page_title f1-875rem">
          <b>도서거래 게시글 등록</b>
        </div>

        <div class="tradeReg">
          <table class="tradeReg_table">
            <tr class="tradeReg_tr">
              <th class="tradeReg_th">판매자</th>
              <td class="tradeReg_td">{{ user.mem_name }}</td>
            </tr>
            <tr class="tradeReg_tr">
              <th class="tradeReg_th">제목</th>
              <td class="tradeReg_td">
                <input
                  class="tradeReg_text_input"
                  type="text"
                  maxlength="50"
                  id="tradeReg_title"
                  autocomplete="off"
                />
              </td>
            </tr>
            <tr class="tradeReg_tr">
              <th class="tradeReg_th">도서명</th>
              <td class="tradeReg_td">
                <input
                  class="tradeReg_text_input"
                  type="text"
                  maxlength="50"
                  id="tradeReg_book_title"
                  autocomplete="off"
                />
              </td>
            </tr>
            <tr class="tradeReg_tr">
              <th class="tradeReg_th">출판사</th>
              <td class="tradeReg_td">
                <input
                  class="tradeReg_text_input"
                  type="text"
                  maxlength="15"
                  id="tradeReg_publisher"
                  autocomplete="off"
                />
              </td>
            </tr>
            <tr class="tradeReg_tr">
              <th class="tradeReg_th">가격</th>
              <td class="tradeReg_td">
                <input
                  class="tradeReg_text_input"
                  type="text"
                  maxlength="5"
                  id="tradeReg_price"
                  autocomplete="off"
                />
              </td>
            </tr>
            <tr class="tradeReg_tr">
              <th class="tradeReg_th">도서 상태</th>
              <td class="tradeReg_td">
                <div class="bookState">{{ conditionText }}</div>
                <input
                  class="tradeReg_range_input"
                  type="range"
                  min="1"
                  max="5"
                  v-model="selectedRangeValue"
                  @change="valueToCondition(selectedRangeValue)"
                />
              </td>
            </tr>
            <tr class="tradeReg_tr_content">
              <th class="tradeReg_th">도서 설명</th>
              <td class="tradeReg_td">
                <textarea
                  class="tradeReg_content_input"
                  maxlength="500"
                  cols="30"
                  rows="10"
                  id="tradeReg_content"
                  autocomplete="off"
                />
              </td>
            </tr>
            <tr class="tradeReg_tr">
              <th class="tradeReg_th">판매상태</th>
              <td class="tradeReg_td">
                <select v-model="selectedState" class="tradeReg_select">
                  <option value="판매중">판매중</option>
                  <option value="판매완료">판매완료</option>
                </select>
              </td>
            </tr>

            <tr class="tradeReg_tr">
              <th class="tradeReg_th">전화번호</th>
              <td class="tradeReg_td">{{ user.mem_phone }}</td>
            </tr>
            <tr class="tradeReg_tr">
              <th class="tradeReg_th">이메일</th>
              <td class="tradeReg_td">{{ user.mem_email }}</td>
            </tr>
          </table>
        </div>

        <div class="tradeReg_btnBox">
          <button
            class="button button_charcoal text_white"
            @click="submit_tradeReg"
          >
            확인
          </button>
          <button
            class="button button_charcoal text_white"
            @click="cancel_tradeReg"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/axios";
import { useUserStore } from "@/stores/user";
import Sidebar from "@/components/common/SidebarView.vue";

export default {
  components: { Sidebar },
  data() {
    return {
      user: useUserStore().getUser,
      SidebarNo : this.$route.params.SidebarNo,
      selectedRangeValue: 3,
      conditionText: "보통",
      selectedState: "판매중",
    };
  },
  mounted() {
    this.$refs.Sidebar.setCurrentMenu(
      this.SidebarNo,
      this.$route.path,
      this.$route.query.menuNo
    );
  },
  methods: {
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

    submit_tradeReg() {
      const reg = /^[0-9]+$/;
      let title = document.getElementById("tradeReg_title").value;
      let book_title = document.getElementById("tradeReg_book_title").value;
      let publisher = document.getElementById("tradeReg_publisher").value;
      let price = document.getElementById("tradeReg_price").value;
      let content = document.getElementById("tradeReg_content").value;

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

      let reqBody = {
        mem_no: this.user.mem_no,
        trade_title: title,
        trade_book_title: book_title,
        trade_publisher: publisher,
        trade_price: price,
        trade_condition: this.conditionText,
        trade_content: content,
        trade_state: this.selectedState,
      };

      api.post("/madang/bookTrade/tradeReg", reqBody).then((res) => {
        if (res.common.res_code == 200) {
          alert("등록되었습니다.");
          this.$router.go(-1);
        } else {
          console.log("도서거래 등록에 실패하였습니다.");
        }
      });
    },

    cancel_tradeReg() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
@import "../../assets/css/madang/bookTradeReg.css";
</style>
