<template>
  <div class="bookPly_detail">
    <div class="detail_header f1-875rem">
      <b>북플리 정보</b>
    </div>

    <div class="detail_intro">
      <table class="detail_intro_table">
        <tr>
          <td class="detail_img" rowspan="4">
            <img v-if="bookPlyDetail.book_url" :src="bookPlyDetail.book_url" />
            <img v-else src="" />
          </td>
        </tr>
        <tr>
          <td class="detail_plyName detail_list">
            <b>{{ bookPlyDetail.bpl_name }}</b>
          </td>
        </tr>
        <tr>
          <td class="detail_plyUserName detail_list">
            {{ bookPlyDetail.mem_name }}
          </td>
        </tr>
        <tr class="updateDateAndLike detail_list">
          <td class="detail_updateDate">{{ bookPlyDetail.mod_date }}</td>
          <td class="detail_like">
            <fieldset>
              <input
                type="checkbox"
                id="like_cnt"
                @click="updateLike"
                :checked="isLiked"
                v-model="isLiked"
              />
              <label for="like_cnt">♥</label>
              <span id="likeCount">{{ bookPlyDetail.like_cnt }}</span>
            </fieldset>
          </td>
        </tr>
      </table>
    </div>
    <div class="detail_content">
      <div class="content_head"><b>소개글</b></div>
      <div class="content_content">{{ bookPlyDetail.bpl_intro }}</div>
    </div>

    <div class="detail_bookList">
      <div class="detail_bookList_header">
        <b
          >수록 책 ({{
            bookPlyDetail.book_cnt !== null ? bookPlyDetail.book_cnt : 0
          }})</b
        >
      </div>
      <div class="detail_bookList_button">
        <div class="btn_flex">
          <button
            class="button button_width70 button_height26 margin-right button_charcoal text_white"
            @click="open_addBplP1"
          >
            + 담기
          </button>
          <AddBookPly
            v-if="addBplP1"
            @close="close_addBplP1"
            :bookList="checkedBooks"
          />
          <button
            class="button button_width70 button_height26 button_charcoal text_white"
            @click="deleteSelectedBook"
          >
            - 삭제
          </button>
        </div>
        <button
          class="button button_width70 button_height26 margin-right button_charcoal text_white"
          @click="open_updateBplP"
        >
          수정하기
        </button>
        <UpdateBplP
          v-if="updateBplP"
          @close="close_updateBplP"
          :bookPlyInfo="bookPlyDetail"
        />
        
      </div>
      <table class="detail_bookList_table">
        <tr class="bookList_table_header">
          <th class="bookList_checkbox t_header">
            <input
              type="checkbox"
              id="bookList_checkAll"
              @change="checkAll($event)"
            />
          </th>
          <th class="bookList_num t_header">번호</th>
          <th class="bookList_bookImg t_header"></th>
          <th class="bookList_bookTitle t_header">도서명</th>
          <th class="bookList_author t_header">저자명</th>
          <th class="bookList_publisher t_header">출판사</th>
          <th class="bookList_detailInfo t_header">상세정보보기</th>
          <th class="bookList_addMyBookPly t_header">내북플리에 담기</th>
        </tr>
        <tr
          class="bookList_row"
          v-for="(bookList, index) in detailBookList"
          :key="index"
        >
          <td class="bookList_checkbox t_list">
            <input
              type="checkbox"
              class="bookList_chk"
              :value="bookList.book_no"
              @change="checkboxClicked($event)"
            />
          </td>
          <td class="bookList_num t_list">{{ index + 1 }}</td>
          <td class="bookList_bookImg t_list">
            <img v-if="bookList.book_url" :src="bookList.book_url" />
            <img v-else :src="defaultImg" />
          </td>
          <td class="bookList_bookTitle t_list">{{ bookList.book_title }}</td>
          <td class="bookList_author t_list">{{ bookList.book_author }}</td>
          <td class="bookList_publisher t_list">
            {{ bookList.book_publisher }}
          </td>
          <td class="bookList_detailInfo t_list">
            
            <button
              class="button button_width70 button_height26 button_charcoal text_white"
            >
              상세정보
            </button>
          </td>
          <td class="bookList_addMyBookPly t_list">
            <button
              class="button button_width70 button_height26 button_charcoal text_white"
              @click="open_addBplP2(bookList.book_no)"
            >
              + 담기
            </button>
            <AddBookPly
              v-if="addBplP2"
              @close="close_addBplP2"
              :bookList="checkedBook"   
            />
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@/stores/user.js";
// import defaultImg from "@/assets/images/free-icon-book-4693705.png";
import UpdateBplP from "@/components/mypage/popup/UpdateBookPlyP.vue";
import AddBookPly from "@/components/mypage/popup/AddBookPlyP.vue";

export default {
  components: { UpdateBplP, AddBookPly, },
  data() {
    return {
      user: useUserStore().getUser,
      // defaultImg: defaultImg,
      detailBookList: [],
      isLiked: false,
      currentBpl_no: null,
      checkedBooks: [],
      updateBplP: false,
      addBplP1: false,
      isAllChecked: false,
      addBplP2: false,
      checkedBook : [],
    };
  },
  props: {
    bookPlyDetail: Object,
  },
  watch: {
    bookPlyDetail: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.getDetailBookList(newVal.bpl_no);
        }
      },
    },
  },
  methods: {
    // 북플리 상세정보(책) 조회
    getDetailBookList(bpl_no) {
      this.detailBookList = [];
      this.currentBpl_no = bpl_no;

      this.$api
        .get(
          `mypage/bookPly/getDetailBookList/${bpl_no}?mem_no=${this.user.mem_no}`
        )
        .then((res) => {
          const common = res.common;
          if (common.res_code == 200) {
            const data = res.data;
            this.detailBookList = data.detailBookList;
            this.isLiked = data.isLiked === "true";
          } else {
            alert("책목록 가져오기 실패");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 체크박스 전체 선택
    checkAll(event) {
      const isChecked = event.target.checked;
      this.isAllChecked = isChecked;
      this.checkedBooks = [];

      if (isChecked) {
        this.detailBookList.forEach((book) => {
          this.checkedBooks.push(book.book_no);
        });
      } else {
        this.checkedBooks = [];
      }

      document.querySelectorAll(".bookList_chk").forEach((checkbox) => {
        checkbox.checked = isChecked;
      });
    },
    // 좋아요 업데이트
    updateLike() {
      const reqBody = {
        mem_no: this.user.mem_no,
        bpl_no: this.bookPlyDetail.bpl_no,
      };

      this.$api
        .post("mypage/bookPly/updateLike", reqBody)
        .then((res) => {
          const common = res.common;
          if (common.res_code == 200) {
            alert("성공");
            this.isLiked = !this.isLiked;
            window.location.reload(true);
          } else {
            alert("실패");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 체크된 책들 배열에 저장
    checkboxClicked(event) {
      const book_no = event.target.value;
      const index = this.checkedBooks.indexOf(book_no);

      if (index !== -1) {
        this.checkedBooks.splice(index, 1);
      } else {
        this.checkedBooks.push(book_no);
      }
    },


    // 체크된 책들 삭제
    deleteSelectedBook() {
      const reqBody = {
        bpl_no: this.currentBpl_no,
        book_no: this.checkedBooks,
      };

      if (confirm("정말 삭제하시겠습니까?")) {
        this.$api.post("/mypage/bookPly/deleteBook", reqBody).then((res) => {
          const common = res.common;
          if (common.res_code == 200) {
            alert("삭제 성공");
            window.location.reload(true);
          } else {
            alert("삭제 실패");
          }
        });
      }
      if (confirm("정말 삭제하시겠습니까?")) {
        this.$api.post("/mypage/bookPly/deleteBook", reqBody).then((res) => {
          const common = res.common;
          if (common.res_code == 200) {
            alert("삭제 성공");
            window.location.reload(true);
          } else {
            alert("삭제 실패");
          }
        });
      }
    },

    open_updateBplP() {
      this.updateBplP = true;
    },
    close_updateBplP() {
      this.updateBplP = false;
    },
    open_addBplP1() {
      if (this.checkedBooks.length > 0) {
        this.addBplP1 = true;
        this.addBplP2 = false;
      } else {
        alert("책을 선택해주세요");
      }
    },
    open_addBplP2(book_no) {
      this.checkedBook.push(book_no);
      this.addBplP1 = false;
      this.addBplP2 = true;

    },
    close_addBplP1() {
      this.addBplP1 = false;
    },
    close_addBplP2() {
      this.addBplP2 = false;
    },
  },
};
</script>

<style scoped>
@import "../../assets/css/mypage/bookPlyDetail.css";
</style>
