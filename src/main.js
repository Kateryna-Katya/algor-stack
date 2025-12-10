document.addEventListener('DOMContentLoaded', () => {

    // --- 1. ИНИЦИАЛИЗАЦИЯ ИКОНОК (Lucide) ---
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- 2. МОБИЛЬНОЕ МЕНЮ ---
    const burger = document.querySelector('.header__burger');
    const nav = document.querySelector('.header__nav');
    const navLinks = document.querySelectorAll('.nav__link');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('is-active');
            burger.classList.toggle('is-active');
            document.body.classList.toggle('no-scroll'); // Блокируем скролл фона
            
            // Анимация иконки бургера
            const spans = burger.querySelectorAll('span');
            if (nav.classList.contains('is-active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Закрываем меню при клике на пункт
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('is-active');
                burger.classList.remove('is-active');
                document.body.classList.remove('no-scroll');
                
                // Сброс иконки
                const spans = burger.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // --- 3. АВТО-ГОД В ФУТЕРЕ ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- 4. HERO АНИМАЦИЯ (GSAP + SplitType) ---
    if (typeof gsap !== 'undefined' && typeof SplitType !== 'undefined') {
        const heroText = document.querySelector('#hero-text');
        if (heroText) {
            try {
                const text = new SplitType('#hero-text', { types: 'words, chars' });
                const tl = gsap.timeline();
                
                tl.from(text.chars, {
                    opacity: 0,
                    y: 50,
                    duration: 0.8,
                    stagger: 0.04,
                    ease: "back.out(1.7)"
                })
                .from('.hero__desc', { opacity: 0, y: 20, duration: 0.5 }, "-=0.4")
                .from('.hero__actions', { opacity: 0, y: 20, duration: 0.5 }, "-=0.3")
                .from('.hero__visual', { opacity: 0, x: 50, duration: 1, ease: "power2.out" }, "-=0.8");
            } catch (e) {
                console.warn("GSAP animation error:", e);
            }
        }
    }

    // --- 5. ФОРМА КОНТАКТОВ (Fix исчезновения) ---
    const form = document.getElementById('contactForm');
    const successMsg = document.getElementById('successMessage');

    if (form && successMsg) {
        // Капча
        const captchaQ = document.getElementById('captchaQuestion');
        const captchaInput = document.getElementById('captchaInput');
        const captchaError = document.getElementById('captchaError');
        
        let num1 = Math.floor(Math.random() * 10) + 1;
        let num2 = Math.floor(Math.random() * 10) + 1;
        if (captchaQ) captchaQ.textContent = `${num1} + ${num2}`;

        // Ввод только цифр для телефона
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '');
            });
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Главная защита от перезагрузки
            
            let isValid = true;
            document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');

            // Проверка телефона
            if (phoneInput && phoneInput.value.length < 10) {
                document.getElementById('phoneError').textContent = 'Минимум 10 цифр';
                isValid = false;
            }

            // Проверка капчи
            if (captchaInput) {
                const sum = num1 + num2;
                if (parseInt(captchaInput.value) !== sum) {
                    if (captchaError) captchaError.textContent = 'Ошибка вычисления';
                    isValid = false;
                }
            }

            if (isValid) {
                const btn = form.querySelector('button[type="submit"]');
                const originalText = btn.textContent;
                btn.textContent = 'Отправка...';
                btn.disabled = true;

                // Имитация AJAX
                setTimeout(() => {
                    // 1. Скрываем форму
                    form.style.display = 'none';
                    
                    // 2. Показываем сообщение
                    successMsg.style.display = 'flex';
                    successMsg.style.opacity = '0';
                    successMsg.style.transform = 'translateY(10px)';
                    successMsg.style.transition = 'all 0.5s ease';

                    // 3. Запускаем плавное появление
                    requestAnimationFrame(() => {
                        successMsg.style.opacity = '1';
                        successMsg.style.transform = 'translateY(0)';
                    });

                }, 1000);
            }
            
            return false;
        });
    }

    // --- 6. COOKIE POPUP ---
    const cookiePopup = document.getElementById('cookiePopup');
    const acceptBtn = document.getElementById('acceptCookie');

    if (cookiePopup && acceptBtn) {
        if (!localStorage.getItem('cookiesAccepted')) {
            setTimeout(() => {
                cookiePopup.style.display = 'block';
                // Простая анимация на чистом JS
                cookiePopup.style.opacity = '0';
                cookiePopup.style.transform = 'translateY(50px)';
                cookiePopup.style.transition = 'all 0.5s ease';
                
                requestAnimationFrame(() => {
                    cookiePopup.style.opacity = '1';
                    cookiePopup.style.transform = 'translateY(0)';
                });
            }, 2500);
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            
            cookiePopup.style.opacity = '0';
            cookiePopup.style.transform = 'translateY(50px)';
            
            setTimeout(() => {
                cookiePopup.style.display = 'none';
            }, 500);
        });
    }

    // --- 7. SCROLL REVEAL (Появление блоков) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-title, .feature-card, .blog-card, .innovations__wrapper').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});