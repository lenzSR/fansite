// Language switcher functionality for Tayori Fan Site

// Initialize language settings
document.addEventListener('DOMContentLoaded', () => {
    // Get saved language or default to Chinese
    const currentLang = localStorage.getItem('tayori-language') || 'zh';

    // Apply the language
    applyLanguage(currentLang);

    // Initialize language switcher
    initLanguageSwitcher();
});

// Initialize language switcher UI and functionality
function initLanguageSwitcher() {
    // Create language switcher element if it doesn't exist
    if (!document.getElementById('language-switcher')) {
        const header = document.querySelector('header .flex.items-center');

        if (header) {
            // Create language switcher container
            const langSwitcher = document.createElement('div');
            langSwitcher.id = 'language-switcher';
            langSwitcher.className = 'ml-4 relative';

            // Create language button
            const langButton = document.createElement('button');
            langButton.id = 'language-button';
            langButton.className = 'flex items-center text-sm font-medium text-tayori-text hover:text-tayori-accent transition-colors';
            langButton.innerHTML = `
                <i data-lucide="globe" class="mr-1 w-4 h-4"></i>
                <span id="current-language-text">${translations[getCurrentLanguage()].language_switch}</span>
            `;

            // Create language dropdown
            const langDropdown = document.createElement('div');
            langDropdown.id = 'language-dropdown';
            langDropdown.className = 'absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50 hidden';
            langDropdown.innerHTML = `
                <a href="#" data-lang="zh" class="block px-4 py-2 text-sm text-tayori-text hover:bg-tayori-gray hover:text-tayori-accent">
                    ${translations[getCurrentLanguage()].language_zh}
                </a>
                <a href="#" data-lang="ja" class="block px-4 py-2 text-sm text-tayori-text hover:bg-tayori-gray hover:text-tayori-accent">
                    ${translations[getCurrentLanguage()].language_ja}
                </a>
            `;

            // Append elements
            langSwitcher.appendChild(langButton);
            langSwitcher.appendChild(langDropdown);
            header.appendChild(langSwitcher);

            // Initialize Lucide icons for the new elements
            lucide.createIcons();

            // Add event listeners
            langButton.addEventListener('click', toggleLanguageDropdown);

            // Add event listeners to language options
            const langOptions = langDropdown.querySelectorAll('[data-lang]');
            langOptions.forEach(option => {
                option.addEventListener('click', (e) => {
                    e.preventDefault();
                    const lang = e.currentTarget.getAttribute('data-lang');
                    switchLanguage(lang);
                    toggleLanguageDropdown();
                });
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!langSwitcher.contains(e.target)) {
                    langDropdown.classList.add('hidden');
                }
            });
        }
    }
}

// Toggle language dropdown visibility
function toggleLanguageDropdown() {
    const dropdown = document.getElementById('language-dropdown');
    dropdown.classList.toggle('hidden');
}

// Get current language
function getCurrentLanguage() {
    return localStorage.getItem('tayori-language') || 'zh';
}

// Switch language
function switchLanguage(lang) {
    // Save language preference
    localStorage.setItem('tayori-language', lang);

    // Apply the language
    applyLanguage(lang);
}

// Apply language to all elements
function applyLanguage(lang) {
    // Set HTML lang attribute
    document.documentElement.setAttribute('lang', lang);

    // Update all translatable elements
    updateNavigationText(lang);
    updateSectionTitles(lang);
    updateHeroSection(lang);
    updateAboutSection(lang);
    updateMembersSection(lang);
    updateMusicSection(lang);
    updateChatSection(lang);
    updateMessageSection(lang);
    updateConnectSection(lang);
    updateFooter(lang);

    // Update language switcher text if it exists
    const langSwitcherText = document.getElementById('current-language-text');
    if (langSwitcherText) {
        langSwitcherText.textContent = translations[lang].language_switch;
    }

    // Update language dropdown options if they exist
    const zhOption = document.querySelector('[data-lang="zh"]');
    const jaOption = document.querySelector('[data-lang="ja"]');

    if (zhOption) zhOption.textContent = translations[lang].language_zh;
    if (jaOption) jaOption.textContent = translations[lang].language_ja;
}

// Update navigation text
function updateNavigationText(lang) {
    // Desktop navigation
    const desktopNavLinks = document.querySelectorAll('nav.hidden.md\\:flex a');
    if (desktopNavLinks.length > 0) {
        desktopNavLinks[0].textContent = translations[lang].nav_about;
        desktopNavLinks[1].textContent = translations[lang].nav_members;
        desktopNavLinks[2].textContent = translations[lang].nav_music;
        desktopNavLinks[3].textContent = translations[lang].nav_chat;
        desktopNavLinks[4].textContent = translations[lang].nav_message;
        desktopNavLinks[5].textContent = translations[lang].nav_connect;
    }

    // Mobile navigation
    const mobileNavLinks = document.querySelectorAll('#mobile-menu a');
    if (mobileNavLinks.length > 0) {
        mobileNavLinks[0].textContent = translations[lang].nav_about;
        mobileNavLinks[1].textContent = translations[lang].nav_members;
        mobileNavLinks[2].textContent = translations[lang].nav_music;
        mobileNavLinks[3].textContent = translations[lang].nav_chat;
        mobileNavLinks[4].textContent = translations[lang].nav_connect;
    }
}

// Update section titles
function updateSectionTitles(lang) {
    // Find all section title elements
    const sectionTitles = document.querySelectorAll('p.text-base.text-tayori-accent.font-semibold.tracking-wide.uppercase');

    // Map each section to its translation key
    sectionTitles.forEach(title => {
        const section = title.closest('section');
        if (!section) return;

        const sectionId = section.id;

        switch (sectionId) {
            case 'about':
                title.textContent = translations[lang].about_section_title;
                break;
            case 'members':
                title.textContent = translations[lang].members_section_title;
                break;
            case 'music':
                title.textContent = translations[lang].music_section_title;
                break;
            case 'chat':
                title.textContent = translations[lang].chat_section_title;
                break;
            case 'message':
                title.textContent = translations[lang].message_section_title;
                break;
            case 'connect':
                title.textContent = translations[lang].connect_section_title;
                break;
        }
    });
}

// Update hero section
function updateHeroSection(lang) {
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroDescription = document.querySelector('.hero-description');
    const heroButton = document.querySelector('.hero-button span');

    if (heroSubtitle) heroSubtitle.textContent = translations[lang].hero_subtitle;
    if (heroDescription) heroDescription.textContent = translations[lang].hero_description;
    if (heroButton) heroButton.textContent = translations[lang].hero_button;
}

// Update about section
function updateAboutSection(lang) {
    const aboutHeading = document.querySelector('#about h2');
    const aboutParagraphs = document.querySelectorAll('#about .mt-10.lg\\:mt-0.space-y-6 p');

    if (aboutHeading) aboutHeading.textContent = translations[lang].about_heading;

    if (aboutParagraphs.length >= 3) {
        aboutParagraphs[0].innerHTML = translations[lang].about_p1;
        aboutParagraphs[1].innerHTML = translations[lang].about_p2;
        aboutParagraphs[2].innerHTML = translations[lang].about_p3;
    }
}

// Update members section
function updateMembersSection(lang) {
    const membersHeading = document.querySelector('#members h2');

    if (membersHeading) membersHeading.textContent = translations[lang].members_heading;

    // Update isui info
    const isuiRole = document.querySelector('#members .card-hover:nth-child(1) .text-tayori-accent.mb-4 span');
    const isuiTagline = document.querySelector('#members .card-hover:nth-child(1) .text-tayori-text.mb-4');
    const isuiDesc = document.querySelector('#members .card-hover:nth-child(1) .text-tayori-text:last-child');

    if (isuiRole) isuiRole.textContent = translations[lang].member_isui_role;
    if (isuiTagline) isuiTagline.innerHTML = translations[lang].member_isui_tagline;
    if (isuiDesc) isuiDesc.textContent = translations[lang].member_isui_desc;

    // Update raku info
    const rakuRole = document.querySelector('#members .card-hover:nth-child(2) .text-tayori-accent.mb-4 span');
    const rakuTagline = document.querySelector('#members .card-hover:nth-child(2) .text-tayori-text.mb-4');
    const rakuDesc = document.querySelector('#members .card-hover:nth-child(2) .text-tayori-text:last-child');

    if (rakuRole) rakuRole.textContent = translations[lang].member_raku_role;
    if (rakuTagline) rakuTagline.innerHTML = translations[lang].member_raku_tagline;
    if (rakuDesc) rakuDesc.textContent = translations[lang].member_raku_desc;

    // Update tazuneru info
    const tazuneruRole = document.querySelector('#members .card-hover:nth-child(3) .text-tayori-accent.mb-4 span');
    const tazuneruTagline = document.querySelector('#members .card-hover:nth-child(3) .text-tayori-text.mb-4');
    const tazuneruDesc = document.querySelector('#members .card-hover:nth-child(3) .text-tayori-text:last-child');

    if (tazuneruRole) tazuneruRole.textContent = translations[lang].member_tazuneru_role;
    if (tazuneruTagline) tazuneruTagline.innerHTML = translations[lang].member_tazuneru_tagline;
    if (tazuneruDesc) tazuneruDesc.textContent = translations[lang].member_tazuneru_desc;
}

// Update music section
function updateMusicSection(lang) {
    const musicHeading = document.querySelector('#music h2');
    const musicMoreLink = document.querySelector('#music .text-center.mt-12 a');
    const musicVideoLabels = document.querySelectorAll('#music .text-xs.text-tayori-text.font-medium');

    if (musicHeading) musicHeading.textContent = translations[lang].music_heading;
    if (musicMoreLink) musicMoreLink.textContent = translations[lang].music_more;

    // Update music type labels
    if (musicVideoLabels.length > 0) {
        musicVideoLabels.forEach(label => {
            if (label.textContent.trim() === '音乐视频' || label.textContent.trim() === 'ミュージックビデオ') {
                label.textContent = translations[lang].music_video;
            } else if (label.textContent.trim() === '专辑单曲' || label.textContent.trim() === 'アルバムシングル') {
                label.textContent = translations[lang].music_single;
            }
        });
    }
}

// Update chat section
function updateChatSection(lang) {
    const chatHeading = document.querySelector('#chat h2');
    const chatDescription = document.querySelector('#chat .text-base.text-tayori-text.mt-6');
    const chatPlaceholder = document.querySelector('#chat-input');
    const chatHelp = document.querySelector('#chat .text-xs.text-tayori-text\\/70.mt-2.ml-1');

    if (chatHeading) chatHeading.textContent = translations[lang].chat_heading;
    if (chatDescription) chatDescription.textContent = translations[lang].chat_description;
    if (chatPlaceholder) chatPlaceholder.setAttribute('placeholder', translations[lang].chat_placeholder);
    if (chatHelp) chatHelp.textContent = translations[lang].chat_help;
}

// Update message section
function updateMessageSection(lang) {
    const messageHeading = document.querySelector('#message h2');
    const leaveComment = document.querySelector('#add-comment-form h3');
    const welcomeText = document.querySelector('#welcome-message-container .text-sm.text-gray-600');
    const usernameLabel = document.querySelector('label[for="username-input"]');
    const usernameInput = document.querySelector('#username-input');
    const messagePlaceholder = document.querySelector('#message-input');
    const sendHint = document.querySelector('#add-comment-form .flex.items-center.justify-between.mt-2.text-xs.text-gray-500 div');
    const commentsCount = document.querySelector('#comments-count');

    if (messageHeading) messageHeading.textContent = translations[lang].message_heading;
    if (leaveComment) leaveComment.textContent = translations[lang].message_leave_comment;

    if (welcomeText) {
        const username = localStorage.getItem('tayori-username') || 'User';
        welcomeText.innerHTML = translations[lang].message_welcome + ' <span class="font-medium" id="username-display">' + username + '</span>';
    }

    if (usernameLabel) usernameLabel.textContent = translations[lang].message_username_prompt;
    if (usernameInput) usernameInput.setAttribute('placeholder', translations[lang].message_username_placeholder);
    if (messagePlaceholder) messagePlaceholder.setAttribute('placeholder', translations[lang].message_placeholder);
    if (sendHint) sendHint.textContent = translations[lang].message_send_hint;

    if (commentsCount) {
        const count = commentsCount.textContent.split(' ')[0];
        commentsCount.textContent = `${count} ${translations[lang].message_count}`;
    }
}

// Update connect section
function updateConnectSection(lang) {
    const connectHeading = document.querySelector('#connect h2');
    const connectLinks = document.querySelectorAll('#connect .card-hover h3');

    if (connectHeading) connectHeading.textContent = translations[lang].connect_heading;

    if (connectLinks.length >= 4) {
        // Website
        if (connectLinks[0].textContent.trim() === '官方网站' || connectLinks[0].textContent.trim() === '公式サイト') {
            connectLinks[0].textContent = translations[lang].connect_website;
        }

        // Bilibili
        if (connectLinks[2].textContent.trim() === '哔哩哔哩' || connectLinks[2].textContent.trim() === 'ビリビリ') {
            connectLinks[2].textContent = translations[lang].connect_bilibili;
        }

        // NetEase Music
        if (connectLinks[3].textContent.trim() === '网易云音乐' || connectLinks[3].textContent.trim() === 'NetEase Music') {
            connectLinks[3].textContent = translations[lang].connect_music;
        }
    }
}

// Update footer
function updateFooter(lang) {
    const footerCopyright = document.querySelector('footer .mb-4.md\\:mb-0 p');
    const footerCredit = document.querySelector('footer div:last-child p');

    if (footerCopyright) footerCopyright.textContent = translations[lang].footer_copyright;
    if (footerCredit) footerCredit.textContent = translations[lang].footer_credit;
}

// Update chat responses based on language
function getLocalizedChatResponse(message, lang) {
    message = message.toLowerCase();
    const responses = chatResponses[lang];

    // Check if we have a direct match
    for (const [question, answer] of Object.entries(responses)) {
        if (question !== 'defaultResponses' && message.includes(question.toLowerCase())) {
            return answer;
        }
    }

    // Check for keyword matches based on language
    if (lang === 'zh') {
        if (message.includes('名字') || message.includes('含义') || message.includes('寓意')) {
            return responses["tayori的名字有什么特殊含义吗?"];
        } else if (message.includes('成立') || message.includes('什么时候') || message.includes('历史')) {
            return responses["乐队是什么时候成立的?"];
        } else if (message.includes('角色') || message.includes('职责') || message.includes('做什么')) {
            return responses["成员们各自的角色是什么?"];
        } else if (message.includes('听') || message.includes('歌') || message.includes('音乐') || message.includes('作品')) {
            return responses["在哪里可以听到tayori的歌?"];
        } else if (message.includes('演出') || message.includes('表演') || message.includes('live') || message.includes('演唱会')) {
            return responses["tayori参加过哪些演出?"];
        } else if (message.includes('周边') || message.includes('商品') || message.includes('购买')) {
            return responses["如何购买周边"];
        } else if (message.includes('isui') || message.includes('倚水')) {
            return responses["isui是谁"];
        } else if (message.includes('raku')) {
            return responses["raku是谁"];
        } else if (message.includes('tazuneru') || message.includes('tazu')) {
            return responses["tazuneru是谁"];
        } else if (message.includes('风格') || message.includes('类型') || message.includes('style')) {
            return responses["音乐风格"];
        } else if (message.includes('粉丝') || message.includes('群') || message.includes('club')) {
            return responses["有粉丝群吗"];
        }
    } else if (lang === 'ja') {
        if (message.includes('名前') || message.includes('意味') || message.includes('意義')) {
            return responses["tayoriの名前に特別な意味はありますか?"];
        } else if (message.includes('結成') || message.includes('いつ') || message.includes('歴史')) {
            return responses["バンドはいつ結成されましたか?"];
        } else if (message.includes('役割') || message.includes('担当') || message.includes('何をする')) {
            return responses["メンバーの役割は何ですか?"];
        } else if (message.includes('聴く') || message.includes('曲') || message.includes('音楽') || message.includes('作品')) {
            return responses["どこでtayoriの曲が聴けますか?"];
        } else if (message.includes('ライブ') || message.includes('公演') || message.includes('コンサート')) {
            return responses["tayoriはどんなライブに参加していますか?"];
        } else if (message.includes('グッズ') || message.includes('商品') || message.includes('購入')) {
            return responses["グッズの購入方法"];
        } else if (message.includes('isui') || message.includes('倚水')) {
            return responses["isuiとは誰ですか"];
        } else if (message.includes('raku')) {
            return responses["rakuとは誰ですか"];
        } else if (message.includes('tazuneru') || message.includes('tazu')) {
            return responses["tazuneruとは誰ですか"];
        } else if (message.includes('スタイル') || message.includes('タイプ') || message.includes('style')) {
            return responses["音楽スタイル"];
        } else if (message.includes('ファン') || message.includes('クラブ') || message.includes('club')) {
            return responses["ファンクラブはありますか"];
        }
    }

    // Return a random default response for unrecognized queries
    const defaultResponses = responses.defaultResponses;
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Override the original getResponse function in script.js
if (typeof window.originalGetResponse === 'undefined' && typeof getResponse === 'function') {
    window.originalGetResponse = getResponse;

    // Replace with our language-aware version
    window.getResponse = function(message) {
        const currentLang = getCurrentLanguage();
        return getLocalizedChatResponse(message, currentLang);
    };
}
