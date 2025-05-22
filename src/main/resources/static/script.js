// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const header = document.querySelector('header');
    const heroSection = document.querySelector('section[aria-label="头图"]');

    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        // Toggle menu icon between menu and x
        if (mobileMenuButton.querySelector('i').classList.contains('icon-menu')) {
            mobileMenuButton.querySelector('i').classList.remove('icon-menu');
            mobileMenuButton.querySelector('i').classList.add('icon-x');
        } else {
            mobileMenuButton.querySelector('i').classList.remove('icon-x');
            mobileMenuButton.querySelector('i').classList.add('icon-menu');
        }
    });

    // Close mobile menu when a nav item is clicked
    const mobileNavItems = document.querySelectorAll('#mobile-menu a');
    mobileNavItems.forEach(item => {
        item.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            mobileMenuButton.querySelector('i').classList.remove('icon-x');
            mobileMenuButton.querySelector('i').classList.add('icon-menu');
        });
    });

    // Prevent zooming on mobile
    window.addEventListener("wheel", (e) => {
        const isPinching = e.ctrlKey;
        if (isPinching) e.preventDefault();
    }, { passive: false });

    // Always show header
    let ticking = false;

    // Make sure header is always visible
    header.classList.remove('hidden');

    // No need for header visibility check anymore

    // Parallax effect for hero section
    const parallaxBg = document.getElementById('parallax-bg');
    // const heroSection = document.getElementById('hero-section');

    // Initialize scroll animations
    const initScrollAnimations = () => {
        const animatedElements = document.querySelectorAll('[data-scroll-animation]');

        // If IntersectionObserver is not supported, show all elements
        if (!('IntersectionObserver' in window)) {
            animatedElements.forEach(element => {
                element.classList.add('in-view');
            });
            return;
        }

        // 识别同一行的元素并分组
        const groupElementsByRow = () => {
            const rows = {};
            const elements = Array.from(animatedElements);

            elements.forEach(element => {
                // 获取元素的顶部位置
                const rect = element.getBoundingClientRect();
                const top = Math.round(rect.top);

                // 使用顶部位置作为行标识
                if (!rows[top]) {
                    rows[top] = [];
                }

                // 将元素添加到对应的行
                rows[top].push(element);
            });

            return rows;
        };

        // 为同一行的元素设置相同的动画延迟
        const setRowAnimationDelays = () => {
            const rows = groupElementsByRow();

            // 为每一行的元素设置相同的延迟
            Object.keys(rows).forEach((rowTop, rowIndex) => {
                const elements = rows[rowTop];

                // 移除所有现有的stagger类
                elements.forEach(element => {
                    element.classList.remove('stagger-1', 'stagger-2', 'stagger-3', 'stagger-4', 'stagger-5', 'stagger-6');

                    // 为整行添加相同的stagger类，基于行索引
                    const staggerClass = `stagger-${(rowIndex % 6) + 1}`;
                    element.classList.add(staggerClass);
                });
            });
        };

        // 初始设置行动画延迟
        setRowAnimationDelays();

        // 窗口大小改变时重新计算
        window.addEventListener('resize', setRowAnimationDelays);

        // Create an Intersection Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 当元素进入视口时，添加 'in-view' 类
                    entry.target.classList.add('in-view');
                    // 不再停止观察，以便元素离开后可以再次触发动画
                } else {
                    // 当元素离开视口时，移除 'in-view' 类
                    // 这样当元素再次进入时，动画可以重新播放
                    entry.target.classList.remove('in-view');
                }
            });
        }, {
            root: null, // viewport
            threshold: 0.05, // 从0.1减小到0.05，使动画更早触发
            rootMargin: '10px' // 从0px增加到10px，提前一点触发动画
        });

        // Observe all elements with data-scroll-animation attribute
        animatedElements.forEach(element => {
            // Check if element is already in viewport
            const rect = element.getBoundingClientRect();
            const isInViewport = (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.bottom >= 0
            );

            if (isInViewport) {
                // Element is already in viewport, add in-view class immediately
                element.classList.add('in-view');
            }

            // 无论元素是否在视口中，都观察它，以便支持重复动画
            observer.observe(element);
        });

        // Force check for elements already in viewport on page load
        setTimeout(() => {
            window.dispatchEvent(new Event('scroll'));
        }, 100);
    };

    // Combined scroll handler for better performance
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                // Handle parallax effect
                if (parallaxBg) {
                    const scrollPosition = window.scrollY;
                    if (scrollPosition <= window.innerHeight * 1.5) {
                        // Move the background image at a slower rate than the scroll
                        // We use scale(1.15) for a more pronounced effect in full-screen mode
                        // 减小系数从0.3到0.2，使视差效果更加缓慢
                        parallaxBg.style.transform = `translateY(${scrollPosition * 0.2}px) scale(1.15)`;

                        // Also adjust opacity based on scroll position for a fade effect
                        // 减小系数，使透明度变化更加缓慢
                        const opacity = Math.max(0.4 - (scrollPosition / (window.innerHeight * 3)), 0.2);
                        parallaxBg.style.opacity = opacity;
                    }
                }

                // Add scrolled class to hero section when scrolled
                if (heroSection) {
                    if (window.scrollY > 100) {
                        heroSection.classList.add('scrolled');
                    } else {
                        heroSection.classList.remove('scrolled');
                    }
                }

                ticking = false;
            });
            ticking = true;
        }
    });

    // Header is always visible now, no need for additional scroll event listener

    // Initialize scroll animations
    initScrollAnimations();

    // Initialize chat functionality
    initChat();
});

// Chat functionality
function initChat() {
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-message');

    // Function to add a user message to the chat
    function addUserMessage(message) {
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'user-message';
        userMessageDiv.innerHTML = `
            <div class="user-message-bubble">
                ${message}
            </div>
        `;
        chatMessages.appendChild(userMessageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Function to add an assistant (tayori) message to the chat
    function addAssistantMessage(message) {
        const assistantMessageDiv = document.createElement('div');
        assistantMessageDiv.className = 'assistant-message';
        assistantMessageDiv.innerHTML = `
            <div class="assistant-avatar">
                <i class="icon-bot text-white text-sm"></i>
            </div>
            <div class="assistant-message-bubble">
                ${message.replace(/\n/g, '<br>')}
            </div>
        `;
        chatMessages.appendChild(assistantMessageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Function to send a message
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message === '') return;

        // Add user message to chat
        addUserMessage(message);
        chatInput.value = '';

        // Process message and get response
        setTimeout(() => {
            let response = getResponse(message);
            addAssistantMessage(response);
        }, 500);
    }

    // Function to get a response based on the user's message
    // This will be overridden by language-switcher.js if language is changed
    window.getResponse = function(message) {
        // Get current language
        const currentLang = localStorage.getItem('tayori-language') || 'zh';

        // Use the localized chat responses from translations.js
        return getLocalizedChatResponse(message, currentLang);
    };

    // Event listeners
    // sendButton.addEventListener('click', sendMessage);

    // chatInput.addEventListener('keypress', (e) => {
    //     if (e.key === 'Enter') {
    //         sendMessage();
    //     }
    // });
}
