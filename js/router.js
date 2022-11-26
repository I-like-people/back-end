import { authService } from "./firebase.js";

import { getCommentList, logoutgetCommentList } from "./pages/newsfeed.js";
import { getMyCommentList } from "./pages/profile.js";

import { gps } from "./pages/weather.js"


const routes = {
  404: "/pages/404.html",
  "/": "/pages/intro.html",
  newsfeed: "/pages/newsfeed.html",
  profile: "/pages/profile.html",
  auth: "/pages/auth.html",
  post: "/pages/post.html",
};

// 새로고침 막기
export const route = (event) => {
  event.preventDefault()
  window.location.hash = event.target.hash;
}

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
  if (path === "newsfeed") {
    gps();
    if (authService.currentUser == null) {

      const postBtn = document.getElementById("postBtn");
      postBtn.style.display = "none";

      document.querySelectorAll('.logoutBox').forEach(function (el) {
        el.style.display = 'none';
      });
      logoutgetCommentList();
    } else {
      document.querySelectorAll('.loginBox').forEach(function (el) {
        el.style.display = 'none';
      });

      document.getElementById("smallprofile").src =
        authService.currentUser?.photoURL ?? "../assets/blankProfile.webp";
      getCommentList();
    }
  }

  if (path === "profile") {
    // 프로필 관리 화면 일 때 현재 프로필 사진과 닉네임 할당
    document.getElementById("profileView").src =
      authService.currentUser?.photoURL ?? "/assets/blankProfile.webp";
    document.getElementById("profileNickname").placeholder =
      authService.currentUser?.displayName ?? "닉네임 없음";
    getMyCommentList();

  }

  if (path === "post") {
    // 프로필 관리 화면 일 때 현재 프로필 사진과 닉네임 할당
    document.getElementById("nickname").textContent =
      authService.currentUser?.displayName ?? "닉네임 없음";

    document.getElementById("profileImg").src =
      authService.currentUser?.photoURL ?? "../assets/blankProfile.webp";
    getCommentList();

  }



};

export const goToProfile = () => {
  window.location.hash = "#profile";
};

export const goNewsfeed = () => {
  window.location.hash = "#newsfeed";
}

export const goIntro = () => {
  window.location.hash = "/";
}

export const goPost = () => {
  window.location.hash = "#post";
}