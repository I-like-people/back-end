import { authService, storageService, dbService } from "../firebase.js";
import {
  ref,
  uploadString,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";
import { updateProfile } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import {
  collection,
  where, //where query 추가
  orderBy,
  query,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

export const changeProfile = async (event) => {
  event.preventDefault();
  document.getElementById("profileBtn").disabled = true;
  const imgRef = ref(
    storageService,
    `${authService.currentUser.uid}/${uuidv4()}`
  );

  const newNickname = document.getElementById("profileNickname").value;
  // 프로필 이미지 dataUrl을 Storage에 업로드 후 다운로드 링크를 받아서 photoURL에 저장.
  const imgDataUrl = localStorage.getItem("imgDataUrl");
  let downloadUrl;
  if (imgDataUrl) {
    const response = await uploadString(imgRef, imgDataUrl, "data_url");
    downloadUrl = await getDownloadURL(response.ref);
  }
  await updateProfile(authService.currentUser, {
    displayName: newNickname ? newNickname : null,
    photoURL: downloadUrl ? downloadUrl : null,
  })
    .then(() => {
      alert("프로필 수정 완료");
      window.location.hash = "#newsfeed";
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

export const getMyCommentList = async () => {
  let cmtObjList = [];
  const q = query(
    collection(dbService, "comments"),
    where("creatorId", "==", authService.currentUser.uid),
    //현재 유저 아이디랑 같은 글만 뽑아줘라
    //creatorId랑 createdAt을 둘 다 반영하게 해주는 복헙색인을 생성해야한다 아니면 오류난다.
    orderBy("createdAt", "desc")
  );//데이터 불러오는 쿼리들 써서 q에 넣어준다
  const querySnapshot = await getDocs(q);
  //getDocs에 쿼리 넣어준다
  querySnapshot.forEach((doc) => {
    //배열을 하나씩 뽑아준다 반복문으로 하나씩 돌려주는 것과 같다.
    //doc.data()는 이 안에서만 존째할 수 있다.
    const commentObj = {
      id: doc.id,
      ...doc.data(),
    };
    cmtObjList.push(commentObj);
  });
  const commnetList = document.getElementById("my-comment-list");
  const currentUid = authService.currentUser.uid;
  commnetList.innerHTML = "";// 불러오기 전에 초기화(이거 안 하면 계속 반복되는 내용 쌓일 것 같다)
  cmtObjList.forEach((cmtObj) => {
    const isOwner = currentUid === cmtObj.creatorId;
    const temp_html = `<div class="card commentCard">
          <div class="card-body">
              <blockquote class="blockquote mb-0">
                  <p class="commentText">${cmtObj.text}</p>
                  <p id="${cmtObj.id
      }" class="noDisplay"><input class="newCmtInput" type="text" maxlength="30" /><button class="updateBtn" onclick="update_comment(event)">완료</button></p>
                  <footer class="quote-footer"><div>BY&nbsp;&nbsp;<img class="cmtImg" width="50px" height="50px" src="${cmtObj.profileImg
      }" alt="profileImg" /><span>${cmtObj.nickname ?? "닉네임 없음"
      }</span></div><div class="cmtAt">${new Date(cmtObj.createdAt)
        .toString()
        .slice(0, 25)}</div></footer>
              </blockquote>
              <div class="${isOwner ? "updateBtns" : "noDisplay"}">
                   <button onclick="onEditing(event)" class="editBtn btn btn-dark">수정</button>
                <button name="${cmtObj.id
      }" onclick="delete_comment(event)" class="deleteBtn btn btn-dark">삭제</button>
              </div>            
            </div>
     </div>`;
    const div = document.createElement("div");
    div.classList.add("mycards");
    div.innerHTML = temp_html;
    commnetList.appendChild(div);
  });
};
