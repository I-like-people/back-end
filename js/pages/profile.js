import { authService, storageService } from "../firebase.js";
import {
  ref,
  uploadString,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";
import { updateProfile } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

export const changeProfile = async (event) => {
  event.preventDefault();
  document.getElementById("profileBtn").disabled = true;
  const imgRef = ref(
    storageService,
    `${authService.currentUser.uid}/${uuidv4()}`
  );
  //파이어스토어 안의 위치의 어떤 파일에 저장할 건지 정해준 것
  // 유저id 파일안에 이미지 파일 uuid를 넣어주었다.

  const newNickname = document.getElementById("profileNickname").value;
  // 프로필 이미지 dataUrl을 Storage에 업로드 후 다운로드 링크를 받아서 photoURL에 저장.

  const imgDataUrl = localStorage.getItem("imgDataUrl");
  //onFileChange함수에서 임시저장해두었던 imgDataUrl을 가져온다

  let downloadUrl;
  if (imgDataUrl) {
    const response = await uploadString(imgRef, imgDataUrl, "data_url");//ImgDataUrl을 storage로 보낸다. response는 정상적으로 storage에 업로드되었으면 결과로 오는 값

    downloadUrl = await getDownloadURL(response.ref);
  }//response 안의 ref 인자로 넣어서 다운로드 해주면 downloadUrl이 된다.

  await updateProfile(authService.currentUser, {
    displayName: newNickname ? newNickname : null,
    photoURL: downloadUrl ? downloadUrl : null,
  })
    .then(() => {
      alert("프로필 수정 완료");
      window.location.hash = "#fanLog";
    })
    .catch((error) => {
      alert("프로필 수정 실패");
      console.log("error:", error);
    });
};

export const onFileChange = (event) => {
  const theFile = event.target.files[0]; // file 객체
  const reader = new FileReader();
  reader.readAsDataURL(theFile);
  // file 객체를 브라우저가 읽을 수 있는 data URL로 읽음.

  reader.onloadend = (finishedEvent) => {
    // 파일리더가 파일객체를 data URL로 변환 작업을 끝났을 때

    const imgDataUrl = finishedEvent.currentTarget.result;
    localStorage.setItem("imgDataUrl", imgDataUrl);
    //변경한 이미지 파일이 바로 서버로 가지않고 프로필 변경을 누르기 전까지 잠시 로컬 스토리지에 저장되어있게하기(임시보관용으로 localstorage는 유용하다)
    document.getElementById("profileView").src = imgDataUrl;
    //임시보관이어도 화면에는 보여진다.
  };
};
