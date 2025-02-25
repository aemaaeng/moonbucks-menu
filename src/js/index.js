// step 2: 요구사항 구현을 위한 전략
// - [x] localStorage에 데이터를 저장한다.
// - [x] localStorage에 있는 데이터를 읽어온다.

// - [x] 에스프레소 메뉴판을 관리한다.
// - [x] 프라푸치노 메뉴판을 관리한다.
// - [x] 블렌디드 메뉴판을 관리한다.
// - [x] 티바나 메뉴판을 관리한다.
// - [x] 디저트 메뉴판을 관리한다.

// - [x] 최초에 접근할 때 localStorage에서 에스프레소 메뉴를 읽어온다.
// - [x] 에스프레소 메뉴를 페이지에 그려준다.

// - [x] 품절 버튼을 추가한다.
// - [x] 품절 버튼 클릭 시 localStorage에 상태값이 저장된다.
// - [x] 품절 버튼 클릭 시 가장 가까운 li 태그에 `sold-out` class를 추가하여 상태를 변경한다.
import { $ } from "./utils/dom.js";
import store from "./store/index.js";

function App() {
  // 변하는 것: 메뉴명
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    dessert: [],
  };

  this.currentCategory = "espresso";

  this.init = () => {
    if (store.getLocalStorage()) {
      this.menu = store.getLocalStorage();
    }
    render();
    initEventListeners();
  };

  const updateMenuCount = () => {
    const menuCount = this.menu[this.currentCategory].length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
  };

  const render = () => {
    const template = this.menu[this.currentCategory]
      .map((item, index) => {
        return `<li data-menu-id="${index}" class=" menu-list-item d-flex items-center py-2">
        <span class="${item.soldOut ? "sold-out" : ""} w-100 pl-2 menu-name">${
          item.name
        }</span>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
        >
          품절
        </button>
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

    $("#menu-list").innerHTML = template;
    updateMenuCount();
  };

  const addMenuName = () => {
    const $espressoMenuName = $("#menu-name").value;

    if ($espressoMenuName === "") {
      alert("값을 입력해주세요.");
      return;
    }

    this.menu[this.currentCategory].push({ name: $espressoMenuName });
    store.setLocalStorage(this.menu);

    render();
    $("#menu-name").value = "";
  };

  const updateMenuName = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedName = prompt(
      "수정할 메뉴명을 입력해주세요",
      $menuName.innerText
    );
    this.menu[this.currentCategory][menuId].name = updatedName;
    store.setLocalStorage(this.menu);
    render();
  };

  const removeMenuName = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      e.target.closest("li").remove();
      this.menu[this.currentCategory].splice(menuId, 1);
      store.setLocalStorage(this.menu);
      render();
    }
  };

  const soldOutMenu = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    this.menu[this.currentCategory][menuId].soldOut =
      !this.menu[this.currentCategory][menuId].soldOut;
    store.setLocalStorage(this.menu);
    render();
  };

  const initEventListeners = () => {
    // form 태그 자동 전송 방지
    $("#menu-form").addEventListener("submit", (e) => {
      e.preventDefault();
    });

    $("#menu-submit-button").addEventListener("click", addMenuName);

    // 메뉴의 이름을 입력 받기
    $("#menu-name").addEventListener("keypress", (e) => {
      if (e.key !== "Enter") return;

      if (e.key === "Enter") {
        addMenuName();
      }
    });

    $("#menu-list").addEventListener("click", (e) => {
      if (e.target.classList.contains("menu-edit-button")) {
        updateMenuName(e);
        return;
      }

      if (e.target.classList.contains("menu-remove-button")) {
        removeMenuName(e);
        return;
      }

      if (e.target.classList.contains("menu-sold-out-button")) {
        soldOutMenu(e);
        return;
      }
    });

    $("nav").addEventListener("click", (e) => {
      const isCategoryButton =
        e.target.classList.contains("cafe-category-name");
      if (isCategoryButton) {
        const categoryName = e.target.dataset.categoryName;
        this.currentCategory = categoryName;
        // 화면도 바꾸기
        $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
        render();
      }
    });
  };
}

const app = new App();
app.init();
