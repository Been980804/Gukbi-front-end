<template>
  <div class="container">
    <Sidebar ref="Sidebar"></Sidebar>
    <div class="main_container">
      <div class="inquiryReg_page">
        <div class="inquiryReg_page_title f2-5rem">
          <b>문의사항 등록</b>
        </div>

        <div class="inquiryReg">
          <table class="inquiryReg_table">
            <tr class="inquiryReg_tr">
              <th class="inquiryReg_th">작성자</th>
              <td class="inquiryReg_td">{{ user.mem_name }}</td>
            </tr>
            <tr class="inquiryReg_tr">
              <th class="inquiryReg_th">제목</th>
              <td class="inquiryReg_td">
                <input
                  class="inquiryReg_text_input"
                  type="text"
                  maxlength="50"
                  id="inquiryReg_title"
                  autocomplete="off"
                />
              </td>
            </tr>
            <tr class="inquiryReg_tr_content">
              <th class="inquiryReg_th">문의내용</th>
              <td class="inquiryReg_td">
                <textarea
                  class="inquiryReg_content_input"
                  maxlength="500"
                  cols="30"
                  rows="10"
                  id="inquiryReg_content"
                  autocomplete="off"
                />
              </td>
            </tr>
            <tr class="inquiryReg_tr">
              <th class="inquiryReg_th">공개여부</th>
              <td class="inquiryReg_td inquiryReg_disclosure">
                <label class="switch">
                  <input
                    type="checkbox"
                    v-model="isDisclosure"
                    @click="changeDisclosure"
                  />
                  <span class="slider"></span>
                </label>
              </td>
            </tr>
          </table>
        </div>

        <div class="inquiryReg_btnBox">
          <button
            class="button button_charcoal text_white"
            @click="submit_inquiryReg"
          >
            확인
          </button>
          <button
            class="button button_charcoal text_white"
            @click="cancel_inquiryReg"
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
  components: {
    Sidebar,
  },
  data() {
    return {
      user: useUserStore().getUser,
      SidebarNo: this.$route.params.SidebarNo,
      isDisclosure: true,
      isDisclosureText: "Y",
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
    changeDisclosure() {
      if (this.isDisclosure) {
        this.isDisclosure = !this.isDisclosure;
        this.isDisclosureText = "N";
      } else {
        this.isDisclosure = !this.isDisclosure;
        this.isDisclosureText = "Y";
      }
    },
    submit_inquiryReg() {
      let title = document.getElementById("inquiryReg_title").value;
      let content = document.getElementById("inquiryReg_content").value;
      let disclosure = this.isDisclosureText;

      if (!title) {
        alert("제목을 입력해주세요.");
        return;
      } else if (!content) {
        alert("내용을 입력해주세요.");
        return;
      }

      let reqBody = {
        qes_mem_no: this.user.mem_no,
        qes_title: title,
        qes_content: content,
        qna_yn: disclosure,
      };

      api.post("/madang/inquiry/inquiryReg", reqBody).then((res) => {
        if (res.common.res_code == 200) {
          alert("등록되었습니다.");
          this.$router.go(-1);
        } else {
          console.log("문의내역 등록에 실패하였습니다.");
        }
      });
    },
    cancel_inquiryReg() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
@import "../../assets/css/madang/inquiryReg.css";
</style>
