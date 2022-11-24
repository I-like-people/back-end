import { authService } from "./firebase.js";

import { getCommentList, logoutgetCommentList } from "./pages/fanLog.js";
import { getMyCommentList } from "./pages/profile.js";

import { gps } from "./pages/weather.js"


const routes = {
  404: "/pages/404.html",
  "/": "/pages/home.html",
  fanLog: "/pages/fanLog.html",
  profile: "/pages/profile.html",
  auth: "/pages/auth.html",
};


export const handleLocation = async () => {
  let path = window.location.hash.replace("#", "");
  const pathName = window.location.pathname;

  // Live Server를 index.html에서 오픈할 경우
  if (pathName === "/index.html") {
    window.history.pushState({}, "", "/");
  }
  if (path.length == 0) {
    path = "/";
  }

  const route = routes[path] || routes[404];
  const html = await fetch(route).then((data) => data.text());
  document.getElementById("root").innerHTML = html;

  // 특정 화면 렌더링 되자마자 DOM 조작 처리
  if (path === "fanLog") {

    if (authService.currentUser == null) {

      document.querySelectorAll('.mypost').forEach(function (el) {
        el.style.display = 'none';
      }); // 로그인 하지 않은 유저가 들어왔을 때 입력창 숨기기

      logoutgetCommentList(); //로그인 하지 않은 유저가 들어왔을 때 버튼 없앤 함수

    } else {

      // 로그인한 회원의 프로필사진과 닉네임을 화면에 표시해줌.
      document.getElementById("nickname").textContent =
        authService.currentUser.displayName ?? "닉네임 없음";

      document.getElementById("profileImg").src =
        authService.currentUser.photoURL ?? "../assets/blankProfile.webp";

      gps();

      getCommentList();


    }

  }
  if (path === "profile") {
    // 프로필 관리 화면 일 때 현재 프로필 사진과 닉네임 할당
    document.getElementById("profileView").src =
      authService.currentUser.photoURL ?? "/assets/blankProfile.webp";
    document.getElementById("profileNickname").placeholder =
      authService.currentUser.displayName ?? "닉네임 없음";

    getMyCommentList();
  }
};

export const goToFanlog = () => {
  window.location.hash = "#fanLog";
};

export const goToAuth = () => {
  window.location.hash = "#auth";
};

export const goToProfile = () => {
  if (authService.currentUser == null) {
    alert('로그인 하세요')
  } else {
    window.location.hash = "#profile";
  };
}

