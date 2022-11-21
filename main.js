'use strict';

// Navbar 색상 변화 스크롤 이벤트
const navbar = document.querySelector('#navbar');
const navbarHeight = navbar.getBoundingClientRect().height;
document.addEventListener('scroll', () => {
  if (window.scrollY > navbarHeight) {
    navbar.classList.add('navbar--dark');
  } else {
    navbar.classList.remove('navbar--dark');
  }
});

// 홈 컨테이너 페이드 아웃 스크롤 이벤트
const home = document.querySelector('.home__container');
const homeHeight = home.getBoundingClientRect().height;
document.addEventListener('scroll', () => {
  home.style.opacity = 1 - window.scrollY / homeHeight;
});

// arrow-up 버튼 활성/비활성 스크롤 이벤트
const arrowUp = document.querySelector('.arrow-up');
document.addEventListener('scroll', () => {
  if (window.scrollY > navbarHeight) {
    arrowUp.classList.add('visible');
  } else {
    arrowUp.classList.remove('visible');
  }
});

// arrow-up 버큰 클릭 이벤트
arrowUp.addEventListener('click', () => {
  scrollIntoView('#home');
});

// Navbar 메뉴 아이템 클릭 이벤트
navbar.addEventListener('click', (event) => {
  const target = event.target;
  const link = target.dataset.link;
  if (link) {
    scrollIntoView(link);
  }
});

// Navbar toggle button for small screen
const navbarMenu = document.querySelector('.navbar__menu');
const navbarToggleBtn = document.querySelector('.navbar__toggle-btn');
navbarToggleBtn.addEventListener('click', (e) => {
  navbarMenu.classList.toggle('open');
});

// Contact Me 버튼 클릭 이벤트
const contactMe = document.querySelector('.home__contact');
contactMe.addEventListener('click', () => {
  scrollIntoView('#contact');
});

// 카테고리 버튼 클릭 이벤트
const workBtnContainer = document.querySelector('.work__categories');
const projectContainer = document.querySelector('.work__projects');
const projects = document.querySelectorAll('.project');
workBtnContainer.addEventListener('click', (event) => {
  const filter =
    event.target.dataset.filter || event.target.parentNode.dataset.filter;
  if (filter) {
    projectContainer.classList.add('anim-out');
    setTimeout(() => {
      projects.forEach((project) => {
        if (filter === '*' || filter === project.dataset.type) {
          project.classList.remove('invisible');
        } else {
          project.classList.add('invisible');
        }
      });
      projectContainer.classList.remove('anim-out');
    }, 300);

    const selected = document.querySelector('.category__btn.selected');
    selected.classList.remove('selected');
    const target =
      event.target.nodeName === 'BUTTON'
        ? event.target
        : event.target.parentNode;
    target.classList.add('selected');
  }
});

// 화면 이동에 따라 Navbar 메뉴 아이템 활성화
// 1. 모든 센션 요소들과 메뉴아이템들을 가져온다.
// 2. IntersectionObserver를 이용해서 모든 섹션들을 관찰한다.
// 3. 보여지는 섹션에 해당하는 메뉴 아이템을 활성화 시킨다.
const sectionIds = ['#home', '#about', '#skills', '#work', '#contact'];
const sections = sectionIds.map((id) => document.querySelector(id));
const navItems = sectionIds.map((id) =>
  document.querySelector(`[data-link="${id}"]`)
);

let selectedNavIndex = 0;
let selectedNavItem = navItems[0];
function selectNavItem(selected) {
  selectedNavItem.classList.remove('active');
  selectedNavItem = selected;
  selectedNavItem.classList.add('active');
}

function scrollIntoView(selector) {
  const element = document.querySelector(selector);
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  });
  selectNavItem(navItems[sectionIds.indexOf(selector)]);
}

const observerOption = {
  root: null,
  rootMargin: '0px',
  threshold: 0.3,
};

const observerCallback = (entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting && entry.intersectionRatio > 0) {
      // 화면에서 벗어나는 섹션 발생시
      const index = sectionIds.indexOf(`#${entry.target.id}`);
      if (entry.boundingClientRect.y < 0) {
        // 스크롤이 아래로 이동하면, 섹션이 위로 올라가면서 y 좌표가 0보다 작아진다.
        selectedNavIndex = index + 1;
      } else {
        // 스크롤이 위로 이동하면, 섹션이 아래로 내려가면서 y 좌표가 0보다 커진다.
        selectedNavIndex = index - 1;
      }
    }
  });
};

const observer = new IntersectionObserver(observerCallback, observerOption);
sections.forEach((section) => observer.observe(section));

window.addEventListener('wheel', () => {
  if (window.scrollY === 0) {
    selectedNavIndex = 0;
  } else if (
    Math.round(window.scrollY + window.innerHeight) >=
    document.body.clientHeight
  ) {
    selectedNavIndex = navItems.length - 1;
  }

  selectNavItem(navItems[selectedNavIndex]);
});
