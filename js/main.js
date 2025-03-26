(function ($) {
  "use strict";

  let device_width = window.innerWidth;
  var isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Nokia|Opera Mini/i.test(
      navigator.userAgent
    )
      ? true
      : false;
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  var ashik = {
    init() {
      this.smoothScroll();
      this.stickyHeader();
      this.mobileMenu();
      this.buttonHover();
      this.counters();
      this.magnificPopup();
      this.sliders();
      this.searchPopup();
      this.isotopeLayout();
      this.customMouse();
      this.portfolioHover();
      this.preloader();
      this.scrollButton();
      this.portfolio2Hover();
    },

    smoothScroll() {
      // Smooth scroll function with offset
      function smoothScroll(target, duration, offset = 200) {
        const targetElement = document.querySelector(target);
        if (!targetElement) return; // Exit if target doesn't exist

        const targetPosition =
          targetElement.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition - offset; // Adjust for offset
        let startTime = null;

        function animation(currentTime) {
          if (startTime === null) startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const run = ease(timeElapsed, startPosition, distance, duration);
          window.scrollTo(0, run);
          if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        // Easing function (easeInOutQuad)
        function ease(t, b, c, d) {
          t /= d / 2;
          if (t < 1) return (c / 2) * t * t + b;
          t--;
          return (-c / 2) * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
      }

      // Add smooth scroll to all anchor links
      document
        .querySelectorAll('a[href^="#"]:not([role="tab"])')
        .forEach((anchor) => {
          anchor.addEventListener("click", function (e) {
            e.preventDefault(); // Prevent default jump behavior
            const target = this.getAttribute("href");
            smoothScroll(target, 1000, 200); // 1000ms duration, 200px offset
          });
        });
    },

    stickyHeader() {
      var header = $(".fixed-header");
      if (header.length) {
        $(window).on("scroll", function () {
          var scroll = $(window).scrollTop();
          if (scroll < 100) {
            header.removeClass("sticky");
          } else {
            header.addClass("sticky");
          }
        });
      }
    },
    portfolio2Hover() {
      const portfolio2_animation_wrap =
        document.querySelectorAll(".portfolio2-item");
      const portfolio2_titles = document.querySelector(".portfolio2_titles");

      if (portfolio2_titles) {
        portfolio2_animation_wrap.forEach((element) => {
          element.addEventListener("mousemove", (e) => {
            let title = element.getAttribute("data-title");
            if (title) {
              portfolio2_titles.classList.add("visible");
              portfolio2_titles.innerHTML = title;
            }
            portfolio2_titles.style.left = `${e.clientX + 15}px`; // Adjust offset as needed
            portfolio2_titles.style.top = `${e.clientY + 15}px`; // Adjust offset as needed
          });

          element.addEventListener("mouseleave", () => {
            portfolio2_titles.classList.remove("visible");
          });
        });
      }
    },
    mobileMenu() {
      if ($("#navbarNav").length && $("#mobile-nav").length) {
        let mobileNavContainer = $("#mobile-nav");
        mobileNavContainer.html($("#navbarNav").clone());
        let arrow = $("#mobile-nav .dropdown-nav > a");

        arrow.each(function () {
          let self = $(this);
          let arrowBtn = document.createElement("BUTTON");
          arrowBtn.classList.add("dropdown-toggle-btn");
          arrowBtn.innerHTML = "<i class='fa-light fa-angle-down'></i>";

          self.append(function () {
            return arrowBtn;
          });

          self.on("click", function (e) {
            e.preventDefault();
            let self = $(this);
            self.toggleClass("dropdown-opened");
            self.parent().toggleClass("expanded");
            self
              .parent()
              .parent()
              .addClass("dropdown-opened")
              .siblings()
              .removeClass("dropdown-opened");
            self.parent().children(".submenu").slideToggle();
          });
        });
      }

      var menu = $(".toggle-sidebar");
      menu.on("click", function (e) {
        e.preventDefault();
        $(".mobile-menu").toggleClass("visible");
      });
      $(".menu-backdrop").on("click", function () {
        $(".mobile-menu").toggleClass("visible");
      });
    },

    buttonHover() {
      class Magnet {
        constructor(target, magnetism = 0.2) {
          this.target = target;
          this.magnetism = magnetism;
          this.interval;
          this.hover = false;
          this.bubble;
          this.content;
          this.initX;
          this.initY;
          this.cursorX = 0;
          this.cursorY = 0;
          this.buttonX = 0;
          this.buttonY = 0;
          this.contentX = 0;
          this.contentY = 0;
          this.bubbleX = 0;
          this.bubbleY = 0;
          this.init();
        }

        init() {
          this.initX =
            this.target.getBoundingClientRect().left +
            this.target.offsetWidth / 2;
          this.initY =
            this.target.getBoundingClientRect().top +
            this.target.offsetHeight / 2;

          let inner = this.target.innerHTML;
          inner = `<span class="js-magnet-content magnet-content">${inner}</span>`;
          inner = `<i class="js-magner-bubble magnet-bubble"></i>${inner}`;
          this.target.innerHTML = inner;
          this.bubble = this.target.querySelector(".js-magner-bubble");
          this.content = this.target.querySelector(".js-magnet-content");

          let timelineBubble = gsap
            .timeline({ paused: true })
            .to(this.bubble, {
              duration: 0,
              opacity: 1,
            })
            .to(this.bubble, {
              duration: 0.6,
              scaleX: "15000%",
              scaleY: "15000%",
            });

          var ball = $("#ball");
          this.target.addEventListener("mouseenter", (e) => {
            this.hover = true;
            this.moveBubble(e);
            timelineBubble.play();
            let that = this;
            this.interval = setInterval(this.magnetize, 30, that);
            ball.removeClass("d-block");
            ball.addClass("d-none");
          });

          this.target.addEventListener("mouseleave", (e) => {
            this.moveBubble(e);
            timelineBubble.reverse();
            this.hover = false;
            this.cursorX = 0;
            this.cursorY = 0;
            ball.removeClass("d-none");
            ball.addClass("d-block");
          });

          this.target.addEventListener("mousemove", (e) => {
            let targetX =
              this.target.getBoundingClientRect().left +
              this.target.offsetWidth / 2;
            let targetY =
              this.target.getBoundingClientRect().top +
              this.target.offsetHeight / 2;
            this.cursorX =
              ((e.clientX - targetX) * 100) / (this.target.offsetWidth / 2);
            this.cursorY =
              ((e.clientY - targetY) * 100) / (this.target.offsetHeight / 2);
          });
        }

        moveBubble(e) {
          this.bubbleX = (e.offsetX * 100) / this.target.offsetWidth;
          this.bubbleY = (e.offsetY * 100) / this.target.offsetHeight;
          this.bubble.style.left = this.bubbleX + "%";
          this.bubble.style.top = this.bubbleY + "%";
        }

        magnetize(that) {
          let distance = Math.sqrt(
            (that.initX - that.buttonX) ** 2 + (that.initY - that.buttonY) ** 2
          );
          let magnetized = distance > 0.01 && that.hover ? true : false;

          if (magnetized) {
            that.buttonX += (that.cursorX - that.buttonX) * 0.2;
            that.buttonY += (that.cursorY - that.buttonY) * 0.2;
            that.contentX += (that.cursorX - that.contentX) * 0.2;
            that.contentY += (that.cursorY - that.contentY) * 0.2;
            let buttonTranslateX = `translateX(${
              that.buttonX * that.magnetism
            }%)`;
            let buttonTranslateY = `translateY(${
              that.buttonY * that.magnetism
            }%)`;
            let contentTranslateX = `translateX(${
              (-that.contentX * that.magnetism) / 2
            }%)`;
            let contentTranslateY = `translateY(${
              (-that.contentY * that.magnetism) / 2
            }%)`;
            that.target.style.transform =
              buttonTranslateX + " " + buttonTranslateY;
            that.content.style.transform =
              contentTranslateX + " " + contentTranslateY;
          } else {
            that.target.style.transform = "translateX(0%) translateY(0%)";
            that.content.style.transform = "translateX(0%) translateY(0%)";
            clearInterval(that.interval);
          }
        }
      }

      let magnets = document.querySelectorAll(".btn_moveing_hover");
      magnets.forEach((magnet) => {
        new Magnet(magnet);
      });
    },

    counters() {
      if ($(".count").length) {
        $(".count").countUp();
      }
    },

    magnificPopup() {
      $(".portfolio2-items").each(function () {
        $(this).magnificPopup({
          delegate: "a",
          type: "image",
          gallery: {
            enabled: true,
          },
        });
      });

      $(".video-play a").each(function () {
        $(this).magnificPopup({
          type: "iframe",
          mainClass: "mfp-fade",
          preloader: false,
          fixedContentPos: true,
        });
      });
    },

    sliders() {
      if ($(".brand-slider").length) {
        new Swiper(".brand-slider", {
          slidesPerView: 2,
          spaceBetween: 0,
          autoplay: {
            delay: 3000,
            disableOnInteraction: false,
          },
          loop: true,
          breakpoints: {
            550: {
              slidesPerView: 3,
              spaceBetween: 0,
            },
            992: {
              slidesPerView: 5,
              spaceBetween: 0,
            },
          },
        });
      }

      if ($(".testimonial-sliders").length) {
        new Swiper(".testimonial-sliders", {
          slidesPerView: 1,
          spaceBetween: 30,
          loop: true,
          centeredSlides: true,
          grabCursor: true,
          mousewheel: {
            invert: false,
          },
          autoplay: {
            delay: 3000,
            disableOnInteraction: false,
          },
          breakpoints: {
            992: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
          },
        });
      }

      if ($(".testimonial2-sliders").length) {
        new Swiper(".testimonial2-sliders", {
          slidesPerView: 1,
          spaceBetween: 0,
          loop: true,
          navigation: {
            nextEl: ".testimonial-next",
            prevEl: ".testimonial-prev",
          },
          mousewheel: {
            invert: false,
          },
        });
      }
    },

    searchPopup() {
      $(".search-btn").on(
        "click",
        (e) => (e.preventDefault(), $(".search-popup").addClass("visible"))
      );
      $(".search-popup-overlay, .close-search").on(
        "click",
        (e) => (e.preventDefault(), $(".search-popup").removeClass("visible"))
      );
    },

    isotopeLayout() {
      var portfolio2_items = $(".portfolio2-items");
      portfolio2_items.each(function () {
        var element = $(this);
        element.isotope({
          masonry: {
            columnWidth: 100,
            gutterWidth: 20,
          },
        });
        $('a[data-bs-toggle="pill"]').on("shown.bs.tab", function (e) {
          if (
            e.target.hash == "#portfolio-photography" ||
            e.target.hash == "#portfolio-ui-ux" ||
            e.target.hash == "#portfolio-video"
          ) {
            element.isotope({
              percentPosition: true,
              masonry: {
                columnWidth: 3,
              },
            });
          }
        });
      });
    },

    customMouse() {
      var mouse = { x: 0, y: 0 }; // Cursor position
      var pos = { x: 0, y: 0 }; // Cursor position
      var ratio = 0.15; // delay follow cursor
      var active = false;
      var ball = $("#ball");

      /** default */
      const defaultValue = {
        duration: 0.3,
        opacity: 0.5,
        width: "30px",
        height: "30px",
        backgroundColor: "transparent",
        border: "2px solid #555",
      };
      const hoverBall = {
        duration: 0.3,
        css: {
          borderWidth: 0,
          opacity: "1!important",
          width: "100px!important",
          height: "100px!important",
          backgroundColor: "#2c7365",
        },
      };
      gsap.set(ball, {
        // scale from middle and style ball
        xPercent: -50,
        yPercent: -50,
      });
      document.addEventListener("mousemove", mouseMove);
      function mouseMove(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      }
      gsap.ticker.add(updatePosition);
      function updatePosition() {
        if (!active) {
          pos.x += (mouse.x - pos.x) * ratio;
          pos.y += (mouse.y - pos.y) * ratio;

          gsap.set(ball, { x: pos.x, y: pos.y });
        }
      }
      // link
      $("a,.c-pointer,button,.progress")
        .not(".project_slider a") // omit from selection.
        .on("mouseenter", function () {
          gsap.to(ball, {
            duration: 0.3,
            borderWidth: 0,
            opacity: 0.5,
            backgroundColor: "#CCC",
            width: "80px",
            height: "80px",
          });
        })
        .on("mouseleave", function () {
          gsap.to(ball, defaultValue);
        });

      // Data cursor
      if ($("[data-cursor]")) {
        $("[data-cursor]").each(function () {
          $(this)
            .on("mouseenter", function () {
              ball.append('<div class="ball-view"></div>');
              $(".ball-view").append($(this).attr("data-cursor"));
              gsap.to(ball, hoverBall);
            })
            .on("mouseleave", function () {
              ball.find(".ball-view").remove();
              gsap.to(ball, defaultValue);
            });
        });
      }
    },

    portfolioHover() {
      const portfolios = $(".portfolio-item");

      portfolios.each(function () {
        $(this).on("mouseenter", function () {
          // Reset all items
          portfolios
            .removeClass("active")
            .parent()
            .removeClass("col-md-6")
            .addClass("col-md-3");

          // Activate only the hovered item
          $(this)
            .addClass("active")
            .parent()
            .removeClass("col-md-3")
            .addClass("col-md-6");
        });
      });
    },
    preloader() {
      window.onload = () => {
        const svg = document.getElementById("svg");
        const tl = gsap.timeline();
        const curve = "M0 502S175 272 500 272s500 230 500 230V0H0Z";
        const flat = "M0 2S175 1 500 1s500 1 500 1V0H0Z";

        tl.to(".preloader-text", {
          delay: 0.5,
          y: -100,
          opacity: 0,
        });

        tl.to(svg, {
          duration: 0.1,
          // attr: { d: curve },
          ease: "power2.easeIn",
        }).to(svg, {
          duration: 0.5,
          attr: { d: flat },
          ease: "power2.easeOut",
        });

        tl.to(".preloader", {
          y: -1500,
        });
        tl.to(".preloader", {
          zIndex: -1,
          display: "none",
        });
      };
    },

    scrollButton() {
      $(".tf__scroll_btn").on("click", function () {
        $("html, body").animate(
          {
            scrollTop: 0,
          },
          300
        );
      });

      $(window).on("scroll", function () {
        var scrolling = $(window).scrollTop();

        if (scrolling > 500) {
          $(".tf__scroll_btn").fadeIn();
        } else {
          $(".tf__scroll_btn").fadeOut();
        }
      });
    },

    imgToSvg() {
      // Function to convert images to SVGs
    },
  };

  $(document).ready(function () {
    ashik.init();
  });
})(jQuery);
