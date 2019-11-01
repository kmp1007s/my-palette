let isColorModalShowing = false; //색상 추가 모달의 가시 여부

const navCode = document.querySelector(".index-nav-code"); // 코드모음
const navColor = document.querySelector(".index-nav-color"); // 색상모음

const addColorIcon = document.querySelector(".index-color-box-item-add-icon"); // 색상 추가 아이콘
const addColorTxt = document.querySelector(".index-color-add-btn"); // 색상 추가 텍스트

const colorModal = document.querySelector(".index-add-color-modal"); // 색상 추가 모달
const colorModalSaveBtn = document.querySelector(".index-add-color-modal-save"); // 색상 추가 버튼
const colorModalCloseBtn = document.querySelector(
  //색상 추가 모달 종료 버튼
  ".index-add-color-modal-close"
);

const codeBoxContain = document.querySelector(".index-code-box-contain"); // 코드 박스
const colorBoxContain = document.querySelector(".index-color-box-contain"); // 색상 박스

// 색상리스트 감싸는 ul
const lstColorParent = document.getElementsByClassName(
  "index-color-box-contain"
)[0];

const updateColorModal = document.querySelector(".index-update-color-modal"); // 색상 업데이트 모달
const updateColorModalSaveBtn = document.querySelector(
  ".index-update-color-modal-save"
);
const updateColorModalCancelBtn = document.querySelector(
  ".index-update-color-modal-cancel"
);

window.addEventListener("load", windowLoaded);
window.addEventListener("keyup", function(e) {
  if (isColorModalShowing) {
    //ESC
    if (e.keyCode == 27) closeColorModal();
    //Enter
    if (e.keyCode == 13) addNewColor();
  }
});

/* 처음 UI 로딩 시 애니메이션 효과를 주고 싶은 경우 HTML이 아니라 이 부분에 작성 */
function initUI() {
  navColor.classList.add("selected-nav");
  loadColors();
}

function toggleColorOrCode() {
  navColor.classList.toggle("selected-nav");
  navCode.classList.toggle("selected-nav");
  colorBoxContain.classList.toggle("hide-box");
  codeBoxContain.classList.toggle("hide-box");
}

function windowLoaded(e) {
  initUI();

  navCode.addEventListener("click", toggleColorOrCode);
  navColor.addEventListener("click", toggleColorOrCode);

  addColorTxt.addEventListener("click", e => showColorModal());
  addColorIcon.addEventListener("click", e => showColorModal());

  colorModalCloseBtn.addEventListener("click", e => closeColorModal());

  colorModalSaveBtn.addEventListener("click", e => addNewColor());

  updateColorModalCancelBtn.addEventListener("click", hideColorUpdateModal);
}

function loadColors() {
  let colors = [];
  let keys = Object.keys(localStorage);

  //로컬 스토리지의 모든 값을 읽어들임
  for (let i = 0; i < localStorage.length; i++) {
    let colorTitle = keys[i];
    let colorCode = localStorage.getItem(keys[i]);
    let color = {
      colorTitle: colorTitle,
      colorCode: colorCode
    };

    colors.push(color);
  }

  for (let i = 0; i < colors.length; i++) {
    insertColor(colors[i].colorTitle, colors[i].colorCode);
  }
}

function isColorCodeRight(colorCode) {
  //컬러코드의 값은 길이가 7이면서 #이 포함되어야 함
  if (colorCode.length == 7 && colorCode.includes("#")) return true;
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
}

function addNewColor() {
  const inputTitle = document.getElementById("index-add-color-modal-title")
    .value;
  const inputColorCode = document.getElementById("index-add-color-modal-code")
    .value;

  if (isColorCodeRight(inputColorCode)) {
    if (isColorTitleExist(inputTitle)) {
      alert("이미 존재하는 색상입니다");
      return;
    }

    saveColorStorage(inputTitle, inputColorCode);
    alert("저장되었습니다!");

    insertColor(inputTitle, inputColorCode);
    closeColorModal();

    return;
  }
  alert("코드 값이 이상합니다\n#aaaaaa의 형태로 입력해주세요.");
}

function saveColorStorage(colorTitle, colorCode) {
  //로컬 스토리지에 저장
  localStorage.setItem(colorTitle, colorCode);
}

function removeColorStorage(colorTitle) {
  //로컬 스토리지에서 삭제
  localStorage.removeItem(colorTitle);
}

function insertColor(title, colorCode) {
  const newItem = createNewColor(title, colorCode);
  lstColorParent.appendChild(newItem);
}

function createNewColor(title, colorCode) {
  const newColor = document.createElement("li");
  newColor.className = "index-color-box-item";

  const newCircle = document.createElement("div");
  newCircle.className = "index-color-box-item-circle";
  newCircle.style.backgroundColor = colorCode;
  newCircle.addEventListener("click", e => {
    colorCircleClicked(e, colorCode);
  });

  const newTitle = document.createElement("div");
  newTitle.innerHTML = title;
  newTitle.className = "index-color-box-title";

  const newCode = document.createElement("div");
  newCode.innerHTML = colorCode;
  newCode.className = "index-color-box-color-code";

  const newUpdateBtn = document.createElement("a");
  newUpdateBtn.href = "#";
  newUpdateBtn.innerHTML = "수정";
  newUpdateBtn.className = "index-color-box-update-btn";
  newUpdateBtn.addEventListener("click", e => {
    focusOn(updateColorModal);
    updateColor(e, title, colorCode);
  });

  const newDelBtn = document.createElement("a");
  newDelBtn.href = "#";
  newDelBtn.innerHTML = "삭제";
  newDelBtn.addEventListener("click", e => {
    const choice = confirm('"' + title + '"' + "을 삭제할까요?");

    if (choice) {
      removeColor(e, title);
      alert(title + "을 삭제했습니다!");
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

function updateColor(e, colorTitle, colorCode) {
  const oldTitle = document.querySelector(".index-update-color-modal-title");
  const oldCode = document.querySelector(".index-update-color-modal-code");
  const oldCircle = document.querySelector(".index-update-color-modal-circle");

  const newTitle = document.querySelector(
    ".index-update-color-modal-title-new"
  );
  const newCode = document.querySelector(".index-update-color-modal-code-new");
  const newCircle = document.querySelector(
    ".index-update-color-modal-circle-new"
  );

  const inputTitle = document.querySelector(
    ".index-update-color-modal-title-input"
  );
  const inputCode = document.querySelector(
    ".index-update-color-modal-code-input"
  );

  const saveBtn = document.querySelector(".index-update-color-modal-save");

  inputCode.addEventListener("change", e => {
    newCircle.style.backgroundColor = e.target.value;
  });

  saveBtn.addEventListener("click", e => {
    if (isColorCodeRight(inputCode.value)) {
      if (isColorTitleExist(inputTitle.value)) {
        alert("이미 존재하는 색상입니다");
        return;
      }

      removeColorStorage(oldTitle.innerHTML);
      removeColor(e, oldTitle.innerHTML);
      saveColorStorage(inputTitle.value, inputCode.value);
      insertColor(inputTitle.value, inputCode.value);

      alert("수정되었습니다");

      hideColorUpdateModal();
      return;
    }
    alert("코드 값이 이상합니다\n#aaaaaa의 형태로 입력해주세요.");
  });

  updateColorModal.classList.toggle("hide-update-modal");

  oldTitle.innerHTML = colorTitle;
  oldCode.innerHTML = colorCode;
  oldCircle.style.backgroundColor = colorCode;

  newTitle.innerHTML = colorTitle;
  newCode.innerHTML = colorCode;
  newCircle.style.backgroundColor = colorCode;
}

function hideColorUpdateModal() {
  const inputTitle = document.querySelector(
    ".index-update-color-modal-title-input"
  );
  const inputCode = document.querySelector(
    ".index-update-color-modal-code-input"
  );

  inputTitle.value = "";
  inputCode.value = "";

  updateColorModal.classList.add("hide-update-modal");
  resetFocus();
}

function removeColor(e, colorTitle) {
  const lstColor = lstColorParent.children;

  for (let i = 1; i < lstColor.length; i++) {
    const existColorTitle = lstColor[i].children[1].innerHTML;
    if (colorTitle == existColorTitle) {
      removeColorStorage(colorTitle);
      lstColorParent.removeChild(lstColor[i]);
    }
  }
}

function showColorModal() {
  isColorModalShowing = true;
  focusOn(colorModal);

  const inputTitle = document.getElementById("index-add-color-modal-title");

  inputTitle.addEventListener("mouseenter", showInputNotice);
  inputTitle.addEventListener("mouseout", hideInputNotice);

  colorModal.classList.toggle("hide-add-modal");
}

function closeColorModal() {
  isColorModalShowing = false;

  const inputTitle = document.getElementById("index-add-color-modal-title");
  const inputColorCode = document.getElementById("index-add-color-modal-code");

  inputTitle.value = "";
  inputColorCode.value = "";
  hideInputNotice();

  resetFocus();

  colorModal.classList.toggle("hide-add-modal");
}

function showInputNotice() {
  const inputNotice = document.querySelector(".index-add-color-modal-notice");

  inputNotice.classList.remove("hide");
  inputNotice.classList.add("show");
}

function hideInputNotice() {
  const inputNotice = document.querySelector(".index-add-color-modal-notice");

  inputNotice.classList.remove("show");
  inputNotice.classList.add("hide");
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

function colorCircleClicked(e, colorCode) {
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
