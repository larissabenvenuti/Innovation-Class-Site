const searchForm = document.querySelector(".search-bar form");
const searchInput = document.querySelector(".search-bar input");

function createSearchResultsContainer() {
  let resultsContainer = document.querySelector(".search-results-container");

  if (!resultsContainer) {
    resultsContainer = document.createElement("div");
    resultsContainer.className = "search-results-container";
    const navElement = document.querySelector(".main-nav");
    navElement.insertAdjacentElement("afterend", resultsContainer);
  }

  return resultsContainer;
}

function handleSearch(event) {
  event.preventDefault();
  const searchQuery = searchInput.value.trim();

  if (searchQuery) {
    const resultsContainer = createSearchResultsContainer();
    resultsContainer.innerHTML = "";

    const searchMessage = document.createElement("div");
    searchMessage.className = "search-message container";
    searchMessage.innerHTML = `<h2>Você buscou por: "${searchQuery}"</h2>`;

    const closeButton = document.createElement("div");
    closeButton.className = "close-search-results";
    closeButton.innerHTML = "&times;";
    closeButton.style.cursor = "pointer";
    closeButton.style.fontSize = "30px";
    closeButton.style.marginLeft = "20px"; 
    closeButton.style.display = "inline-block";

    searchMessage.appendChild(closeButton);

    resultsContainer.appendChild(searchMessage);

    const resultsElement = document.createElement("div");
    resultsElement.className = "search-results-list container";
    resultsElement.innerHTML = '<p class="loading-results">Buscando produtos...</p>';
    resultsContainer.appendChild(resultsElement);

    setTimeout(() => {
      resultsElement.innerHTML = `
        <div class="product-grid search-results-grid">
          <p>Exibindo resultados para "${searchQuery}"</p>
          <div class="no-results-message">
            <p>Nenhum produto encontrado para esta busca. Tente usar outras palavras-chave.</p>
          </div>
        </div>
      `;

      closeButton.addEventListener("click", function () {
        resultsContainer.remove(); 
      });

      resultsContainer.scrollIntoView({ behavior: "smooth" });
    }, 1000); 
  }
}

if (searchForm) {
  searchForm.addEventListener("submit", handleSearch);
}

if (searchInput) {
  searchInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      handleSearch(event);
    }
  });
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

function initFooterAccordion() {
  const isMobile = window.innerWidth <= 767;
  if (!isMobile) return;

  const accordionHeaders = document.querySelectorAll(
    ".footer-links > div > h4"
  );

  accordionHeaders.forEach((header) => {
    header.addEventListener("click", function () {
      const accordionItem = this.parentNode;
      accordionItem.classList.toggle("active");

      accordionHeaders.forEach((otherHeader) => {
        const otherItem = otherHeader.parentNode;
        if (otherItem !== accordionItem) {
          otherItem.classList.remove("active");
        }
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const carousels = document.querySelectorAll(".carousel");

  carousels.forEach((carousel) => {
    initializeCarousel(carousel);
  });

  initFooterAccordion();
});

function initializeCarousel(carousel) {
  const track = carousel.querySelector(".carousel-track");
  const prevBtn = carousel.querySelector(".prev-btn");
  const nextBtn = carousel.querySelector(".next-btn");
  const carouselWrapper = carousel.querySelector(".carousel-wrapper");

  const cards = track?.querySelectorAll(".product-card") || [];

  if (!track || !prevBtn || !nextBtn || cards.length === 0 || !carouselWrapper) {
    console.warn("Carrossel incompleto. Adicione elementos.");
    return;
  }

  let currentPosition = 0;

  function getCarouselSettings() {
    const cardWidth = cards[0].offsetWidth + 15;
    const wrapperWidth = carouselWrapper.offsetWidth;
    const visibleCards = Math.floor(wrapperWidth / cardWidth);
    const maxPosition = Math.max(
      0,
      Math.ceil((cards.length - visibleCards) / visibleCards)
    );
    return { cardWidth, visibleCards, maxPosition };
  }

  function createDots(maxPosition) {
    const dotsContainer = carousel.querySelector(".pagination-dots");
    if (!dotsContainer) return;

    dotsContainer.innerHTML = "";

    for (let i = 0; i <= maxPosition; i++) {
      const dot = document.createElement("span");
      dot.classList.add("dot");
      if (i === 0) dot.classList.add("active");

      dot.addEventListener("click", () => moveCarousel(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots(position) {
    const dots = carousel.querySelectorAll(".pagination-dots .dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === position);
    });
  }

  function moveCarousel(position) {
    const { cardWidth, visibleCards, maxPosition } = getCarouselSettings();
    position = Math.max(0, Math.min(position, maxPosition));
    currentPosition = position;
    const translateValue = -position * visibleCards * cardWidth;
    track.style.transition = "transform 0.3s ease";
    track.style.transform = `translateX(${translateValue}px)`;
    updateDots(position);
  }

  prevBtn.addEventListener("click", () => {
    if (currentPosition > 0) {
      moveCarousel(currentPosition - 1);
    }
  });

  nextBtn.addEventListener("click", () => {
    const { maxPosition } = getCarouselSettings();
    if (currentPosition < maxPosition) {
      moveCarousel(currentPosition + 1);
    }
  });

  window.addEventListener(
    "resize",
    debounce(() => {
      const { maxPosition } = getCarouselSettings();
      createDots(maxPosition);
      moveCarousel(currentPosition);
    }, 250)
  );

  const { maxPosition } = getCarouselSettings();
  createDots(maxPosition);
  moveCarousel(0);
}

document.addEventListener("DOMContentLoaded", function () {
  const headerContainer = document.querySelector(".header-container");

  const mobileMenuToggle = document.createElement("div");
  mobileMenuToggle.className = "mobile-menu-toggle";
  mobileMenuToggle.innerHTML = "<span></span><span></span><span></span>";
  headerContainer.insertBefore(mobileMenuToggle, headerContainer.firstChild);

  const mainNav = document.querySelector(".main-nav");

  mobileMenuToggle.addEventListener("click", function () {
    this.classList.toggle("active");
    mainNav.classList.toggle("active");

    const spans = this.querySelectorAll("span");
    if (this.classList.contains("active")) {
      spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
      spans[1].style.opacity = "0";
      spans[2].style.transform = "rotate(-45deg) translate(5px, -5px)";
    } else {
      spans[0].style.transform = "none";
      spans[1].style.opacity = "1";
      spans[2].style.transform = "none";
    }
  });

  const menuItems = document.querySelectorAll(".categories-menu > li");

  menuItems.forEach((item) => {
    const hasDropdown = item.querySelector(".hover-menu") !== null;

    if (hasDropdown) {
      const link = item.querySelector("a");
      const indicator = document.createElement("span");
      indicator.className = "mobile-dropdown-indicator";
      indicator.innerHTML = "+";
      indicator.style.float = "right";
      indicator.style.marginRight = "10px";
      indicator.style.fontSize = "18px";
      link.appendChild(indicator);

      item.addEventListener("click", function (e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          const isActive = item.classList.toggle("touch-active");
          indicator.innerHTML = isActive ? "–" : "+";

          menuItems.forEach((otherItem) => {
            if (otherItem !== item) {
              otherItem.classList.remove("touch-active");
              const otherIndicator = otherItem.querySelector(
                ".mobile-dropdown-indicator"
              );
              if (otherIndicator) otherIndicator.innerHTML = "+";
            }
          });
        }
      });
    }
  });

  document.addEventListener("click", function (e) {
    if (
      !e.target.closest(".main-nav") &&
      !e.target.closest(".mobile-menu-toggle")
    ) {
      mainNav.classList.remove("active");
      mobileMenuToggle.classList.remove("active");
      const spans = mobileMenuToggle.querySelectorAll("span");
      spans[0].style.transform = "none";
      spans[1].style.opacity = "1";
      spans[2].style.transform = "none";
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
      mainNav.classList.remove("active");
      mobileMenuToggle.classList.remove("active");
      const spans = mobileMenuToggle.querySelectorAll("span");
      spans[0].style.transform = "none";
      spans[1].style.opacity = "1";
      spans[2].style.transform = "none";
      menuItems.forEach((item) => {
        item.classList.remove("touch-active");
        const indicator = item.querySelector(".mobile-dropdown-indicator");
        if (indicator) indicator.innerHTML = "+";
      });
    } else {
      initFooterAccordion();
    }
  });

  initFooterAccordion();
});

document.addEventListener("DOMContentLoaded", function () {
  const checkMobile = () => {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      setupMobileSlider();
    }
  };

  function setupMobileSlider() {
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".slider-dot");
    let currentSlide = 0;
    let slideInterval;
    let isAnimating = false;

    function showSlide(index) {
      if (isAnimating) return;
      isAnimating = true;

      slides.forEach((slide) => slide.classList.remove("active"));
      dots.forEach((dot) => dot.classList.remove("active"));

      slides[index].classList.add("active");
      dots[index].classList.add("active");

      currentSlide = index;

      setTimeout(() => {
        isAnimating = false;
      }, 600);
    }

    dots.forEach((dot) => {
      dot.addEventListener("click", function () {
        if (isAnimating) return;

        const slideIndex = parseInt(this.getAttribute("data-slide"));
        showSlide(slideIndex);

        clearInterval(slideInterval);
        startAutoSlide();
      });
    });

    function startAutoSlide() {
      clearInterval(slideInterval);
      slideInterval = setInterval(function () {
        if (isAnimating) return;

        let nextSlide = currentSlide + 1;
        if (nextSlide >= slides.length) {
          nextSlide = 0;
        }
        showSlide(nextSlide);
      }, 5000);
    }

    let touchStartX = 0;
    let touchEndX = 0;

    const sliderContainer = document.querySelector(".slider-container");

    sliderContainer.addEventListener(
      "touchstart",
      function (e) {
        if (isAnimating) return;
        touchStartX = e.changedTouches[0].screenX;

        clearInterval(slideInterval);
      },
      { passive: true }
    );

    sliderContainer.addEventListener(
      "touchend",
      function (e) {
        if (isAnimating) return;
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();

        startAutoSlide();
      },
      { passive: true }
    );

    function handleSwipe() {
      const swipeThreshold = 50;
      const swipeDistance = touchEndX - touchStartX;

      if (Math.abs(swipeDistance) < swipeThreshold) {
        return;
      }

      if (swipeDistance < 0) {
        let nextSlide = currentSlide + 1;
        if (nextSlide >= slides.length) {
          nextSlide = 0;
        }
        showSlide(nextSlide);
      } else {
        let prevSlide = currentSlide - 1;
        if (prevSlide < 0) {
          prevSlide = slides.length - 1;
        }
        showSlide(prevSlide);
      }
    }

    startAutoSlide();
  }

  checkMobile();

  window.addEventListener('resize', checkMobile);
});
