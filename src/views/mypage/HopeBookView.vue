<template>
  <div class="container">
    <MypageSidebar></MypageSidebar>
    <div class="main_container">
      <div class="hopeBook_page">
        <div class="hopeBook_page_title f2-5rem">
          <b>희망도서 신청목록</b>
        </div>

        <div class="hopeBookList">
          <table class="hopeBook_table">
            <tr class="hopeBook_table_header">
              <th class="hopeBook_number t_header">번호</th>
              <th class="hopeBook_bookTitle t_header">도서명</th>
              <th class="hopeBook_author t_header">저자명</th>
              <th class="hopeBook_publisher t_header">출판사</th>
              <th class="hopeBook_reqDate t_header">신청일</th>
              <th class="hopeBook_reqState t_header">신청상태</th>
            </tr>

            <tr
              class="list_row"
              v-for="(hopeBook, index) in hopeBookList"
              :key="index"
            >
              <td class="hopeBook_number t_list">{{ index + 1 }}</td>
              <td class="hopeBook_bookTitle t_list">
                {{ hopeBook.appl_title }}
              </td>
              <td class="hopeBook_author t_list">{{ hopeBook.appl_author }}</td>
              <td class="hopeBook_publisher t_list">
                {{ hopeBook.appl_publisher }}
              </td>
              <td class="hopeBook_reqDate t_list">{{ hopeBook.reg_date }}</td>
              <td
                class="hopeBook_reqState t_list"
                :class="getStateClass(hopeBook.appl_state)"
              >
                {{ hopeBook.appl_state }}
              </td>
              <td class="hopeBook_cancelButton">
                <button
                  class="list_row_btn button_charcoal text_white button"
                  @click="cancelHopeBook(hopeBook.appl_no)"
                >
                  신청취소
                </button>
              </td>
            </tr>
          </table>
        </div>

        <div class="hopeBook_applyButton">
          <button class="list_row_btn button_charcoal text_white button" @click="open_hopeApplP">
            신청하기
          </button>
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
</template>

<script>
import { useUserStore } from "@/stores/user.js";
import MypageSidebar from "@/components/mypage/MypageSidebar.vue";

export default {
  components: { MypageSidebar,},
  data() {
    return {
      user: useUserStore().getUser,
      hopeBookList: [],
      options: { year: "numeric", month: "2-digit", day: "2-digit" },
      hopeApplP : false,
    };
  },
  created() {
    this.getHopeBookList();
  },

  methods: {
    // 나의 희망도서 게시글 리스트 조회
    getHopeBookList() {
      this.$api
        .get(`/mypage/bookAppl/hopeBookList/${this.user.mem_no}`)
        .then((res) => {
          const common = res.common;
          if (common.res_code == 200) {
            const data = res.data;
            this.hopeBookList = data.hopeBookList;
          } else {
            alert("희망 도서 목록 없음");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 상태에 따른 class 부여
    getStateClass(state) {
      return {
        text_red: state === "반려",
        text_blue: state === "입고중" || "신청중",
        text_green: state === "입고완료",
      };
    },
    // 희망도서 삭제
    cancelHopeBook(appl_no) {
      const reqBody = {
        appl_no: appl_no,
        mem_no: this.user.mem_no,
      };
      if (confirm("정말 취소하시겠습니까?")) {
        this.$api
          .post("/mypage/bookAppl/cancelHopeBook", reqBody)
          .then((res) => {
            const common = res.common;
            if(common.res_code == 200){
              alert('취소 되었습니다.');
            window.location.reload(true);
            } else{
              alert('현재 입고중이거나 입고완료된 도서 입니다.');
            }
          })
          .catch(err => {
            console.log(err);
          })
      }
    },
    // 신청하기 팝업 열기
    open_hopeApplP(){
      this.hopeApplP = true;
    },
    //  신청하기 팝업 닫기
    close_hopeApplP(){
      this.hopeApplP = false;
    },
  },
  computed: {
    // 날짜 형식 맞추기
    calculateDates() {
      return this.hopeBookList.map((hopeBook) => {
        const reg_date = new Date(hopeBook.reg_date);

        return {
          ...hopeBook,
          reg_date: reg_date.toLocaleDateString("ko-KR", this.options),
        };
      });
    },
  },
};
</script>

<style scoped>
/* @import "../../assets/css/mypage/hopeBook.css"; */
</style>
