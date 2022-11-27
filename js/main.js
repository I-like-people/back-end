import { handleAuth, onToggle, logout } from "./pages/auth.js";
import { changeProfile, onFileChange } from "./pages/profile.js";
import { socialLogin } from "./pages/auth.js";
import { handleLocation, goToProfile, route, goNewsfeed, goIntro, goPost } from "./router.js";
import { authService } from "./firebase.js";
import {
  onFileChangeFeed,
  onFileChangeComment,
  save_comment,
  update_comment,
  onEditing,
  delete_comment,
} from "./pages/newsfeed.js";

import { filterword } from "./pages/search.js"

// url 바뀌면 handleLocation 실행하여 화면 변경
window.addEventListener("hashchange", handleLocation);

// 첫 랜딩 또는 새로고침 시 handleLocation 실행하여 화면 변경
document.addEventListener("DOMContentLoaded", function () {
  // Firebase 연결상태를 감시
  authService.onAuthStateChanged((user) => {

    // Firebase 연결되면 화면 표시
    handleLocation();
    // const hash = window.location.hash;
    if (user) {
      // if (hash === "") {
      //   // 로그인 상태에서는 로그인 화면으로 되돌아갈 수 없게 설정
      //   // window.location.replace("#newsfeed");
      // }
    } else {
      // 로그아웃 상태이므로 로그인 화면으로 강제 이동
      // if (hash !== "") {
      //   // window.location.replace("");
      // }
    }
  });
});

// onclick, onchange, onsubmit 이벤트 핸들러 리스트
window.onToggle = onToggle;
window.handleAuth = handleAuth;
window.goToProfile = goToProfile;
window.socialLogin = socialLogin;
window.logout = logout;
window.onFileChange = onFileChange;
window.changeProfile = changeProfile;
window.save_comment = save_comment;
window.update_comment = update_comment;
window.onEditing = onEditing;
window.delete_comment = delete_comment;
window.route = route;
window.goNewsfeed = goNewsfeed;
window.goIntro = goIntro;
window.goPost = goPost;
window.onFileChangeFeed = onFileChangeFeed;
window.onFileChangeComment = onFileChangeComment;
window.filterword = filterword;
