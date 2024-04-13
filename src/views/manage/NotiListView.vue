<!-- 공지사항목록화면 -->
<template>
  <div class="container">
    <MgrSidebar ref="mgrSidebar"></MgrSidebar>

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
        <div style="margin-left: auto" class="button button_width127 button_blue" @click="goRegView()">
          <img class="margin_right10 m_filter_invert" src="../../assets/images/plus.svg">
          <div class="text_white">공지등록</div>
        </div>
      </div>

      <div class="inline_blank24"></div>

      <div class="m_show_box">
        <div class="m_show_box_title">공지사항 전체 목록</div>
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
              <tr v-for="noti in notiList" :key="noti" @click="goDetailView(noti.noti_no, noti.mem_name)">
                <td class="m_td">{{ noti.noti_no }}</td>
                <td class="m_td">{{ noti.mem_name }}</td>
                <td class="m_td">{{ noti.noti_title }}</td>
                <td class="m_td">{{ noti.noti_cnt }}</td>
                <td class="m_td">{{ noti.reg_date }}</td>
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
      selectOptions: ["제목", "작성자"],
      selectOptionsColumn: ["noti.noti_title", "member.mem_name"],
      selectedOption: "제목",
      isOpen: false,
      searchText: "", // 검색했을때 검색 내용 저장
      searchOption: "", // 검색했을때 검색 컬럼 저장
      
      columnRange: ["10%", "10%", "50%", "10%", "10%"],
      tableColumn: ["번호", "작성자", "제목", "조회수", "등록일"],

      currentPage: 1, // 현재 페이지 번호
      recordPage: 10, // 한 페이지에 보여줄 row 개수
      totalCount: 0, // 전체 데이터 개수
      pagingCount: 5, // pagination에 보여질 페이지 개수

      notiList: {},
      pageList: {}
    }
  },

  created() {
    this.getNotiCount();
  },

  // DOM이 만들어진 후 실행
  mounted() {
    this.$refs.mgrSidebar.getLargeMenu(9);
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
      this.getNotiCount(); // 검색 내용 저장 후 새로 조회
    },

    getNotiCount() {
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

      api.get(`/manage/board/notice/notiCount`, {params: Object.fromEntries(sqlData)})
        .then(res => {
          if (res.common.res_code == 200) { // 응답성공
            this.totalCount = res.data.notiCount;

            if (this.totalCount > 0) {
              // 테이블 데이터가 있을 경우 조회
              this.getNotiInfo(this.currentPage);
              this.getViewPage();
            }
          } else { // 응답실패
            console.log("BookListView book/bookCount 응답실패");
          }
        })
    },

    getNotiInfo() {
      let sqlData = new Map();
      sqlData.set("column", this.searchOption);
      sqlData.set("search", this.searchText);

      api.get(`/manage/board/notice/notiList/${this.currentPage}`, {params: Object.fromEntries(sqlData)})
        .then(res => {
          if (res.common.res_code == 200) { // 응답성공
            this.notiList = res.data.notiList;
          } else { // 응답실패
            console.log("BookListView book/bookList 응답실패");
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
      this.getNotiInfo();
      this.getViewPage();
    },

    nextPage() { // 다음 버튼
      if (this.startPage + this.pagingCount > this.totalPage) { // 마지막 페이지일 경우 return
        return;
      }

      this.currentPage = this.endPage + 1;
      this.getNotiInfo();
      this.getViewPage();
    },

    changePage(page) {
      this.currentPage = page;
      this.getBookInfo();
    },

    goDetailView(notiNo, memName) {
      // 이전 화면으로 돌아올 때 데이터를 sessionStorage에 저장
      sessionStorage.setItem("currentPage", this.currentPage);
      this.$router.push({ name: 'MgrNotiDetail', params: { "notiNo": notiNo, "memName":  memName} });
    },

    goRegView() {
      sessionStorage.setItem("currentPage", this.currentPage);
      this.$router.push({ name: 'MgrNotiDetailReg', params: { notiInfo: "" } });
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