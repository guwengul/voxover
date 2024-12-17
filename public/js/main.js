const hamburgerContainer = document.querySelector(".hamburger");
const hamburgers = document.querySelectorAll(".hamburger--box");
const hamburger1 = document.querySelector(".hamburger--1");
const hamburger2 = document.querySelector(".hamburger--2");
const hamburger3 = document.querySelector(".hamburger--3");
const navbar = document.querySelector("nav");
const navLists = document.querySelector(".header__btns--md");
const closeBtn = document.querySelectorAll(".close");

// const sectionContainer = document.querySelector(".section--3");
const sectionContainer = document.querySelector(".hero");
const header = document.querySelector(".header");
const section2Card = document.querySelectorAll(".section--2__card");
const iframe = document.querySelector(".iframe")
const iframeLinkHolder = document.querySelector(".section--2__iframe-link")

let isClicked = false;
navLists.style.display = "none";

// Function to reset styles
const resetHamburgerStyles = () => {
  hamburger1.style.animationName = "";
  hamburger2.style.animationName = "";
  hamburger3.style.animationName = "";
  isClicked = false;
};

// Set initial state based on window width
let windowWidth = window.innerWidth;
if (windowWidth >= 1024) {
  resetHamburgerStyles();
  // navLists.style.opacity = "0"
  navLists.style.display = "none"
}

// Toggle hamburger animation on click
navbar.addEventListener("click", (e) => {
  const clicked = e.target;
  if (!clicked.classList.contains("burger-animation")) return;

  if (!isClicked) {
    hamburger1.style.animationName = "flipDown";
    hamburger2.style.animationName = "fadeOut";
    hamburger3.style.animationName = "flipUp";
    navLists.style.display = "block";
    isClicked = true;
  } else {
    resetHamburgerStyles();
      // navLists.style.opacity = "0"
      navLists.style.display = "none"
  }
});

// Remove animation on window resize if conditions change
window.addEventListener("resize", () => {
  windowWidth = window.innerWidth;

  if (windowWidth >= 1024 && isClicked) {
    resetHamburgerStyles();
      // navLists.style.opacity = "0"
      navLists.style.display = "none"
  }
});

const options = {
  root: null,
  threshold: 0.75,
  // rootMargin: '-120px'
}

const obsCallBack = (entries, observer)=>{
  const [entry] = entries;

  if(!entry.isIntersecting){
    header.classList.add("sticky");
  }else{
    header.classList.remove("sticky");
  }
}

const headerObserver = new IntersectionObserver(obsCallBack, options)

headerObserver.observe(sectionContainer);

// console.log(iframe)
section2Card.forEach((card)=>{
  card.addEventListener("click", (e)=>{
    const clicked = e.target.dataset.val;
    // console.log(clicked)
    const closestSpan = document.querySelector(`.${"section--2__iframe-link"}-${clicked}`)
    // console.log(closestSpan)
      const newYoutubeLink = closestSpan.dataset.yt;
      console.log(newYoutubeLink)
        iframe.src = newYoutubeLink;

  })
})

closeBtn.forEach((btn)=>{
  btn.addEventListener("click", (e)=>{
    resetHamburgerStyles();
    navLists.style.display = "none";
  })
})

