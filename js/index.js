let isColorModalShowing = false; //색상 추가 모달의 가시 여부

const navCode = document.querySelector(".index-nav-code"); // 코드모음
const navColor = document.querySelector(".index-nav-color"); // 색상모음

const colorModal = document.querySelector(".index-add-color-modal"); // 색상 추가 모달

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
window.addEventListener("keyup", windowKeyUp);

function windowKeyUp(e) {
  if (isColorModalShowing) {
    //ESC
    if (e.keyCode == 27) closeColorModal();
    //Enter
    if (e.keyCode == 13) {
      const title = document.getElementById("index-add-color-modal-title")
        .value;
      const colorCode = document.getElementById("index-add-color-modal-code")
        .value;

      addNewColor(title, colorCode);
    }
  }
}

function windowLoaded(e) {
  const addColorTxt = document.querySelector(".index-color-add-btn"); // 색상 추가 텍스트
  const addColorIcon = document.querySelector(".index-color-box-item-add-icon"); // 색상 추가 아이콘

  const colorModalSaveBtn = document.querySelector(
    ".index-add-color-modal-save"
  ); // 색상 추가 버튼
  const colorModalCloseBtn = document.querySelector(
    //색상 추가 모달 종료 버튼
    ".index-add-color-modal-close"
  );

  const updateInputTitle = document.querySelector(
    //업데이트 색상 타이틀
    ".index-update-color-modal-title-input"
  );
  const updateInputCode = document.querySelector(
    //업데이트 색상 코드
    ".index-update-color-modal-code-input"
  );

  initUI();

  navCode.addEventListener("click", toggleColorOrCode);
  navColor.addEventListener("click", toggleColorOrCode);

  addColorTxt.addEventListener("click", showColorModal);
  addColorIcon.addEventListener("click", showColorModal);

  colorModalCloseBtn.addEventListener("click", closeColorModal);

  colorModalSaveBtn.addEventListener("click", e => {
    const title = document.getElementById("index-add-color-modal-title").value;
    const colorCode = document.getElementById("index-add-color-modal-code")
      .value;

    addNewColor(title, colorCode);
  });

  updateInputTitle.addEventListener("keyup", e => {
    const newTitle = document.querySelector(
      ".index-update-color-modal-title-new"
    );

    newTitle.innerHTML = e.target.value;
  });

  updateInputCode.addEventListener("keyup", e => {
    const newCircle = document.querySelector(
      ".index-update-color-modal-circle-new"
    );
    const newCode = document.querySelector(
      ".index-update-color-modal-code-new"
    );

    newCircle.style.backgroundColor = e.target.value;
    newCode.innerHTML = e.target.value;
  });

  updateColorModalSaveBtn.addEventListener("click", e => {
    const oldTitle = document.querySelector(".index-update-color-modal-title")
      .innerHTML;

    const newTitle = document.querySelector(
      ".index-update-color-modal-title-input"
    ).value;

    const newCode = document.querySelector(
      ".index-update-color-modal-code-input"
    ).value;

    updateColor(e, oldTitle, newTitle, newCode);
  });

  updateColorModalCancelBtn.addEventListener("click", hideColorUpdateModal);
}

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
}

function addNewColor(colorTitle, colorCode) {
  if (isColorCodeRight(colorCode)) {
    if (isColorTitleExist(colorTitle)) {
      alert("이미 존재하는 색상입니다");
      return;
    }

    saveColorStorage(colorTitle, colorCode);
    alert("저장되었습니다!");

    insertColor(colorTitle, colorCode);
    closeColorModal();

    return;
  }
  alert("코드 값이 이상합니다\n#aaaaaa의 형태로 입력해주세요.");
  return;
}

function saveColorStorage(colorTitle, colorCode) {
  localStorage.setItem(colorTitle, colorCode);
}

function removeColorStorage(colorTitle) {
  localStorage.removeItem(colorTitle);
}

function insertColor(colorTitle, colorCode) {
  const newItem = createNewColor(colorTitle, colorCode);
  lstColorParent.appendChild(newItem);
}

function createNewColor(colorTitle, colorCode) {
  const newColor = document.createElement("li");
  newColor.className = "index-color-box-item";

  const newCircle = document.createElement("div");
  newCircle.className = "index-color-box-item-circle";
  newCircle.style.backgroundColor = colorCode;
  newCircle.addEventListener("click", e => {
    colorCircleClicked(e, colorCode);
  });

  const newTitle = document.createElement("div");
  newTitle.innerHTML = colorTitle;
  newTitle.className = "index-color-box-title";

  const newCode = document.createElement("div");
  newCode.innerHTML = colorCode;
  newCode.className = "index-color-box-color-code";

  const newUpdateBtn = document.createElement("a");
  newUpdateBtn.href = "#";
  newUpdateBtn.innerHTML = "수정";
  newUpdateBtn.className = "index-color-box-update-btn";
  newUpdateBtn.addEventListener("click", e => {
    showUpdateColorModal(colorTitle, colorCode);
  });

  const newDelBtn = document.createElement("a");
  newDelBtn.href = "#";
  newDelBtn.innerHTML = "삭제";
  newDelBtn.addEventListener("click", e => {
    const choice = confirm('"' + colorTitle + '"' + "을 삭제할까요?");

    if (choice) {
      removeColor(e, colorTitle);
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

function showUpdateColorModal(colorTitle, colorCode) {
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

  focusOn(updateColorModal);
  updateColorModal.classList.toggle("hide-update-modal");

  oldTitle.innerHTML = colorTitle;
  oldCode.innerHTML = colorCode;
  oldCircle.style.backgroundColor = colorCode;

  newTitle.innerHTML = colorTitle;
  newCode.innerHTML = colorCode;
  newCircle.style.backgroundColor = colorCode;
}

function updateColor(e, oldTitle, newTitle, newCode) {
  if (isColorCodeRight(newCode)) {
    if (isColorTitleExist(newTitle)) {
      alert("이미 존재하는 색상입니다");
      return;
    }

    removeColorStorage(oldTitle);
    removeColor(e, oldTitle);
    saveColorStorage(newTitle, newCode);
    insertColor(newTitle, newCode);

    alert("수정되었습니다");
    hideColorUpdateModal();

    return;
  }

  alert("코드 값이 이상합니다\n#aaaaaa의 형태로 입력해주세요.");
  return;
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

  inputTitle.addEventListener("focus", showInputNotice);
  inputTitle.addEventListener("blur", hideInputNotice);

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
