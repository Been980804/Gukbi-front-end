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
							<img src="../../assets/images/plus.svg" alt="">
						</button>
					</div>
				</div>
				<div class="notice_contents">
					<ul>
						<li>
							<a href="#">
								<div class="noti">국립중앙도서관 우편복사 서비스 지연 안내</div>
								<div class="date">2024-02-22</div>
							</a>
						</li>
						<li>
							<a href="#">
								<div class="noti">학술자료부터 문화예술자료까지 다양한 온라인 콘텐츠 제공</div>
								<div class="date">2024-02-22</div>
							</a>
						</li>
						<li>
							<a href="#">
								<div class="noti">2024년 근하신년</div>
								<div class="date">2024-02-22</div>
							</a>
						</li>
						<li>
							<a href="#">
								<div class="noti">제12차 「해설이 있는 K-컬처」 프로그램 안내</div>
								<div class="date">2024-02-22</div>
							</a>
						</li>
						<li>
							<a href="#">
								<div class="noti">국립중앙도서관 「열린마당」 방문 인증 이벤트 당첨자 발표</div>
								<div class="date">2024-02-22</div>
							</a>
						</li>
					</ul>
				</div>
				</div>
				<!-- recent -->
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
						console.log(this.notiList);
          } else { // 응답실패
            console.log("BookListView book/bookList 응답실패");
          }
        })
		}
	}
}
</script>

<style>
@import "../../assets/css/common/footer.css";
</style>