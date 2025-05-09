document.addEventListener('DOMContentLoaded', function () {
  const nodes = document.querySelectorAll('.timeline-node');
  const pages = document.querySelectorAll('.story-page');
  const mainPage = document.querySelector('.main-page');
  const storySlider = document.querySelector('.story-slider');
  const backBtn = document.querySelector('.back-btn');
  let currentIdx = 0;

  function showPage(idx, direction = 0) {
    pages.forEach((page, i) => {
      page.classList.remove('active', 'exit-left', 'exit-right');
      if (i === idx) {
        page.classList.add('active');
        // 動畫
        if (window.gsap) {
          gsap.fromTo(page.querySelector('p'), {opacity: 0, y: 24}, {opacity: 1, y: 0, duration: 0.6, delay: 0.2});
          gsap.fromTo(page.querySelector('img'), {opacity: 0, scale: 0.92}, {opacity: 1, scale: 1, duration: 0.6, delay: 0.35});
        }
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
    currentIdx = idx;
  }

  // 首頁點擊年份進入故事頁
  nodes.forEach((node, idx) => {
    node.addEventListener('click', () => {
      mainPage.style.display = 'none';
      storySlider.style.display = 'block';
      storySlider.classList.add('active');
      showPage(idx);
    });
  });

  // 返回首頁
  backBtn.addEventListener('click', () => {
    storySlider.classList.remove('active');
    storySlider.style.display = 'none';
    mainPage.style.display = 'block';
  });

  // 跟隨手勢的滑動切換
  let startX = null;
  let isDragging = false;
  let deltaX = 0;
  let threshold = 60;
  let currentPage = null;
  let nextPage = null;

  storySlider.addEventListener('touchstart', function(e) {
    if (e.touches.length === 1) {
      startX = e.touches[0].clientX;
      isDragging = true;
      currentPage = pages[currentIdx];
      nextPage = null;
    }
  });

  storySlider.addEventListener('touchmove', function(e) {
    if (!isDragging || startX === null) return;
    deltaX = e.touches[0].clientX - startX;
    // 頁面跟隨手勢移動
    if (Math.abs(deltaX) > 0) {
      currentPage.style.transition = 'none';
      currentPage.style.transform = `translateX(${deltaX}px)`;
      // 預先顯示下一頁
      if (deltaX < 0 && currentIdx < pages.length - 1) {
        nextPage = pages[currentIdx + 1];
        nextPage.style.transition = 'none';
        nextPage.style.transform = `translateX(${window.innerWidth + deltaX}px)`;
        nextPage.style.opacity = 1;
      } else if (deltaX > 0 && currentIdx > 0) {
        nextPage = pages[currentIdx - 1];
        nextPage.style.transition = 'none';
        nextPage.style.transform = `translateX(${-window.innerWidth + deltaX}px)`;
        nextPage.style.opacity = 1;
      }
    }
  });

  storySlider.addEventListener('touchend', function(e) {
    if (!isDragging || startX === null) return;
    let direction = 0;
    if (Math.abs(deltaX) > threshold) {
      if (deltaX < 0) {
        // 左滑
        if (currentIdx < pages.length - 1) {
          direction = 1;
          // 動畫滑出當前頁，滑入下一頁
          currentPage.style.transition = 'transform 0.4s cubic-bezier(.77,0,.18,1)';
          currentPage.style.transform = `translateX(-100vw)`;
          nextPage.style.transition = 'transform 0.4s cubic-bezier(.77,0,.18,1)';
          nextPage.style.transform = 'translateX(0)';
          setTimeout(() => {
            showPage(currentIdx + 1, direction);
            currentPage.style.transition = '';
            currentPage.style.transform = '';
            nextPage.style.transition = '';
            nextPage.style.transform = '';
          }, 400);
        } else {
          // 最後一頁左滑返回首頁
          storySlider.classList.remove('active');
          storySlider.style.display = 'none';
          mainPage.style.display = 'block';
        }
      } else if (deltaX > 0) {
        // 右滑
        if (currentIdx > 0) {
          direction = -1;
          currentPage.style.transition = 'transform 0.4s cubic-bezier(.77,0,.18,1)';
          currentPage.style.transform = `translateX(100vw)`;
          nextPage.style.transition = 'transform 0.4s cubic-bezier(.77,0,.18,1)';
          nextPage.style.transform = 'translateX(0)';
          setTimeout(() => {
            showPage(currentIdx - 1, direction);
            currentPage.style.transition = '';
            currentPage.style.transform = '';
            nextPage.style.transition = '';
            nextPage.style.transform = '';
          }, 400);
        } else {
          // 第一頁右滑返回首頁
          storySlider.classList.remove('active');
          storySlider.style.display = 'none';
          mainPage.style.display = 'block';
        }
      }
    } else {
      // 未超閾值，回彈
      if (currentPage) {
        currentPage.style.transition = 'transform 0.3s';
        currentPage.style.transform = 'translateX(0)';
      }
      if (nextPage) {
        nextPage.style.transition = 'transform 0.3s';
        nextPage.style.transform = deltaX < 0 ? `translateX(100vw)` : `translateX(-100vw)`;
      }
    }
    // 重置
    startX = null;
    isDragging = false;
    deltaX = 0;
    currentPage = null;
    nextPage = null;
  });
}); 