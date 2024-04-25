<template>

  <div class="footer">
		<!-- footer contents -->
		<div class="footer_contents">
			<!-- notice -->
			<div class="notice">
				<div class="notice_title">
					<div class="title_text"><p>공지사항</p></div>
					<div class="title_plus_icon">
						<button class="imgbtn" type="button">
							<img src="../../assets/images/plus.svg">
						</button>
					</div>
				</div>
				<div class="notice_contents">
					<ul>
						<li v-for="noti in notiList" :key="noti" @click="goNoti(noti.noti_no)">
							<a href="#">
								<div class="noti">{{ noti.noti_title }}</div>
								<div class="date">{{ noti.mod_date }}</div>
							</a>
						</li>
					</ul>
				</div>
				</div>
				<div class="recent">
			</div>
		</div>
		
		<!-- footer copyright -->
		<div class="footer_copyright">
				<span>Copyright © 2024. All rights reserved.</span>
		</div>
	</div>
		
</template>

<script>
import api from "@/api/axios";
export default {
	data() {
		return {
			notiList: {}
		}
	},

	created() {
		this.getNotiInfo();
	},

	methods: {
		getNotiInfo() { // 최신 5개의 공지사항 가져오기
			api.get(`/main/notiList`)
        .then(res => {
          if (res.common.res_code == 200) { // 응답성공
            this.notiList = res.data.notiList;
          } else { // 응답실패
            console.log("BookListView book/bookList 응답실패");
          }
        })
		},

		goNoti(notiNo) { // 공지사항 상세 화면으로 이동
			this.$router.push({ name: 'NotificationList', params: { "notiNo": notiNo}} );
		}
	}
}
</script>

<style>
@import "../../assets/css/common/footer.css";
</style>