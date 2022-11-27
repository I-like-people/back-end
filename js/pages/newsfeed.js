import {
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  orderBy,
  query,
  getDocs,
  where,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

import { authService, storageService, dbService } from "../firebase.js";
import {
  ref,
  uploadString,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";

import { v4 as uuidv4 } from "https://jspm.dev/uuid";

import { getMyCommentList } from "../pages/profile.js"

export const save_comment = async (event) => {
  event.preventDefault();

  const imgRef = ref(
    storageService,
    `${authService.currentUser.uid}/${uuidv4()}`
  );
  // 프로필 이미지 dataUrl을 Storage에 업로드 후 다운로드 링크를 받아서 photoURL에 저장.
  const imgDataUrl = localStorage.getItem("imgDataUrl");
  let downloadUrl;
  if (imgDataUrl) {
    const response = await uploadString(imgRef, imgDataUrl, "data_url");
    downloadUrl = await getDownloadURL(response.ref);
  }

  const comment = document.getElementById("comment");
  const { uid, photoURL, displayName } = authService.currentUser;
  try {
    await addDoc(collection(dbService, "comments"), {
      text: comment.value,
      createdAt: Date.now(),
      creatorId: uid,
      profileImg: photoURL,
      nickname: displayName,
      feedImg: downloadUrl,
    });
    comment.value = "";
    getCommentList();
    alert("글 작성 완료")
    localStorage.clear();
    window.location.hash = "#newsfeed";
  } catch (error) {
    alert(error);
    console.log("error in addDoc:", error);
  }
};

export const onEditing = (event) => {
  // 수정버튼 클릭
  event.preventDefault();
  const udBtns = document.querySelectorAll(".editBtn, .deleteBtn");
  udBtns.forEach((udBtn) => (udBtn.disabled = "true"));

  const cardBody = event.target.parentNode.parentNode;
  const commentText = cardBody.children[0].children[0];
  const commentInputP = cardBody.children[0].children[1];
  const commentFile = cardBody.children[0].children[2];

  commentText.classList.add("noDisplay");
  commentInputP.classList.add("d-flex");
  commentInputP.classList.remove("noDisplay");
  commentFile.classList.add("d-flex");
  commentFile.classList.remove("noDisplay");
  commentInputP.children[0].focus();
};

export const update_comment = async (event) => {
  event.preventDefault();
  const newComment = event.target.parentNode.children[0].value;
  const id = event.target.parentNode.id;

  const imgRef = ref(
    storageService,
    `${authService.currentUser.uid}/${uuidv4()}`
  );
  // 프로필 이미지 dataUrl을 Storage에 업로드 후 다운로드 링크를 받아서 photoURL에 저장.
  const imgDataUrl = localStorage.getItem("imgDataUrl");
  let downloadUrl;
  if (imgDataUrl) {
    const response = await uploadString(imgRef, imgDataUrl, "data_url");
    downloadUrl = await getDownloadURL(response.ref);
  }

  const commentRef = doc(dbService, "comments", id);
  try {
    await updateDoc(commentRef, { text: newComment, feedImg: downloadUrl });
    localStorage.clear();
    getCommentList();
    getMyCommentList();
  } catch (error) {
    alert(error);
  }
};

export const delete_comment = async (event) => {
  event.preventDefault();
  const id = event.target.name;
  const ok = window.confirm("해당 글을 정말 삭제하시겠습니까?");
  if (ok) {
    try {
      await deleteDoc(doc(dbService, "comments", id));
      getCommentList();
      getMyCommentList();
    } catch (error) {
      alert(error);
    }
  }
};



export const getCommentList = async () => {
  let cmtObjList = [];
  const q = query(
    collection(dbService, "comments"),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const commentObj = {
      id: doc.id,
      ...doc.data(),
    };

    cmtObjList.push(commentObj);
  });

  const commnetList = document.getElementById("Mainbox js-loop");
  const currentUid = authService.currentUser?.uid;
  commnetList.innerHTML = "";
  cmtObjList.forEach((cmtObj) => {
    const isOwner = currentUid === cmtObj.creatorId;
    const temp_html = `<div class="card commentCard">
          <div class="card-body">
              <blockquote class="blockquote mb-0">
                  <p class="commentText">${cmtObj.text}</p>
                  <p id="${cmtObj.id}" class="noDisplay"> 
                  <input class="newCmtInput" type="text" maxlength="100" />
      <button class="updateBtn" onclick="update_comment(event)" >완료</button>
      </p>
      <p class="noDisplay"><input onchange="onFileChangeComment(event)" type="file" accept="images/*" /></p>
      <p> <img id="feedImg" src="${cmtObj.feedImg
      }" height="150px"></p>
        
                  <footer class="quote-footer">
                  <div>BY&nbsp;&nbsp;<img class="cmtImg" width="50px" height="50px" src="${cmtObj.profileImg
      }" alt="profileImg" />
      
      <span class="commentNickname">${cmtObj.nickname ?? "닉네임 없음"}</span>
      </div>
      
      <div class="cmtAt">${new Date(cmtObj.createdAt).toString().slice(0, 25)}</div>
      </footer>

              </blockquote>
              
              <div class="${isOwner ? "updateBtns" : "noDisplay"}">
                  
                   <button onclick="onEditing(event)" class="editBtn btn btn-dark" >수정</button>
                <button name="${cmtObj.id
      }" onclick="delete_comment(event)" class="deleteBtn btn btn-dark" >삭제</button>
              </div>  
                <button onclick="reply(${cmtObj.createdAt})" class="deleteBtn btn btn-dark" id="openreplybtn" >댓글</button>          
            </div>
     </div>`;
    const div = document.createElement("div");
    div.classList.add("mycards");
    div.innerHTML = temp_html;
    commnetList.appendChild(div);

  });
};

export const logoutgetCommentList = async () => {
  let cmtObjList = [];
  const q = query(
    collection(dbService, "comments"),
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
  const commnetList = document.getElementById("Mainbox js-loop");
  commnetList.innerHTML = "";// 불러오기 전에 초기화(이거 안 하면 계속 반복되는 내용 쌓일 것 같다)
  cmtObjList.forEach((cmtObj) => {
    const temp_html = `<div class="card commentCard">
          <div class="card-body">
              <blockquote class="blockquote mb-0">
                  <p class="commentText">${cmtObj.text}</p>
                  <p id="${cmtObj.id
      }" class="noDisplay"><input class="newCmtInput" type="text" maxlength="30" /><button class="updateBtn" onclick="update_comment(event)">완료</button></p>
      <p> <img id="feedImg" src="${cmtObj.feedImg
      }" height="150px"></p>
                  <footer class="quote-footer"><div>BY&nbsp;&nbsp;<img class="cmtImg" width="50px" height="50px" src="${cmtObj.profileImg
      }" alt="profileImg" /><span class="commentNickname">${cmtObj.nickname ?? "닉네임 없음"
      }</span></div><div class="cmtAt">${new Date(cmtObj.createdAt)
        .toString()
        .slice(0, 25)}</div></footer>
              </blockquote>                 
            </div>
     </div>`;
    const div = document.createElement("div");
    div.classList.add("mycards");
    div.innerHTML = temp_html;
    commnetList.appendChild(div);
  });
};

export const onFileChangeFeed = (event) => {
  const theFile = event.target.files[0]; // file 객체
  const reader = new FileReader();
  reader.readAsDataURL(theFile);
  // file 객체를 브라우저가 읽을 수 있는 data URL로 읽음.

  reader.onloadend = (finishedEvent) => {
    // 파일리더가 파일객체를 data URL로 변환 작업을 끝났을 때

    const imgDataUrl = finishedEvent.currentTarget.result;
    localStorage.setItem("imgDataUrl", imgDataUrl);
    //변경한 이미지 파일이 바로 서버로 가지않고 프로필 변경을 누르기 전까지 잠시 로컬 스토리지에 저장되어있게하기(임시보관용으로 localstorage는 유용하다)
    // document.getElementById("feedView").src = imgDataUrl;
    //임시보관이어도 화면에는 보여진다.
    document.getElementById("feedView").src = imgDataUrl;
  };
};

export const onFileChangeComment = (event) => {
  const theFile = event.target.files[0]; // file 객체
  const reader = new FileReader();
  reader.readAsDataURL(theFile);
  // file 객체를 브라우저가 읽을 수 있는 data URL로 읽음.

  reader.onloadend = (finishedEvent) => {
    // 파일리더가 파일객체를 data URL로 변환 작업을 끝났을 때

    const imgDataUrl = finishedEvent.currentTarget.result;
    localStorage.setItem("imgDataUrl", imgDataUrl);
    //변경한 이미지 파일이 바로 서버로 가지않고 프로필 변경을 누르기 전까지 잠시 로컬 스토리지에 저장되어있게하기(임시보관용으로 localstorage는 유용하다)
    // document.getElementById("feedView").src = imgDataUrl;
    //임시보관이어도 화면에는 보여진다.
    document.getElementById("feedImg").src = imgDataUrl;
  };
};

//댓글 기능 - 클릭시
export const reply = (doctime) => {


  document.querySelectorAll('.mypost').forEach(function (el) {
    el.style.display = 'block';
  });

  document.querySelectorAll('.reply-list').forEach(function (el) {
    el.style.display = 'block';
  });

  const replybtn = document.getElementById("replybtn");
  replybtn.addEventListener('click', (event) => save_reply(event, doctime)
  )

  const closebtn = document.getElementById("closebtn");
  closebtn.addEventListener('click', (event) => close_reply(event, doctime)
  )

  getreplyList(doctime);
}

//댓글 불러오기
export const getreplyList = async (doctime) => {
  let cmtObjList = [];
  const q = query(
    collection(dbService, "replies"),
    where("feedTime", "==", doctime),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const commentObj = {
      id: doc.id,
      ...doc.data(),
    };
    cmtObjList.push(commentObj);
  });

  const commnetList = document.getElementById("reply-list");
  const currentUid = authService.currentUser?.uid;
  commnetList.innerHTML = "";
  cmtObjList.forEach((cmtObj) => {
    const isOwner = currentUid === cmtObj.creatorId;
    const temp_html = `<div class="card commentCard">
          <div class="card-body">
              <blockquote class="blockquote mb-0">
                  <p class="commentText">${cmtObj.text}</p>
                  <p id="${cmtObj.id}" class="noDisplay"> 
                  <input class="newCmtInput" type="text" maxlength="100" />
      <button class="updateBtn" onclick="update_reply(event, ${cmtObj.feedTime})">완료</button>
      </p>
                  <footer class="quote-footer">
                  <div>BY&nbsp;&nbsp;<img class="cmtImg" width="50px" height="50px" src="${cmtObj.profileImg
      }" alt="profileImg" />  
      <span class="commentNickname">${cmtObj.nickname ?? "닉네임 없음"}</span>
      </div>
      <div class="cmtAt">${new Date(cmtObj.createdAt).toString().slice(0, 25)}</div>
      </footer>
              </blockquote>
              <div class="${isOwner ? "updateBtns" : "noDisplay"}">
                   <button onclick="onEditing(event)" class="editBtn btn btn-dark" >수정</button>
                <button name="${cmtObj.id
      }" class="deleteBtn btn btn-dark" onclick="delete_reply(event, ${cmtObj.feedTime})" >삭제</button>
              </div>            
            </div>
     </div>`;
    const div = document.createElement("div");
    div.classList.add("mycards");
    div.innerHTML = temp_html;
    commnetList.appendChild(div);

  });
};

//댓글 저장
export const save_reply = async (event, doctime) => {
  event.preventDefault();

  const comment = document.getElementById("comment");
  const { uid, photoURL, displayName } = authService.currentUser;
  try {
    await addDoc(collection(dbService, "replies"), {
      text: comment.value,
      createdAt: Date.now(),
      creatorId: uid,
      profileImg: photoURL,
      nickname: displayName,
      feedTime: doctime
    });
    comment.value = "";
    getreplyList(doctime);
    alert("댓글 작성 완료")
    document.getElementById("replybtn").disabled = false;
    window.location.hash = "#newsfeed";
  } catch (error) {
    alert(error);
    console.log("error in addDoc:", error);
  }
};

//댓글 수정
export const update_reply = async (event, doctime) => {
  event.preventDefault();
  const newComment = event.target.parentNode.children[0].value;
  const id = event.target.parentNode.id;

  const commentRef = doc(dbService, "replies", id);
  try {
    await updateDoc(commentRef, { text: newComment });
    getreplyList(doctime);
  } catch (error) {
    alert(error);
  }
};

//댓글 삭제
export const delete_reply = async (event, doctime) => {
  event.preventDefault();
  const id = event.target.name;
  const ok = window.confirm("해당 댓글을 정말 삭제하시겠습니까?");
  if (ok) {
    try {
      await deleteDoc(doc(dbService, "replies", id));
      getreplyList(doctime);
    } catch (error) {
      alert(error);
    }
  }
};

export const close_reply = (event, doctime) => {
  event.preventDefault();

  document.querySelectorAll('.mypost').forEach(function (el) {
    el.style.display = 'none';
  });

  const replyList = document.getElementById("reply-list");
  replyList.innerHTML = "";

  doctime
}