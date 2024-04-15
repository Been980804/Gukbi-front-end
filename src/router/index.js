import { createWebHistory, createRouter } from "vue-router";

import Main from "../views/MainView.vue";
import Login from "../views/user/LoginView.vue";
import Join from "../views/user/JoinView.vue";

// 마이페이지 import
import UserInfo from "../views/mypage/UserInfoView.vue";
import RentReserve from "../views/mypage/RentReservationView.vue";
import RentedList from "../views/mypage/RentedListView.vue";
import HopeBook from "../views/mypage/HopeBookView.vue";
import MyBookPly from "../views/mypage/MyBookPlyView.vue";
import MyInquiry from "../views/mypage/MyInquiryView.vue";
import MyBookTrade from "../views/mypage/MyBookTradeView.vue";

// 관리자화면 import
import MgrBookList from "../views/manage/BookListView.vue";	// 도서관리
import MgrBookDetail from "../views/manage/BookDetailView.vue";	// 도서관리 상세
import MgrBookDetailReg from "../views/manage/BookDetailRegView.vue";	// 도서관리 등록
import MgrBookSug from "../views/manage/BookSugView.vue"; // 도서관리-추천도서
import MgrBookSugReg from "../views/manage/BookSugRegView.vue"; // 도서관리-추천도서 등록
import MgrUserList from "../views/manage/UserListView.vue"; // 회원관리
import MgrUserInfoView from "../views/manage/UserInfoView.vue"; // 회원관리 상세
import MgrRentalList from "../views/manage/RentalListView.vue"; // 대여연체관리
import MgrReserveList from "../views/manage/ReserveListView.vue"; // 예약관리
import MgrNotiList from "../views/manage/NotiListView.vue"; // 게시판관리-공지사항
import MgrNotiDetail from "../views/manage/NotiDetailView.vue"; // 게시판관리-공지사항 상세
import MgrNotiDetailReg from "../views/manage/NotiDetailRegView.vue"; // 게시판관리-공지사항 등록/수정
import MgrInquiryList from "../views/manage/InquiryListView.vue"; // 게시판관리-문의사항
import MgrInquiryDetail from "../views/manage/InquiryDetailView.vue"; // 게시판관리-문의사항 상세
import MgrTradeList from "../views/manage/TradeListView.vue"; // 게시판관리-도서거래
import MgrTradeDetail from "../views/manage/TradeDetailView.vue"; // 게시판관리-도서거래 상세
import MgrApplList from "../views/manage/ApplListView.vue"; // 게시판관리-희망도서

// 도서마당
// import NotificationList from "../views/madang/NotificationListView.vue";	// 공지사항

const routes = [
	{ path: "/", name: "Main", component: Main, },
	{ path: "/Login", name: "Login", component: Login, },
	{ path: "/Join", name: "Join", component: Join, },

	// 마이페이지
	{ path: "/UserInfo", name: "UserInfo", component: UserInfo,},
	{ path: "/RentReserve", name: "RentReservation", component: RentReserve},
	{ path: "/RentedList", name: "RentedList", component: RentedList},
	{ path: "/HopeBook", name: "HopeBook", component: HopeBook},
	{ path: "/MyBookPly", name: "MyBookPly", component: MyBookPly},
	{ path: "/MyInquiry", name: "MyInquiry", component: MyInquiry},
	{ path: "/MyBookTrade", name: "MyBookTrade", component: MyBookTrade},

	// 관리자화면
	{ path: "/MgrBookList", name: "MgrBookList", component: MgrBookList},
	{ path: "/MgrBookDetail", name: "MgrBookDetail", component: MgrBookDetail},
	{ path: "/MgrBookDetailReg", name: "MgrBookDetailReg", component: MgrBookDetailReg},
	{ path: "/MgrBookSug", name: "MgrBookSug", component: MgrBookSug},
	{ path: "/MgrBookSugReg", name: "MgrBookSugReg", component: MgrBookSugReg},
	{ path: "/MgrUserList", name: "MgrUserList", component: MgrUserList},
	{ path: "/MgrUserInfoView", name: "MgrUserInfoView", component: MgrUserInfoView},
	{ path: "/MgrRentalList", name: "MgrRentalList", component: MgrRentalList},
	{ path: "/MgrReserveList", name: "MgrReserveList", component: MgrReserveList},
	{ path: "/MgrNotiList", name: "MgrNotiList", component: MgrNotiList},
	{ path: "/MgrNotiDetail", name: "MgrNotiDetail", component: MgrNotiDetail},
	{ path: "/MgrNotiDetailReg", name: "MgrNotiDetailReg", component: MgrNotiDetailReg},
	{ path: "/MgrInquiryList", name: "MgrInquiryList", component: MgrInquiryList},
	{ path: "/MgrInquiryDetail", name: "MgrInquiryDetail", component: MgrInquiryDetail},
	{ path: "/MgrTradeList", name: "MgrTradeList", component: MgrTradeList},
	{ path: "/MgrTradeDetail", name: "MgrTradeDetail", component: MgrTradeDetail},
	{ path: "/MgrApplList", name: "MgrApplList", component: MgrApplList},

	// 도서마당
	// { path: "/NotificationList", name: "NotificationList", component: NotificationList},
];

const router = createRouter({
  scrollBehavior() {
    return {top: 0};
  },
	history: createWebHistory(),
	routes,
})

export default router;