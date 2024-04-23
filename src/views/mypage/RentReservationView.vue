<template>
  <div class="container">
    <Sidebar ref="Sidebar"></Sidebar>
    <div class="main_container">
      <div class="rentReservation_page">
        <div class="rentReservation_page_title f2-5rem">
          <b>대여 / 예약</b>
        </div>

        <div class="rentList">
          <div class="rentList_title f1-875rem">
            <b>대여중</b>
          </div>
          <table class="rentList_table">
            <tr class="rentList_table_header">
              <th class="rent_bookCode t_header">
                <b>도서코드</b>
              </th>
              <th class="rent_bookTitle t_header">
                <b>도서명</b>
              </th>
              <th class="rent_userName t_header">
                <b>회원명</b>
              </th>
              <th class="rent_rentDate t_header">
                <b>대여일</b>
              </th>
              <th class="rent_returnDate t_header">
                <b>반납예정일</b>
              </th>
              <th class="rent_lateDate t_header">
                <b>연체일</b>
              </th>
            </tr>

            <tr
              class="list_row"
              v-for="(rent, index) in calculateDates"
              :key="index"
            >
              <td class="rent_bookCode t_list">{{ rent.book_no }}</td>
              <td class="rent_bookTitle t_list">{{ rent.book_title }}</td>
              <td class="rent_userName t_list">{{ rent.mem_name }}</td>
              <td class="rent_rentDate t_list">{{ rent.rent_date }}</td>
              <td class="rent_returndate t_list">{{ rent.return_date }}</td>
              <td class="rent_latedate text_red t_list">
                {{ rent.late_date }}
              </td>
              <td class="rent_returnButton">
                <button
                  class="list_row_btn button_charcoal text_white button"
                  @click="returnBook(rent.rent_no)"
                >
                  반납
                </button>
              </td>
            </tr>
          </table>
        </div>

        <div class="reserveList">
          <div class="reserveList_title f1-875rem">
            <b>예약중</b>
          </div>
          <table class="reserveList_table">
            <tr class="reserveList_table_header">
              <th class="reserve_bookCode t_header">
                <b>도서코드</b>
              </th>
              <th class="reserve_bookTitle t_header">
                <b>도서명</b>
              </th>
              <th class="reserve_publisher t_header">
                <b>출판사명</b>
              </th>
              <th class="reserve_userName t_header">
                <b>회원명</b>
              </th>
              <th class="reserve_reserveDate t_header">
                <b>예약일</b>
              </th>
              <th class="reserve_rent_dueDate t_header">
                <b>대여예정일</b>
              </th>
            </tr>

            <tr
              class="list_row"
              v-for="(reserve, index) in reserveCalculateDate"
              :key="index"
            >
              <td class="reserve_bookCode t_list">{{ reserve.book_no }}</td>
              <td class="reserve_bookTitle t_list">{{ reserve.book_title }}</td>
              <td class="reserve_publisher t_list">
                {{ reserve.book_publisher }}
              </td>
              <td class="reserve_userName t_list">{{ reserve.mem_name }}</td>
              <td class="reserve_reserveDate t_list">
                {{ reserve.reserv_date }}
              </td>
              <td class="reserve_rent_dueDate t_list">
                {{ reserve.rent_dueDate }}
              </td>
              <td class="reserve_cancelButton">
                <button
                  class="list_row_btn button_charcoal text_white button"
                  @click="cancelReserveBook(reserve.reserv_no)"
                >
                  취소
                </button>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@/stores/user.js";
import Sidebar from "@/components/common/SidebarView.vue";
export default {
  components: { Sidebar },
  data() {
    return {
      user: useUserStore().getUser,
      rentList: [],
      reserveList: [],
      options: { year: "numeric", month: "2-digit", day: "2-digit" },
    };
  },
  created() {
    this.getRentList();
    this.getReserveList();
  },

  mounted() {
    this.$refs.Sidebar.setCurrentMenu(
      8,
      this.$route.path,
      this.$route.query.menuNo
    );
  },

  methods: {
    // 대여중인 도서 조회
    getRentList() {
      this.$api
        .get(`/mypage/rent/rentList/${this.user.mem_no}`)
        .then((res) => {
          const common = res.common;
          if (common.res_code == 200) {
            const data = res.data;
            this.rentList = data.rentList;
            // this.checkLateDateandChangeState();
          } else {
            alert("대여내역 없음");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 예약한 도서 조회
    getReserveList() {
      this.$api
        .get(`/mypage/rent/reserveList/${this.user.mem_no}`)
        .then((res) => {
          const common = res.common;
          if (common.res_code == 200) {
            const data = res.data;
            this.reserveList = data.reserveList;
          } else {
            alert("예약내역 없음");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 대여한 도서 반납
    returnBook(rent_no) {
      const reqBody = {
        rent_no: rent_no,
        mem_no: this.user.mem_no,
      };
      this.$api
        .post("mypage/rent/returnBook", reqBody)
        .then((res) => {
          const common = res.common;
          if (common.res_code == 200) {
            alert("반납 되었습니다.");
            window.location.reload(true);
          } else {
            alert("반납 실패");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 대여 상태변경을 위한 연체일 유무 체크
    // checkLateDateandChangeState(){
    //   for(const rent of this.lateDate){
    //     if(rent.late_date != null){
    //       console.log(rent.late_date);
    //     }
    //   }
    // },
    // 대여 상태변경
    // updateRentState(rent_no){
    //   const reqBody = {rent_no : rent_no}
    //   this.$api
    //   .put('mypage/rent/changeState',reqBody)
    //   .then(res => {
    //     const common = res.common;
    //     if(common.res_code == 200){
    //       alert('성공');
    //     }else{
    //       alert('실패');
    //     }
    //   })
    //   .catch(err =>{
    //     console.log(err);
    //   })
    // }

    cancelReserveBook(reserv_no) {
      const reqBody = {
        reserv_no: reserv_no,
        mem_no: this.user.mem_no,
      };

      if (confirm("정말 취소하시겠습니까?")) {
        this.$api
          .post("mypage/rent/cancelReserveBook", reqBody)
          .then((res) => {
            const common = res.common;
            if (common.res_code == 200) {
              alert("취소 되었습니다.");
              window.location.reload(true);
            } else {
              alert("실패");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    updateRentState(rent_no){
      this.$api.put(`mypage/rent/changeRentState/${rent_no}`)
      .then(res => {
        const common = res.common;
        if(common.res_code == 200){
          console.log('상태 변경');
        }else{
          console.log('상태 변경 실패');
        }
      })
      .catch(err => {
        console.log(err);
      })
    }
  },

  computed: {
    // 반납예정일, 연체일 계산
    calculateDates() {
      return this.rentList.map((rent) => {
        const rent_date = new Date(rent.rent_date);
        const return_date = new Date(rent.rent_date);
        return_date.setDate(return_date.getDate() + 14);
        const currentDate = new Date();
        const late_date = Math.max(
          0,
          (currentDate - return_date) / (1000 * 60 * 60 * 24)
        );

        if(late_date > 0) {
          this.updateRentState(rent.rent_no);
        }

        return {
          ...rent,
          rent_date: rent_date.toLocaleDateString("ko-KR", this.options),
          return_date: return_date.toLocaleDateString("ko-KR", this.options),
          late_date:
            Math.floor(late_date) > 0 ? Math.floor(late_date) + "일" : null,
        };
      });
    },

    // 대여예정일 계산
    reserveCalculateDate() {
      return this.reserveList.map((reserve) => {
        const reserv_date = new Date(reserve.reserv_date);
        const rent_dueDate = new Date(reserve.rent_date);
        rent_dueDate.setDate(rent_dueDate.getDate() + 14);

        const currentDate = new Date();

        if (rent_dueDate < currentDate) {
          return {
            ...reserve,
            reserv_date: reserv_date.toLocaleDateString("ko-KR", this.options),
            rent_dueDate: currentDate.toLocaleDateString("ko-KR", this.options),
          };
        } else {
          return {
            ...reserve,
            reserv_date: reserv_date.toLocaleDateString("ko-KR", this.options),
            rent_dueDate: rent_dueDate.toLocaleDateString(
              "ko-KR",
              this.options
            ),
          };
        }
      });
    },
  },
};
</script>

<style scoped>
@import "../../assets/css/mypage/rentReservation.css";
</style>
