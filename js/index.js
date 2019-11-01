let isColorModalShowing = false;

window.addEventListener("load", windowLoaded);
window.addEventListener("keyup", function(e) {
  if (isColorModalShowing) {
    //ESC
    if (e.keyCode == 27) closeColorModal();
    //Enter
    if (e.keyCode == 13) saveNewColor();
  }
});

function windowLoaded(e) {
  const navCode = document.querySelector(".index-nav-code");
  const navColor = document.querySelector(".index-nav-color");
  const colorAddIcon = document.querySelector(".index-color-box-item-add-icon");
  const colorAddTxt = document.querySelector(".index-color-add-btn");
  const colorModalCloseBtn = document.querySelector(
    ".index-add-color-modal-close"
  );
  const colorModalSaveBtn = document.querySelector(
    ".index-add-color-modal-save"
  );

  navColor.style.borderBottom = "3px solid #f2eef7";
  navColor.style.fontWeight = "bold";

  loadColors();

  navCode.addEventListener("click", function(e) {
    const codeBoxContainer = document.querySelector(".index-code-box-contain");
    const colorBoxContainer = document.querySelector(
      ".index-color-box-contain"
    );

    if (codeBoxContainer && colorBoxContainer) {
      navColor.style.border = "none";
      navColor.style.fontWeight = "normal";

      navCode.style.borderBottom = "3px solid #f2eef7";
      navCode.style.fontWeight = "bold";

      colorBoxContainer.style.display = "none";
      codeBoxContainer.style.display = "flex";
    }
  });

  navColor.addEventListener("click", function(e) {
    const codeBoxContainer = document.querySelector(".index-code-box-contain");
    const colorBoxContainer = document.querySelector(
      ".index-color-box-contain"
    );

    if (codeBoxContainer && colorBoxContainer) {
      navCode.style.border = "none";
      navCode.style.fontWeight = "normal";

      navColor.style.borderBottom = "3px solid #f2eef7";
      navColor.style.fontWeight = "bold";

      codeBoxContainer.style.display = "none";
      colorBoxContainer.style.display = "flex";
    }
  });

  colorAddTxt.addEventListener("click", function(e) {
    showColorModal();
  });

  colorAddIcon.addEventListener("click", function(e) {
    showColorModal();
  });

  colorModalCloseBtn.addEventListener("click", function(e) {
    closeColorModal();
  });

  colorModalSaveBtn.addEventListener("click", function(e) {
    saveNewColor();
  });
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

function saveNewColor() {
  const inputTitle = document.getElementById("index-add-color-modal-title");
  const inputColorCode = document.getElementById("index-add-color-modal-code");
  const lstParent = document.getElementsByClassName(
    "index-color-box-contain"
  )[0];

  const lstColor = lstParent.children;

  //컬러코드의 값은 길이가 7이면서 #이 포함되어야 함
  if (inputColorCode.value.length == 7 && inputColorCode.value.includes("#")) {
    for (let i = 1; i < lstColor.length; i++) {
      if (inputTitle.value == lstColor[i].children[1].innerHTML) {
        alert("이미 존재하는 색상입니다.");
        return;
      }
    }

    insertColor(inputTitle.value, inputColorCode.value);

    //로컬 스토리지에 저장
    localStorage.setItem(inputTitle.value, inputColorCode.value);
    alert("저장되었습니다!");

    closeColorModal();
    return;
  }
  alert("코드 값이 이상합니다\n#aaaaaa의 형태로 입력해주세요.");
}

function insertColor(title, colorCode) {
  const lstParent = document.getElementsByClassName(
    "index-color-box-contain"
  )[0];

  const newItem = createNewColor(title, colorCode);
  lstParent.appendChild(newItem);
}

function createNewColor(title, colorCode) {
  const newColor = document.createElement("li");
  newColor.className = "index-color-box-item";

  // const newCircleBG = document.createElement("div");
  // newCircleBG.className = "index-color-box-item-circle-bg";

  const newCircle = document.createElement("div");
  newCircle.className = "index-color-box-item-circle";
  newCircle.style.backgroundColor = colorCode;
  // newCircleBG.appendChild(newCircle);

  const newTitle = document.createElement("div");
  newTitle.innerHTML = title;
  newTitle.className = "index-color-box-title";

  const newCode = document.createElement("div");
  newCode.innerHTML = colorCode;
  newCode.className = "index-color-box-color-code";

  const newDelBtn = document.createElement("a");
  newDelBtn.href = "#";
  newDelBtn.innerHTML = "삭제";
  newDelBtn.className = "index-color-box-delete";
  newDelBtn.addEventListener("click", removeColor);

  // newColor.appendChild(newCircleBG);
  newColor.appendChild(newCircle);
  newColor.appendChild(newTitle);
  newColor.appendChild(newCode);
  newColor.appendChild(newDelBtn);

  return newColor;
}

function removeColor(e) {
  const targetTitle = e.target.parentElement.children[1].innerHTML;
  let targetLi;
  const lstParent = document.getElementsByClassName(
    "index-color-box-contain"
  )[0];
  const lstColor = lstParent.children;

  for (let i = 1; i < lstColor.length; i++) {
    if (targetTitle == lstColor[i].children[1].innerHTML) {
      let choice = confirm(
        '"' + lstColor[i].children[1].innerHTML + '"' + "을 삭제할까요?"
      );

      if (choice) {
        targetLi = lstColor[i];
        lstParent.removeChild(targetLi);

        //로컬 스토리지에서 삭제
        localStorage.removeItem(targetTitle);
        alert(targetTitle + "을 삭제했습니다!");
      }
    }
  }
}

function showColorModal() {
  isColorModalShowing = true;

  const colorModal = document.querySelector(".index-add-color-modal");
  const inputTitle = document.getElementById("index-add-color-modal-title");

  focusOn(colorModal);

  inputTitle.addEventListener("mouseenter", function(e) {
    document
      .querySelector(".index-add-color-modal-notice")
      .classList.remove("hide");
    document
      .querySelector(".index-add-color-modal-notice")
      .classList.add("show");
  });
  inputTitle.addEventListener("mouseout", function(e) {
    document
      .querySelector(".index-add-color-modal-notice")
      .classList.remove("show");
    document
      .querySelector(".index-add-color-modal-notice")
      .classList.add("hide");
  });

  colorModal.style.opacity = 1;
  colorModal.style.height = "40%";
  colorModal.style.display = "flex";
}

function closeColorModal() {
  isColorModalShowing = false;

  const inputTitle = document.getElementById("index-add-color-modal-title");
  const inputColorCode = document.getElementById("index-add-color-modal-code");

  inputTitle.value = "";
  inputColorCode.value = "";
  document
    .querySelector(".index-add-color-modal-notice")
    .classList.remove("show");
  document.querySelector(".index-add-color-modal-notice").classList.add("hide");

  resetFocus();

  const colorModal = document.querySelector(".index-add-color-modal");

  colorModal.style.opacity = 0;
  colorModal.style.height = 0;

  //colorModal의 transition은 0.5s == 500ms
  setTimeout(() => {
    colorModal.style.display = "none";
  }, 500);
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
