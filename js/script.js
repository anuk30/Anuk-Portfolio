const menuToggle=document.getElementById("menuToggle");
const navMenu=document.getElementById("navMenu");

menuToggle.addEventListener("click",()=>navMenu.classList.toggle("active"));

document.querySelectorAll(".nav-menu a").forEach(link=>{
    link.addEventListener("click",()=>navMenu.classList.remove("active"));
});

const navbar=document.querySelector(".navbar");
window.addEventListener("scroll",()=>{
    navbar.style.background=window.scrollY>50
        ?"rgba(8,9,10,.96)"
        :"rgba(8,9,10,.88)";
});

const revealElements=document.querySelectorAll(
    ".section-heading,.about-content,.project-card,.skill-category,.timeline-item,.experience-card"
);

const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
        if(entry.isIntersecting){
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
        }
    });
},{threshold:.12});

revealElements.forEach(element=>{
    element.classList.add("reveal");
    observer.observe(element);
});

// Universal Image Slider Initializer (Supports multiple sliders on page)
function initSliders() {
    const sliders = document.querySelectorAll(".slider-container");
    sliders.forEach((slider) => {
        const slides = slider.querySelectorAll(".slide");
        if (slides.length <= 1) return;

        const prevBtn = slider.querySelector(".prev-btn");
        const nextBtn = slider.querySelector(".next-btn");
        const dotsContainer = slider.querySelector(".slider-dots");
        const slideCurrent = slider.querySelector(".current-slide");
        const slideTotal = slider.querySelector(".total-slides");
        const progressBar = slider.querySelector(".progress-bar");
        
        let currentIndex = 0;
        const total = slides.length;
        const slideDuration = 5000;
        let slideTimer = null;
        let isHovered = false;

        if (slideTotal) slideTotal.textContent = total;

        // Build pagination dots
        if (dotsContainer) {
            dotsContainer.innerHTML = "";
            slides.forEach((_, i) => {
                const dot = document.createElement("div");
                dot.className = `slider-dot ${i === 0 ? "active" : ""}`;
                dot.addEventListener("click", (e) => {
                    e.stopPropagation();
                    goToSlide(i);
                    startAutoSlide();
                });
                dotsContainer.appendChild(dot);
            });
        }

        function resetProgressBar() {
            if (!progressBar) return;
            progressBar.style.transition = "none";
            progressBar.style.width = "0%";
            void progressBar.offsetWidth;
            if (!isHovered) {
                progressBar.style.transition = `width ${slideDuration}ms linear`;
                progressBar.style.width = "100%";
            }
        }

        function goToSlide(index) {
            slides[currentIndex].classList.remove("active");
            const dots = dotsContainer ? dotsContainer.querySelectorAll(".slider-dot") : [];
            if (dots[currentIndex]) dots[currentIndex].classList.remove("active");

            currentIndex = (index + total) % total;

            slides[currentIndex].classList.add("active");
            if (dots[currentIndex]) dots[currentIndex].classList.add("active");
            if (slideCurrent) slideCurrent.textContent = currentIndex + 1;

            resetProgressBar();
        }

        function nextSlide() {
            goToSlide(currentIndex + 1);
        }

        function prevSlide() {
            goToSlide(currentIndex - 1);
        }

        function startAutoSlide() {
            clearInterval(slideTimer);
            resetProgressBar();
            slideTimer = setInterval(() => {
                if (!isHovered) {
                    nextSlide();
                }
            }, slideDuration);
        }

        if (nextBtn) {
            nextBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                nextSlide();
                startAutoSlide();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                prevSlide();
                startAutoSlide();
            });
        }

        slider.addEventListener("mouseenter", () => {
            isHovered = true;
            if (progressBar) {
                const computedWidth = window.getComputedStyle(progressBar).width;
                progressBar.style.transition = "none";
                progressBar.style.width = computedWidth;
            }
        });

        slider.addEventListener("mouseleave", () => {
            isHovered = false;
            startAutoSlide();
        });

        // Touch swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        slider.addEventListener("touchstart", (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        slider.addEventListener("touchend", (e) => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 40) {
                nextSlide();
                startAutoSlide();
            } else if (touchEndX - touchStartX > 40) {
                prevSlide();
                startAutoSlide();
            }
        }, { passive: true });

        startAutoSlide();
    });
}

initSliders();
