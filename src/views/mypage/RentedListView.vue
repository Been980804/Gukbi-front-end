<template>
  <div class="container">
    <Sidebar ref="Sidebar"></Sidebar>
    <div class="main_container">
      <div class="rentedList_page">
        <div class="rentedList_page_title f2-5rem">
          <b>대여 내역</b>
        </div>

        <div class="rentedList">
          <div class="rentedList_title f1-875rem">
            <b>대여한 도서 목록</b>
          </div>
          <table class="rentedList_table">
            <tr class="rentedList_table_header">
              <th class="rented_bookCode t_header">
                <b>도서코드</b>
              </th>
              <th class="rented_bookTitle t_header">
                <b>도서명</b>
              </th>
              <th class="rented_userName t_header">
                <b>회원명</b>
              </th>
              <th class="rented_rentDate t_header">
                <b>대여일</b>
              </th>
              <th class="rented_returnDate t_header">
                <b>반납일</b>
              </th>              
            </tr>

            <tr class="list_row" v-for="(rented, index) in calcuateDates" :key="index">
              <td class="rented_bookCode t_list">{{ rented.book_no }}</td>
              <td class="rented_bookTitle t_list">{{ rented.book_title }}</td>
              <td class="rented_userName t_list">{{ rented.mem_name }}</td>
              <td class="rented_rentDate t_list">{{ rented.rent_date }}</td>
              <td class="rented_returnDate t_list">{{ rented.return_date }}</td>
              <td class="rented_reviewButton">
                <button class="list_row_btn button_charcoal text_white button" @click="open_reviewP(rented)">
                  리뷰작성
                </button>
                <ReviewP v-if="reviewP" @close="close_reviewP" :reviewBook="selectedBook"/>
              </td>
            </tr>
          </table>
        </div>
        <div class="page_line_box">
          <div class="page_box_img"><img src="../../assets/images/arrow-left.svg"></div>
          <div class="page_box_text">&nbsp;1&nbsp;&nbsp;2&nbsp;&nbsp;3&nbsp;&nbsp;4&nbsp;&nbsp;5&nbsp;&nbsp;</div>
          <div class="page_box_img"><img src="../../assets/images/arrow-right.svg"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@/stores/user.js";
import Sidebar from "@/components/common/SidebarView.vue";
import ReviewP from "@/components/mypage/popup/ReviewP.vue";

export default {
  components: { Sidebar, ReviewP},
  data() {
    return {
      user: useUserStore().getUser,
      rentedList:[],
      options : { year: 'numeric', month: '2-digit', day: '2-digit' },
      reviewP : false,
      selectedBook : null,
    };
  },
  created(){
    this.getRentedList();
  },

  mounted() {
    this.$refs.Sidebar.setCurrentMenu(
      8,
      this.$route.path,
      this.$route.query.menuNo
    );
  },

  methods:{
    // 대여했던 도서목록 조회
    getRentedList(){
      this.$api
      .get(`/mypage/rent/rentedList/${this.user.mem_no}`)
      .then(res => {
        const common = res.common;
        if(common.res_code == 200){
          const data = res.data;
          this.rentedList = data.rentedList;
        }else{
          alert('대여한 내역 없음');
        }
      })
      .catch(err => {
        console.log(err);
      })
    },

    // 리뷰작성 팝업 열기
    open_reviewP(rented){
      this.selectedBook = rented;
      this.reviewP = true;
    },
    // 리뷰작성 팝업 닫기
    close_reviewP(){
      this.reviewP = false;
    },
    // 선택된 책 정보 넘기기
    selectedRentedBook(rented){
      this.selectedBook = rented;
    }
  },
  computed:{
    // 날짜 형식 맞추기
    calcuateDates(){
      return this.rentedList.map(rented => {
        const rent_date = new Date(rented.rent_date);
        const return_date = new Date(rented.return_date);

        return{
          ...rented,
          rent_date : rent_date.toLocaleDateString('ko-KR', this.options),
          return_date : return_date.toLocaleDateString('ko-KR', this.options),
        }
      })
    },
  }
};
</script>

<style scoped>
@import "../../assets/css/mypage/rentedList.css";
</style>
