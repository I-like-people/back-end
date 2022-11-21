import { authService } from "./firebase.js";
import { handleLocation, route } from "./router.js";

// hash url 변경 시 처리
window.addEventListener("hashchange", handleLocation);

// 첫 랜딩 또는 새로고침 시 처리
document.addEventListener("DOMContentLoaded", () => {

  handleLocation()
  // 로그인 상태 모니터링
  authService.onAuthStateChanged((user) => {
    // Firebase 연결되면 화면 표시
    // user === authService.currentUser 와 같은 값
    if (user) {
      // 로그인 상태인 경우
      alert('로그인 상태')
    } else {
      // 로그아웃 상태인 경우
      alert('로그아웃 상태')
      // window.location.replace("#home");
    }
  });
});

// 전역 함수 리스트
window.route = route;

