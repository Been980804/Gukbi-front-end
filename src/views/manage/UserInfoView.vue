<!-- 회원상세정보화면 -->
<template>
  <div class="container">
    <Sidebar ref="Sidebar"></Sidebar>

    <div class="main_container">
      <div class="m_line_box">
        <div class="search_box">
          <input type="text" class="search_box_input" placeholder="검색어 입력" @keyup.enter="setSearchText($event)">
          <img class="search_box_img" src="../../assets/images/search_btn_icon.svg">
        </div>
        <div style="margin-left: 30px"  class="m_select_box">
          <button class="m_select_button" @click="selectClick()">  
            <span>{{ selectedOption }}</span>
          </button>
          <div class="m_drop_content" v-show="isOpen">
            <div v-for="option in selectOptions" :key="option" @click="selectOption(option)">{{ option }}</div>
          </div>
        </div>
      </div>

      <div class="inline_blank24"></div>

      <div class="m_user_info_box">
        <div class="m_user_info_box_text">회원명 : {{ user.memName }}</div>
        <div class="m_user_info_box_text flex_grow4">총 연체 건 수 : {{ overdueCount }}건</div>
        <div class="m_user_info_box_text">
          대여가능여부 : <input role="switch" type="checkbox" class="m_checkbox"/>
        </div>
      </div>

      <div class="inline_blank24"></div>

      <div class="m_show_box">
        <div class="m_show_box_title">대여/연체 전체 목록</div>
        <div class="inline_blank12"></div>
        <div class="table_line_box">
          <table class="m_table">
            <colgroup>
              <col v-for="range in columnRange" :key="range" :width="range">
            </colgroup>
            <thead class="m_thead">
              <tr>
                <th v-for="column in tableColumn" :key="column" class="m_th">{{ column }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rent in rentList" :key="rent">
                <td class="m_td">{{ rent.book_no }}</td>
                <td class="m_td">{{ rent.book_title }}</td>
                <td class="m_td">{{ user.memName }}</td>
                <td class="m_td">{{ rent.rent_date }}</td>
                <td class="m_td">{{ setExpectDate(rent.rent_date) }}</td>
                <td class="m_td">{{ rent.return_date }}</td>
                <td class="m_td">{{ setOverdue(setExpectDate(rent.rent_date), rent.return_date) }}</td>
                
                <td class="text_blue" v-if="rent.return_state == `대여중`">{{ rent.return_state }}</td>
                <td class="text_red" v-else-if="rent.return_state == `연체중`">{{ rent.return_state }}</td>
                <td class="text_red" v-else-if="rent.return_state == `연체 후 반납`">{{ rent.return_state }}</td>
                <td class="text_green" v-else>{{ rent.return_state }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="inline_blank24"></div>
        <div class="page_line_box">
          <div class="page_box_img" @click="prevPage()"><img src="../../assets/images/arrow-left.svg"></div>
          <ul>
            <li class="page_box_text li_inline" @click="changePage(page)" v-for="page in pageList" :key="page">{{ page }}</li>
          </ul>
          <div class="page_box_img" @click="nextPage()"><img src="../../assets/images/arrow-right.svg"></div>
        </div>
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
      user: { "memName": this.$route.params.memName,
        "memNo": this.$route.params.memNo,
        "rentYN": this.$route.params.rentYN },
      
      selectOptions: ["도서명"],
      selectOptionsColumn: ["book.book_title"],
      selectedOption: "도서명",
      isOpen: false,
      searchText: "", // 검색했을때 검색 내용 저장
      searchOption: "", // 검색했을때 검색 컬럼 저장

      columnRange: ["10%", "30%", "10%", "10%", "10%", "10%", "10%", "10%"],
      tableColumn: ["도서코드", "도서명", "회원명", "대여일", "반납예정일", "반납일", "연체일", "반납상태"],

      currentPage: 1, // 현재 페이지 번호
      recordPage: 10, // 한 페이지에 보여줄 row 개수
      totalCount: 0, // 전체 데이터 개수
      pagingCount: 5, // pagination에 보여질 페이지 개수

      rentList: {},
      pageList: {},
      overdueCount: 0
    }
  },

  created() {
    this.getRentCount();
    this.getOverdueCount();
  },

  // DOM이 만들어진 후 실행
  mounted() {
    this.$refs.Sidebar.setCurrentMenu(9, this.$route.query.path, this.$route.query.menuNo);
  },

  methods: {
    selectClick() { // selectBox 클릭 시
      this.isOpen = !this.isOpen;
    },
    selectOption(option) { // 옵션 선택 시
      this.selectedOption = option;
      this.isOpen = false;
    },

    setSearchText(event) { // 검색 내용 저장
      this.searchText = event.target.value;
      this.getRentCount(); // 검색 내용 저장 후 새로 조회
    },

    getOverdueCount() { // 연체 건 수 조회
      api.get(`/manage/user/userInfo/overdueCount/${this.user.memNo}`)
        .then(res => {
          if (res.common.res_code == 200) { // 응답성공
            this.overdueCount = res.data.overdueCount;
          } else { // 응답실패
            console.log("UserInfoView user/userInfo/overdueCount 응답실패");
          }
        })
    },

    getRentCount() {
      let count = 0;
      for(const column of this.selectOptions) {
        if(column == this.selectedOption) {
          break;
        }
        count++;
      }

      let column  = this.selectOptionsColumn[count];
      this.searchOption = column;
      let sqlData = new Map();
      sqlData.set("column", column);
      sqlData.set("search", this.searchText);
      sqlData.set("memNo", this.user.memNo);

      // api - main.js에서 사용하게 정의됨
      api.get(`/manage/user/userInfo/rentCount`, {params: Object.fromEntries(sqlData)})
        .then(res => {
          if (res.common.res_code == 200) { // 응답성공
            this.totalCount = res.data.rentCount;
         
            if (this.totalCount > 0) {
              // 테이블 데이터가 있을 경우 조회
              this.getUserInfo(this.currentPage);
              this.getViewPage();
            }
          } else { // 응답실패
            console.log("UserInfoView user/userInfo/rentCount 응답실패");
          }
        })
    },

    getUserInfo() {
      let sqlData = new Map();
      sqlData.set("column", this.searchOption);
      sqlData.set("search", this.searchText);
      sqlData.set("memNo", this.user.memNo);

      api.get(`/manage/user/userInfo/rent/${this.currentPage}`, {params: Object.fromEntries(sqlData)})
        .then(res => {
          if(res.common.res_code == 200 && res.data.book_no != '') {
            this.rentList = res.data.userInfo;
          } else {
            console.log("UserInfoView user/userInfo/rent 응답실패");
          }
        })
    },

    getViewPage() { // 페이징 영역에 보일 페이지 번호 구하기
      let pages = [];
      let num = this.startPage;
      while (num <= this.endPage) {
        pages.push(num++);
      }
      this.pageList = pages;
    },

    prevPage() { // 이전 버튼
      if (this.endPage - this.pagingCount <= 0) { // 첫페이지일 경우 return
        return;
      }

      this.currentPage = this.startPage - 1;
      this.getUserInfo();
      this.getViewPage();
    },

    nextPage() { // 다음 버튼
      if (this.startPage + this.pagingCount > this.totalPage) { // 마지막 페이지일 경우 return
        return;
      }

      this.currentPage = this.endPage + 1;
      this.getUserInfo();
      this.getViewPage();
    },

    changePage(page) {
      this.currentPage = page;
      this.getUserInfo();
    },

    setExpectDate(rentDate) { // 반납예정일 계산
      let startDate = new Date(rentDate);
      let endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 14);
      
      let year = endDate.getFullYear();
      let month = endDate.getMonth() + 1;
      let day = endDate.getDate();

      if(month < 10) {
        month = "0" + month;
      }
      if(day < 10) {
        day = "0" + day;
      }

      return `${year}.${month}.${day}`;
    },

    setOverdue(expectDate, returnDate) { // 연체일 계산
      let startDate = new Date(expectDate);
      let endDate = new Date();

      if(returnDate != undefined) { // 반납을 아직 하지 않았을 경우
        endDate = new Date(returnDate);
      } else {
        let year = endDate.getFullYear();
        let month = endDate.getMonth() + 1;
        let day = endDate.getDate();

        if(month < 10) month = "0" + month;
        if(day < 10) day = "0" + day;

        endDate = new Date(`${year}.${month}.${day}`);
      }

      let resultDate = (endDate.getTime() - startDate.getTime()) / (24 * 3600 * 1000);

      if(resultDate <= 0) return null; // 연체되지 않은 경우
      return resultDate;
    },

    goPrevView() { // 뒤로 돌아가기
      this.$router.go(-1);
    }
  },

  computed: {
    totalPage() { // 전체 페이지 개수
      if (this.totalCount == 0) {
        return 1;
      }
      return Math.ceil(this.totalCount / this.recordPage); // 숫자 올림 처리
    },

    startPage() {
      return (Math.trunc((this.currentPage - 1) / this.pagingCount) * this.pagingCount) + 1;
    },

    endPage() {
      let result = this.startPage + this.pagingCount - 1;
      return result < this.totalPage ? result : this.totalPage;
    }
  }
}
</script>
<style>
@import "../../assets/css/common/index.css";
@import "../../assets/css/manage/manage.css";
</style>