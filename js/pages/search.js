export function filterword() {
  let search = document.getElementById("search").value.toLowerCase();

  let listInner = document.getElementsByClassName("card commentCard");



  for (let i = 0; i < listInner.length; i++) {
    const commentText = listInner[i].getElementsByClassName("commentText");

    const CommentNickname = listInner[i].getElementsByClassName("commentNickname");

    if (commentText[0].innerHTML.toLowerCase().indexOf(search) != -1 ||
      CommentNickname[0].innerHTML.toLowerCase().indexOf(search) != -1
    ) {
      listInner[i].style.display = "flex"
    } else {
      listInner[i].style.display = "none"
    }
  }
}