document.addEventListener('DOMContentLoaded', function () {
  const nodes = document.querySelectorAll('.timeline-node');
  const pages = document.querySelectorAll('.story-page');
  const mainPage = document.querySelector('.main-page');
  const storySlider = document.querySelector('.story-slider');
  const backBtn = document.querySelector('.back-btn');
  let currentIdx = 0;
  const years = Array.from(nodes).map(node => node.getAttribute('data-year'));

  function showPage(idx, direction = 0) {
    pages.forEach((page, i) => {
      page.classList.remove('active', 'exit-left', 'exit-right');
      if (i === idx) {
        page.classList.add('active');
        // GSAP 文字淡入、圖片縮放
        gsap.fromTo(page.querySelector('p'), {opacity: 0, y: 24}, {opacity: 1, y: 0, duration: 0.6, delay: 0.2});
        gsap.fromTo(page.querySelector('img'), {opacity: 0, scale: 0.92}, {opacity: 1, scale: 1, duration: 0.6, delay: 0.35});
      } else {
        if (direction < 0 && i < idx) {
          page.classList.add('exit-left');
        } else if (direction > 0 && i > idx) {
          page.classList.add('exit-right');
        } else {
          page.classList.remove('exit-left', 'exit-right');
        }
      }
    });
    nodes.forEach((node, i) => {
      node.classList.toggle('active', i === idx);
    });
    currentIdx = idx;
  }

  // 首頁點擊年份進入故事頁
  nodes.forEach((node, idx) => {
    node.addEventListener('click', () => {
      mainPage.style.display = 'none';
      storySlider.classList.add('active');
      showPage(idx);
    });
  });

  // 返回首頁
  backBtn.addEventListener('click', () => {
    storySlider.classList.remove('active');
    setTimeout(() => {
      mainPage.style.display = 'block';
    }, 300);
  });

  // 故事頁左右滑動切換
  let startX = null;
  storySlider.addEventListener('touchstart', function(e) {
    if (e.touches.length === 1) {
      startX = e.touches[0].clientX;
    }
  });
  storySlider.addEventListener('touchend', function(e) {
    if (startX === null) return;
    const endX = e.changedTouches[0].clientX;
    const dx = endX - startX;
    if (Math.abs(dx) > 50) {
      if (dx < 0 && currentIdx < pages.length - 1) {
        showPage(currentIdx + 1, 1);
      } else if (dx > 0 && currentIdx > 0) {
        showPage(currentIdx - 1, -1);
      }
    }
    startX = null;
  });
}); 