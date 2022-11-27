const options = {
  root: null, // viewport
  rootMargin: "1px",
  threshold: 1  // 50%가 viewport에 들어와 있어야 callback 실행
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.remove('active');

    } else {
      entry.target.classList.add('active');

    }
  });
}, options);

const boxList = document.querySelectorAll('.box','.box img');

// 반복문을 돌려 모든 DOM에 적용
boxList.forEach(el => observer.observe(el));

var doc = window.document,
  context = doc.querySelector(".js-loop"),
  clones = context.querySelectorAll(".is-clone"),
  disableScroll = false,
  scrollHeight = 0,
  scrollPos = 0,
  clonesHeight = 0,
  i = 0;

function getScrollPos() {
  return (context.pageYOffset || context.scrollTop) - (context.clientTop || 0);
}

function setScrollPos(pos) {
  context.scrollTop = pos;
}

function getClonesHeight() {
  clonesHeight = 0;

  for (i = 0; i < clones.length; i += 1) {
    clonesHeight = clonesHeight + clones[i].offsetHeight;
  }

  return clonesHeight;
}

function reCalc() {
  scrollPos = getScrollPos();
  scrollHeight = context.scrollHeight;
  clonesHeight = getClonesHeight();

  if (scrollPos <= 0) {
    setScrollPos(1); // Scroll 1 pixel to allow upwards scrolling
  }
}

function scrollUpdate() {
  if (!disableScroll) {
    scrollPos = getScrollPos();

    if (clonesHeight + scrollPos >= scrollHeight) {
      // Scroll to the top when you’ve reached the bottom
      setScrollPos(1); // Scroll down 1 pixel to allow upwards scrolling
      disableScroll = true;
    } else if (scrollPos <= 0) {
      // Scroll to the bottom when you reach the top
      setScrollPos(scrollHeight - clonesHeight);
      disableScroll = true;
    }
  }

  if (disableScroll) {
    // Disable scroll-jumping for a short time to avoid flickering
    window.setTimeout(function () {
      disableScroll = false;
    }, 40);
  }
}

function init() {
  reCalc();

  context.addEventListener(
    "scroll",
    function () {
      window.requestAnimationFrame(scrollUpdate);
    },
    false
  );

  window.addEventListener(
    "resize",
    function () {
      window.requestAnimationFrame(reCalc);
    },
    false
  );
}

if (document.readyState !== "loading") {
  init();
} else {
  doc.addEventListener("DOMContentLoaded", init, false);
}

// Just for this demo: Center the middle block on page load
window.onload = function () {
  setScrollPos(
    Math.round(
      clones[0].getBoundingClientRect().top +
        getScrollPos() -
        (context.offsetHeight - clones[0].offsetHeight) / 2
    )
  );
};
