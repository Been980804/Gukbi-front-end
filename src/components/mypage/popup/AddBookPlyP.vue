<template>
  <div class="addBookPly_popup">
    <div class="addBookPly_popup_main">
      <div class="addBookPly_popup_body">
        <div class="addBookPly_popup_title">
          <b>내 북플리 목록</b>
        </div>
        <div class="cancelAddBookPly_popup" @click="addBplP_cancel">X</div>
        <div class="addBookPlyList">
          <table class="addBookPlyList_table">
            <tr class="addBookPlyList_table_header">
              <th class="addBookPly_num t_header">번호</th>
              <th class="addBookPly_img t_header"></th>
              <th class="addBookPly_bplName t_header">북플리명</th>
              <th class="addBookPly_userName t_header">회원명</th>
              <th class="addBookPly_updateDate t_header">최종 수정날짜</th>
            </tr>
            <tr
              class="list_row"
              v-for="(bookPly, index) in bookPlyList"
              :key="index"             
            >
              <td class="addBookPly_num t_list"  @click="addBplP_submit(bookPly)">{{ index + 1 }}</td>
              <td class="addBookPly_img"  @click="addBplP_submit(bookPly)">
                <img :src="bookPly.book_url" />
              </td>
              <td class="addBookPly_bplName t_list"  @click="addBplP_submit(bookPly)">{{ bookPly.bpl_name }}</td>
              <td class="addBookPly_userName t_list"  @click="addBplP_submit(bookPly)">{{ bookPly.mem_name }}</td>
              <td class="addBookPly_updateDate t_list"  @click="addBplP_submit(bookPly)">
                {{ bookPly.mod_date }}
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@/stores/user";

export default {
  props: {
    bookList: Array,
  },
  data() {
    return {
      user: useUserStore().getUser,
      bookPlyList: [],
    };
  },
  created() {
    this.getBookPlyList();
  },

  methods: {
    getBookPlyList() {
      this.$api
        .get(`/mypage/bookPly/bookPlyList/${this.user.mem_no}`)
        .then((res) => {
          const common = res.common;
          if (common.res_code == 200) {
            const data = res.data;
            this.bookPlyList = data.bookPlyList;
          } else {
            alert("북플리 목록 없음");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addBplP_cancel() {
      if (confirm("취소하시겠습니까?")) {
        this.$emit("close");
      }
    },
    addBplP_submit(bookPly) {
      const reqBody = {
        bpl_no: bookPly.bpl_no,
        book_no: this.bookList,
      };

      this.$api
        .post("mypage/bookPly/addBpl", reqBody)
        .then((res) => {
          const common = res.common;
          if (common.res_code == 200) {
            alert("내 북플리에 책을 담았습니다.");
            window.location.reload(true);
          } else {
            alert("실패");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style>
@import "../../../assets/css/mypage/popup/addBookPlyP.css";
</style>
