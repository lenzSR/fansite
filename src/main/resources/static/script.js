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
                        const opacity = Math.max(0.6 - (scrollPosition / (window.innerHeight * 3)), 0.2);
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

    // Sample Q&A database
    const qaDatabase = {
        "tayori的名字有什么特殊含义吗?": "\"tayori\" (便り) 这个名字，寄托了成员们希望在某些特别的时刻，他们的音乐能够成为听众心灵的依靠和慰藉，如同远方传来的温暖讯息。✉️",
        "tayori的名字有什么含义": "\"tayori\" (便り) 这个名字，寄托了成员们希望在某些特别的时刻，他们的音乐能够成为听众心灵的依靠和慰藉，如同远方传来的温暖讯息。✉️",
        "乐队是什么时候成立的?": "tayori正式成立于2023年7月22日！raku和tazuneru原本是islet组合，后来与主唱isui碰撞出火花，就组成了现在的tayori。✨",
        "乐队什么时候成立": "tayori正式成立于2023年7月22日！raku和tazuneru原本是islet组合，后来与主唱isui碰撞出火花，就组成了现在的tayori。✨",
        "成立时间": "tayori正式成立于2023年7月22日！",
        "成员们各自的角色是什么?": "isui是我们的主唱，拥有清澈而富有感染力的声线。raku负责作曲，是旋律的织造者。tazuneru则负责音乐制作和编曲，擅长音色的打磨和氛围营造。🎵",
        "成员角色": "isui是我们的主唱，拥有清澈而富有感染力的声线。raku负责作曲，是旋律的织造者。tazuneru则负责音乐制作和编曲，擅长音色的打磨和氛围营造。🎵",
        "在哪里可以听到tayori的歌?": "可以在网易云音乐搜索\"tayori\"，或访问我们的B站官方账号：tayori_official。Instagram和官网也会更新最新音乐资讯哦！🎧",
        "在哪里听歌": "可以在网易云音乐搜索\"tayori\"，或访问我们的B站官方账号：tayori_official。Instagram和官网也会更新最新音乐资讯哦！🎧",
        "如何购买周边": "目前可以通过我们的官方网站 tayori.bitfan.id 了解和购买乐队周边产品，请关注官方社交平台获取最新周边发售信息！🛍️",
        "tayori参加过哪些演出?": "我们曾参加过UF游戏音乐嘉年华等活动，也举办过个人演唱会如\"春を待つ\"。关注我们的社交媒体可以获取最新演出信息！🎤",
        "有什么演出": "我们曾参加过UF游戏音乐嘉年华等活动，也举办过个人演唱会如\"春を待つ\"。关注我们的社交媒体可以获取最新演出信息！🎤",
        "你们的音乐风格是什么": "tayori的音乐展现了多元的包容性，不拘泥于特定风格，致力于探索声音的无限可能，创造能够触动人心的旋律。🎶",
        "音乐风格": "tayori的音乐展现了多元的包容性，不拘泥于特定风格，致力于探索声音的无限可能，创造能够触动人心的旋律。🎶",
        "isui是谁": "isui (倚水) 是tayori的主唱，拥有清澈而富有感染力的声线。她的歌声为乐队的乐曲注入灵魂，细腻地诠释每一份情感，引领听众进入tayori的音乐世界。🎤",
        "raku是谁": "raku是tayori的作曲家，也是乐队的初代成员之一（前islet组合）。他擅长捕捉灵感，编织出多元且富有层次的旋律，为tayori的音乐奠定了坚实的基础。🎼",
        "tazuneru是谁": "tazuneru是tayori的音乐制作人，同为乐队的初代成员（前islet组合）。他在音乐制作和编曲方面扮演着关键角色，精于音色的打磨和整体氛围的营造，赋予tayori作品独特的质感和深度。🎛️",
        "有粉丝群吗": "请关注我们的官方社交媒体账号获取粉丝社群信息！我们会在那里发布最新的粉丝活动和互动信息。💕",
        "帮助": "你可以向我询问以下问题：\n- tayori的名字含义\n- 乐队成立时间\n- 成员角色介绍\n- 在哪里听tayori的音乐\n- 乐队的演出经历\n- 音乐风格特点\n- 如何购买周边\n- 关于个别成员的信息\n或者任何你想了解的关于tayori的问题！",
        "help": "你可以向我询问以下问题：\n- tayori的名字含义\n- 乐队成立时间\n- 成员角色介绍\n- 在哪里听tayori的音乐\n- 乐队的演出经历\n- 音乐风格特点\n- 如何购买周边\n- 关于个别成员的信息\n或者任何你想了解的关于tayori的问题！"
    };

    // Default responses for unrecognized queries
    const defaultResponses = [
        "抱歉，我不太确定你的问题。你可以尝试询问关于tayori的成立、成员、音乐作品或演出信息等。输入\"帮助\"可查看预设问题列表。",
        "这个问题有点复杂，我可能无法准确回答。你可以尝试问一些关于乐队基本信息的问题，或输入\"帮助\"查看可用问题列表。",
        "很抱歉，我目前没有这个问题的答案。请尝试换一种方式提问，或输入\"帮助\"查看我能回答的问题类型。",
        "作为一个简单的问答机器人，我对这个问题没有足够的信息。请试试关于tayori乐队历史、成员或音乐作品的问题吧！"
    ];

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
    function getResponse(message) {
        message = message.toLowerCase();

        // Check if we have a direct match
        for (const [question, answer] of Object.entries(qaDatabase)) {
            if (message.includes(question.toLowerCase())) {
                return answer;
            }
        }

        // Check for keyword matches
        if (message.includes('名字') || message.includes('含义') || message.includes('寓意')) {
            return qaDatabase["tayori的名字有什么特殊含义吗?"];
        } else if (message.includes('成立') || message.includes('什么时候') || message.includes('历史')) {
            return qaDatabase["乐队是什么时候成立的?"];
        } else if (message.includes('角色') || message.includes('职责') || message.includes('做什么')) {
            return qaDatabase["成员们各自的角色是什么?"];
        } else if (message.includes('听') || message.includes('歌') || message.includes('音乐') || message.includes('作品')) {
            return qaDatabase["在哪里可以听到tayori的歌?"];
        } else if (message.includes('演出') || message.includes('表演') || message.includes('live') || message.includes('演唱会')) {
            return qaDatabase["tayori参加过哪些演出?"];
        } else if (message.includes('周边') || message.includes('商品') || message.includes('购买')) {
            return qaDatabase["如何购买周边"];
        } else if (message.includes('isui') || message.includes('倚水')) {
            return qaDatabase["isui是谁"];
        } else if (message.includes('raku')) {
            return qaDatabase["raku是谁"];
        } else if (message.includes('tazuneru') || message.includes('tazu')) {
            return qaDatabase["tazuneru是谁"];
        } else if (message.includes('风格') || message.includes('类型') || message.includes('style')) {
            return qaDatabase["音乐风格"];
        } else if (message.includes('粉丝') || message.includes('群') || message.includes('club')) {
            return qaDatabase["有粉丝群吗"];
        }

        // Return a random default response for unrecognized queries
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    // Event listeners
    // sendButton.addEventListener('click', sendMessage);

    // chatInput.addEventListener('keypress', (e) => {
    //     if (e.key === 'Enter') {
    //         sendMessage();
    //     }
    // });
}
