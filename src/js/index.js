// step 2: 요구사항 구현을 위한 전략
// - [x] localStorage에 데이터를 저장한다.
// - [ ] localStorage에 있는 데이터를 읽어온다.

// - [ ] 에스프레소 메뉴판을 관리한다.
// - [ ] 프라푸치노 메뉴판을 관리한다.
// - [ ] 블렌디드 메뉴판을 관리한다.
// - [ ] 티바나 메뉴판을 관리한다.
// - [ ] 디저트 메뉴판을 관리한다.

// - [ ] 최초에 접근할 때 localStorage에서 에스프레소 메뉴를 읽어온다.
// - [ ] 에스프레소 메뉴를 페이지에 그려준다.

// - [ ] 품절 버튼을 추가한다.
// - [ ] 품절 버튼 클릭 시 localStorage에 상태값이 저장된다.
// - [ ] 품절 버튼 클릭 시 가장 가까운 li 태그에 `sold-out` class를 추가하여 상태를 변경한다.

const $ = (selector) => document.querySelector(selector);

const store = {
  setLocalStorage(menu) {
    localStorage.setItem("menu", JSON.stringify(menu));
  },
  getLocalStorage() {
    localStorage.getItem("menu");
  },
};

function App() {
  // 변하는 것: 메뉴명
  this.menu = [];

  const updateMenuCount = () => {
    const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
  };

  const addMenuName = () => {
    const $espressoMenuName = $("#espresso-menu-name").value;

    if ($espressoMenuName === "") {
      alert("값을 입력해주세요.");
      return;
    }

    this.menu.push({ name: $espressoMenuName });
    store.setLocalStorage(this.menu);
    const template = this.menu
      .map((item) => {
        return `<li class="menu-list-item d-flex items-center py-2">
        <span class="w-100 pl-2 menu-name">${item.name}</span>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
        >
          수정
        </button>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
        >
          삭제
        </button>
      </li>`;
      })
      .join("");

    $("#espresso-menu-list").innerHTML = template;

    updateMenuCount();
    $("#espresso-menu-name").value = "";
  };

  const updateMenuName = (e) => {
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedName = prompt(
      "수정할 메뉴명을 입력해주세요",
      $menuName.innerText
    );
    $menuName.innerText = updatedName;
  };

  const removeMenuName = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      e.target.closest("li").remove();
      updateMenuCount();
    }
  };

  // form 태그 자동 전송 방지
  $("#espresso-menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  $("#espresso-menu-submit-button").addEventListener("click", addMenuName);

  // 메뉴의 이름을 입력 받기
  $("#espresso-menu-name").addEventListener("keypress", (e) => {
    if (e.key !== "Enter") return;

    if (e.key === "Enter") {
      addMenuName();
    }
  });

  $("#espresso-menu-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-edit-button")) {
      updateMenuName(e);
    }

    if (e.target.classList.contains("menu-remove-button")) {
      removeMenuName(e);
    }
  });
}

const app = new App();
