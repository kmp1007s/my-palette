let isAddModalOpen = false; //색상 추가 모달의 가시 여부
let isUpdModalOpen = false; //색상 수정 모달의 가시 여부

const navColor = document.querySelector(".nav-color"); // 색상모음

const lstColorParent = document.querySelector(".color-box-list"); // 리스트 감싸는 ul

const addModal = document.querySelector(".add-modal"); // 색상 추가 모달
const updModal = document.querySelector(".update-modal"); // 색상 업데이트 모달

const addTitleInput = document.getElementById("add-modal-title");
const addCodeInput = document.getElementById("add-modal-code");

const updOldCircle = document.querySelector(".update-modal-circle");
const updOldTitle = document.querySelector(".update-modal-title");
const updOldCode = document.querySelector(".update-modal-code");

const updNewTitle = document.querySelector(".update-modal-title-new");
const updNewCode = document.querySelector(".update-modal-code-new");
const updNewCircle = document.querySelector(".update-modal-circle-new");

const updTitleInput = document.getElementById("update-modal-title-input");
const updCodeInput = document.getElementById("update-modal-code-input");

window.addEventListener("load", windowLoaded);
window.addEventListener("keyup", windowKeyUp);

function windowKeyUp(e) {
  if (isAddModalOpen) {
    //ESC
    if (e.keyCode == 27) closeAddModal();

    //Enter
    if (e.keyCode == 13) {
      const colorTitle = addTitleInput.value;
      const colorCode = addCodeInput.value;

      addNewColor(colorTitle, colorCode);
    }
  }

  if (isUpdModalOpen) {
    //ESC
    if (e.keyCode == 27) closeUpdModal();

    //Enter
    if (e.keyCode == 13) {
      const oldTitle = updOldTitle.innerHTML;
      const newTitle = updTitleInput.value;
      const newCode = updCodeInput.value;

      updateColor(oldTitle, newTitle, newCode);
    }
  }
}

function windowLoaded(e) {
  const addColorTxt = document.querySelector(".add-txt"); // 색상 추가 텍스트 (추가하기)
  const addColorIcon = document.querySelector(".add-icon"); // 색상 추가 아이콘

  const addModalSaveBtn = document.querySelector(".add-modal-save"); // 색상 추가 버튼
  const addModalCloseBtn = document.querySelector(
    //색상 추가 모달 종료 버튼
    ".add-modal-close"
  );

  const updModalSaveBtn = document.querySelector(
    //색상 수정 모달 완료 버튼
    ".update-modal-save"
  );
  const updModalCloseBtn = document.querySelector(
    //색상 수정 모달 취소 버튼
    ".update-modal-cancel"
  );

  initUI();

  addColorTxt.addEventListener("click", openAddModal);
  addColorIcon.addEventListener("click", openAddModal);

  addTitleInput.addEventListener("focus", showInputNotice);
  addTitleInput.addEventListener("blur", hideInputNotice);

  addModalCloseBtn.addEventListener("click", closeAddModal);
  addModalSaveBtn.addEventListener("click", e => {
    const colorTitle = addTitleInput.value;
    const colorCode = addCodeInput.value;

    addNewColor(colorTitle, colorCode);
  });

  updTitleInput.addEventListener("keyup", e => {
    updNewTitle.innerHTML = e.target.value;
  });

  updCodeInput.addEventListener("keyup", e => {
    updNewCircle.style.backgroundColor = e.target.value;
    updNewCode.innerHTML = e.target.value;
  });

  updModalSaveBtn.addEventListener("click", e => {
    const oldTitle = updOldTitle.innerHTML;
    const newTitle = updTitleInput.value;
    const newCode = updCodeInput.value;

    updateColor(oldTitle, newTitle, newCode);
  });

  updModalCloseBtn.addEventListener("click", closeUpdModal);
}

/* 처음 UI 로딩 시 애니메이션 효과를 주고 싶은 경우 HTML이 아니라 이 부분에 작성 */
function initUI() {
  navColor.classList.add("selected-nav");
  loadColors();
}

function loadColors() {
  const colors = [];
  const keys = Object.keys(localStorage);

  // 로컬 스토리지의 모든 값을 읽어들임
  for (let i = 0; i < localStorage.length; i++) {
    let colorTitle = keys[i];
    let colorCode = localStorage.getItem(keys[i]);

    let color = {
      colorTitle,
      colorCode
    };

    colors.push(color);
  }

  for (let color of colors) {
    insertColor(color.colorTitle, color.colorCode);
  }
}

function isColorCodeRight(colorCode) {
  // 컬러코드의 값은 길이가 7이면서 #이 포함되어야 함
  if (colorCode.length == 7 && colorCode.includes("#")) {
    return true;
  }

  return false;
}

function isColorTitleExist(colorTitle) {
  const lstColor = lstColorParent.children;

  for (let i = 1; i < lstColor.length; i++) {
    const existColorTitle = lstColor[i].children[1].innerHTML;

    if (colorTitle == existColorTitle) {
      return true;
    }
  }

  return false;
}

function addNewColor(colorTitle, colorCode) {
  if (isColorCodeRight(colorCode)) {
    if (isColorTitleExist(colorTitle)) {
      alert("이미 존재하는 색상입니다");
      return;
    }

    svColorStorage(colorTitle, colorCode);
    alert("저장되었습니다!");

    insertColor(colorTitle, colorCode);
    closeAddModal();

    return;
  }
  alert("코드 값이 이상합니다\n#aaaaaa의 형태로 입력해주세요.");
  return;
}

function svColorStorage(colorTitle, colorCode) {
  localStorage.setItem(colorTitle, colorCode);
}

function rmColorStorage(colorTitle) {
  localStorage.removeItem(colorTitle);
}

function insertColor(colorTitle, colorCode) {
  const newColor = createNewColor(colorTitle, colorCode);
  lstColorParent.appendChild(newColor);
}

function createNewColor(colorTitle, colorCode) {
  const newColor = document.createElement("li");
  newColor.className = "color-box-item";

  const newCircle = document.createElement("div");
  newCircle.className = "color-box-item-circle";
  newCircle.style.backgroundColor = colorCode;
  newCircle.addEventListener("click", e => {
    circleClicked(colorCode);
  });

  const newTitle = document.createElement("div");
  newTitle.innerHTML = colorTitle;
  newTitle.className = "color-box-title";

  const newCode = document.createElement("div");
  newCode.innerHTML = colorCode;
  newCode.className = "color-box-color-code";

  const newUpdateBtn = document.createElement("a");
  newUpdateBtn.href = "#";
  newUpdateBtn.innerHTML = "수정";
  newUpdateBtn.className = "color-box-update-btn";
  newUpdateBtn.addEventListener("click", e => {
    openUpdModal(colorTitle, colorCode);
  });

  const newDelBtn = document.createElement("a");
  newDelBtn.href = "#";
  newDelBtn.innerHTML = "삭제";
  newDelBtn.addEventListener("click", e => {
    const choice = confirm('"' + colorTitle + '"' + "을 삭제할까요?");

    if (choice) {
      rmColor(colorTitle);
      alert(colorTitle + "을 삭제했습니다!");
    }
  });

  const newBtnDiv = document.createElement("div");
  newBtnDiv.appendChild(newUpdateBtn);
  newBtnDiv.appendChild(newDelBtn);

  newColor.appendChild(newCircle);
  newColor.appendChild(newTitle);
  newColor.appendChild(newCode);
  newColor.appendChild(newBtnDiv);

  return newColor;
}

function openUpdModal(colorTitle, colorCode) {
  isUpdModalOpen = true;

  focusOn(updModal);
  updModal.classList.toggle("hide-update-modal");

  updOldTitle.innerHTML = colorTitle;
  updOldCode.innerHTML = colorCode;
  updOldCircle.style.backgroundColor = colorCode;

  updNewTitle.innerHTML = colorTitle;
  updNewCode.innerHTML = colorCode;
  updNewCircle.style.backgroundColor = colorCode;
}

function updateColor(oldTitle, newTitle, newCode) {
  if (isColorCodeRight(newCode)) {
    if (isColorTitleExist(newTitle)) {
      alert("이미 존재하는 색상입니다");
      return;
    }

    rmColorStorage(oldTitle);
    rmColor(oldTitle);
    svColorStorage(newTitle, newCode);
    insertColor(newTitle, newCode);

    alert("수정되었습니다");
    closeUpdModal();

    return;
  }

  alert("코드 값이 이상합니다\n#aaaaaa의 형태로 입력해주세요.");
  return;
}

function closeUpdModal() {
  isUpdModalOpen = false;

  updTitleInput.value = "";
  updCodeInput.value = "";

  updModal.classList.add("hide-update-modal");
  resetFocus();
}

function rmColor(colorTitle) {
  const lstColor = lstColorParent.children;

  for (let i = 1; i < lstColor.length; i++) {
    let existColorTitle = lstColor[i].children[1].innerHTML;

    if (colorTitle == existColorTitle) {
      rmColorStorage(colorTitle);
      lstColorParent.removeChild(lstColor[i]);
    }
  }
}

function openAddModal() {
  isAddModalOpen = true;
  focusOn(addModal);
  addModal.classList.toggle("hide-add-modal");
}

function closeAddModal() {
  isAddModalOpen = false;

  addTitleInput.value = "";
  addCodeInput.value = "";

  hideInputNotice();
  resetFocus();

  addModal.classList.toggle("hide-add-modal");
}

function showInputNotice() {
  const inputNotice = document.querySelector(".add-modal-notice");

  inputNotice.classList.remove("hide-notice");
  inputNotice.classList.add("show-notice");
}

function hideInputNotice() {
  const inputNotice = document.querySelector(".add-modal-notice");

  inputNotice.classList.remove("show-notice");
  inputNotice.classList.add("hide-notice");
}

function focusOn(targetEl) {
  const els = document.body.children;

  //script태그는 제외하기 위하여 length - 1만큼 순회
  for (let i = 0; i < els.length - 1; i++) {
    if (els[i] == targetEl) continue;
    els[i].classList.add("focus-out");
  }
}

function resetFocus() {
  const els = document.body.children;

  //script태그는 제외하기 위하여 length - 1만큼 순회
  for (let i = 0; i < els.length - 1; i++) {
    els[i].classList.remove("focus-out");
  }
}

function circleClicked(colorCode) {
  copyToClipboard(colorCode);
  alert(colorCode + " Copied!");
}

function copyToClipboard(txt) {
  const tmp = document.createElement("textarea");

  tmp.value = txt;
  document.body.appendChild(tmp);

  tmp.select();
  document.execCommand("copy");
  document.body.removeChild(tmp);
}
