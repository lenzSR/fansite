document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const messageSection = document.getElementById('message');
    const commentsContainer = messageSection.querySelector('.comments-container');
    // commentsHeader is not in the HTML, removing reference
    const commentsList = document.getElementById('comments-list');
    const commentsWrapper = commentsList.querySelector('.comments-wrapper');
    const commentsCount = document.getElementById('comments-count');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-message-btn');
    const commentForm = document.getElementById('comment-form');
    const quotedComment = document.getElementById('quoted-comment');
    const quotedText = document.getElementById('quoted-text');
    const cancelQuoteButton = document.getElementById('cancel-quote');

    // Username related elements
    const usernameInput = document.getElementById('username-input');
    const saveUsernameBtn = document.getElementById('save-username-btn');
    const usernameInputContainer = document.getElementById('username-input-container');
    const welcomeMessageContainer = document.getElementById('welcome-message-container');
    const usernameDisplay = document.getElementById('username-display');
    const logoutBtn = document.getElementById('logout-btn');

    // Sample comments data - in a real app, this would come from a database
    const commentsData = [
        {
            id: 1,
            author: "楚雨荨 Lau",
            date: "April 18, 2025",
            content: "是Kotlin，这才是真正的MCP！",
            replies: []
        },
        {
            id: 2,
            author: "An*l",
            date: "April 18, 2025",
            content: "博主，你觉得Java和Kotlin哪个更好用？",
            replies: [
                {
                    id: 3,
                    author: "Lenz",
                    date: "April 18, 2025",
                    content: "我觉得Idea + Coplilot更好用。"
                }
            ]
        },
        {
            id: 4,
            author: "Sarah",
            date: "April 17, 2025",
            content: "我最近开始学习Android开发，感觉有些困难，有什么好的学习资源推荐吗？",
            replies: []
        },
        {
            id: 5,
            author: "Michael",
            date: "April 17, 2025",
            content: "我一直在使用Flutter进行跨平台开发，你觉得与原生开发相比怎么样？",
            replies: []
        },
        {
            id: 6,
            author: "李明",
            date: "April 16, 2025",
            content: "你能分享一下你平时的编程工作流程吗？用什么工具和环境？",
            replies: []
        }
    ];

    // Keep track of scroll state
    let isSpecialScrollMode = false;
    let isHoveringComments = false;
    let commentsContainerRect = null;

    // Store initial state
    function captureInitialState() {
        // Get the container dimensions only
        if (commentsContainer) {
            commentsContainerRect = commentsContainer.getBoundingClientRect();
        }
    }

    // Handle mouse enter on comments container
    function handleMouseEnter(event) {
        isHoveringComments = true;

        // Only activate special scroll mode if we're actually hovering the comments container
        // (not just any child element)
        if (commentsContainer && (event.target === commentsContainer || commentsContainer.contains(event.target))) {
            activateSpecialScrollMode();
        }

        // Also activate when hovering the comments list directly
        if (commentsList && (event.target === commentsList || commentsList.contains(event.target))) {
            activateSpecialScrollMode();
        }
    }

    // Activate the special scroll mode
    function activateSpecialScrollMode() {
        if (isSpecialScrollMode) return;

        isSpecialScrollMode = true;

        // We don't need any special setup for scrolling anymore
        // as we're using native scrolling in the comments-wrapper
    }

    // Handle mouse leave from comments container
    function handleMouseLeave(event) {
        // Only deactivate if we're actually leaving the comments container
        // (not just moving between child elements)
        if (commentsContainer && !commentsContainer.contains(event.relatedTarget) &&
            (!commentsList || !commentsList.contains(event.relatedTarget))) {
            isHoveringComments = false;
            deactivateSpecialScrollMode();
        }
    }

    // Deactivate the special scroll mode
    function deactivateSpecialScrollMode() {
        if (!isSpecialScrollMode) return;

        isSpecialScrollMode = false;

        // No special cleanup needed as we're using native scrolling
    }

    // We no longer need special scroll setup as we're using native scrolling
    function setupSpecialScroll() {
        // This function is kept for backward compatibility
        // but doesn't do anything anymore
    }

    // We no longer need special scroll handling as we're using native scrolling
    function handleSpecialScroll(event) {
        // This function is kept for backward compatibility
        // but doesn't do anything anymore
    }

    // Handle reply button clicks
    function handleReplyClick(event) {
        const commentItem = event.currentTarget.closest('.comment-item');
        const commentText = commentItem.querySelector('p.text-sm').textContent;
        const authorName = commentItem.querySelector('h4').textContent;
        const id = commentItem.dataset.id;

        // Show the quoted comment
        quotedText.textContent = `${authorName}: ${commentText}`;
        quotedComment.classList.remove('hidden');
        quotedComment.style.display = 'flex';
        quotedComment.dataset.id = id;

        // Focus the input
        messageInput.focus();
    }

    // Handle cancel quote button
    function handleCancelQuote() {
        quotedComment.classList.add('hidden');
        quotedComment.style.display = 'none';
        quotedText.textContent = '';
    }

    // Handle sending a new message
    function handleSendMessage(event) {
        event.preventDefault();

        const message = messageInput.value.trim();
        if (!message) return;

        const now = new Date();
        const formattedDate = now.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Create new comment data
        const newComment = {
            id: Date.now(), // Use timestamp as ID
            author: document.getElementById('username-display').textContent || 'You',
            date: formattedDate,
            content: message,
            replies: []
        };

        // Handle quoted replies
        if (!quotedComment.classList.contains('hidden')) {
            const quotedContent = quotedText.textContent;
            if (quotedContent) {
                // Extract author from quoted text (format is "Author: Text")
                const parts = quotedContent.split(':');
                const author = parts[0];
                const content = quotedContent.substring(author.length + 1).trim();
                const id = quotedComment.dataset.id;

                // 根据id找出评论，将newComment添加到评论的replies中
                commentsData.find(comment => comment.id === parseInt(id, 10)).replies.push(newComment);
            }
        } else {
            // Add to comments data at the beginning
            commentsData.unshift(newComment);
        }

        // Save the scroll position
        const scrollTop = commentsWrapper.scrollTop;

        // Re-render all comments
        renderComments();

        // Clear input and quoted comment
        messageInput.value = '';
        handleCancelQuote();
    }

    // This function has been replaced by createCommentElement
    // Keeping a stub for backward compatibility
    function createNewComment(message) {
        console.warn('createNewComment is deprecated, use the data-driven approach instead');

        const now = new Date();
        const formattedDate = now.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Create new comment data
        const newComment = {
            id: Date.now(),
            author: document.getElementById('username-display').textContent || 'You',
            date: formattedDate,
            content: message,
            replies: []
        };

        // Return the element
        return createCommentElement(newComment);
    }

    // Keyboard handling for textarea
    function handleMessageInputKeydown(event) {
        // Send on Enter (but allow Shift+Enter for new line)
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage(event);
        }
    }

    function renderComments() {
        // 清空原有评论
        commentsWrapper.innerHTML = '';

        // 更新评论计数
        const totalComments = commentsData.length;
        commentsCount.textContent = `${totalComments} Comments`;

        commentsData.forEach((comment) => {
            const commentElement = createCommentElement(comment);

            // 添加统一的动画类
            commentElement.classList.add('slide-down-fade');

            commentElement.addEventListener('animationend', () => {
                commentElement.classList.remove('slide-down-fade');
            });

            commentsWrapper.appendChild(commentElement);
        });

        // 图标渲染
        lucide.createIcons();

        // 绑定回复按钮事件
        commentsWrapper.querySelectorAll('.reply-btn').forEach(button => {
            button.addEventListener('click', handleReplyClick);
        });

        // 执行模糊滚动动画
        requestAnimationFrame(handleScrollAnimations);
    }



    // Create a comment element from comment data
    function createCommentElement(comment) {
        // Create comment container
        const commentDiv = document.createElement('div');
        commentDiv.className = 'p-4 border border-gray-200 dark:border-gray-800 rounded-lg comment-item';
        commentDiv.dataset.id = comment.id;

        // Set initial visibility state
        commentDiv.dataset.visibility = 'entering';

        // Create comment header
        const header = document.createElement('div');
        header.className = 'flex justify-between items-start mb-2';

        // Create user info
        const userInfo = document.createElement('div');
        userInfo.className = 'flex items-center';
        userInfo.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 mr-3 flex items-center justify-center">
                <i data-lucide="user" class="w-4 h-4"></i>
            </div>
            <div>
                <h4 class="font-bold">${comment.author}</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400">${comment.date}</p>
            </div>
        `;

        // Create reply button
        const replyButton = document.createElement('button');
        replyButton.className = 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 reply-btn';
        replyButton.innerHTML = '<i data-lucide="reply" class="w-4 h-4"></i>';

        // Create comment text
        const commentText = document.createElement('p');
        commentText.className = 'text-sm';
        commentText.textContent = comment.content;

        // Assemble the comment
        header.appendChild(userInfo);
        header.appendChild(replyButton);
        commentDiv.appendChild(header);
        commentDiv.appendChild(commentText);

        // Add replies if any
        if (comment.replies && comment.replies.length > 0) {
            comment.replies.forEach((reply) => {
                const replyElement = createReplyElement(reply);
                commentDiv.appendChild(replyElement);
            });
        }

        return commentDiv;
    }

    // Create a reply element
    function createReplyElement(reply) {
        const replyDiv = document.createElement('div');
        replyDiv.className = 'mt-4 ml-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg';
        replyDiv.dataset.id = reply.id;

        // Set initial visibility state
        replyDiv.dataset.visibility = 'entering';

        // Create reply header
        const header = document.createElement('div');
        header.className = 'flex justify-between items-start mb-2';

        // Create user info
        const userInfo = document.createElement('div');
        userInfo.className = 'flex items-center';
        userInfo.innerHTML = `
            <div class="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 mr-2 flex items-center justify-center">
                <i data-lucide="user" class="w-3 h-3"></i>
            </div>
            <div>
                <h4 class="font-bold text-sm">${reply.author}</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400">${reply.date}</p>
            </div>
        `;

        // Create reply text
        const replyText = document.createElement('p');
        replyText.className = 'text-sm';
        replyText.textContent = reply.content;

        // Assemble the reply
        header.appendChild(userInfo);
        replyDiv.appendChild(header);
        replyDiv.appendChild(replyText);

        return replyDiv;
    }

    // Handle blur effects for comments based on visibility
    function handleScrollAnimations() {
        // Get all comment items and reply items
        const visibilityItems = commentsWrapper.querySelectorAll('.comment-item, .comment-item > div[data-id]');

        // Get the visible area of the comments wrapper
        const wrapperRect = commentsWrapper.getBoundingClientRect();
        const wrapperTop = wrapperRect.top;
        const wrapperBottom = wrapperRect.bottom;
        const wrapperHeight = wrapperRect.height;

        // Check each item's visibility
        visibilityItems.forEach(item => {
            const itemRect = item.getBoundingClientRect();
            const itemTop = itemRect.top;
            const itemBottom = itemRect.bottom;
            const itemHeight = itemRect.height;

            // Calculate visibility percentage (how much of the item is visible)
            let visibilityPercentage = 0;

            if (itemBottom <= wrapperTop || itemTop >= wrapperBottom) {
                // Item is completely outside the view
                visibilityPercentage = 0;
            } else if (itemTop >= wrapperTop && itemBottom <= wrapperBottom) {
                // Item is fully visible
                visibilityPercentage = 100;
            } else if (itemTop < wrapperTop && itemBottom > wrapperBottom) {
                // Item is partially visible (spans the entire view)
                visibilityPercentage = wrapperHeight / itemHeight * 100;
            } else if (itemTop < wrapperTop) {
                // Item is partially visible at the top
                visibilityPercentage = (itemBottom - wrapperTop) / itemHeight * 100;
            } else {
                // Item is partially visible at the bottom
                visibilityPercentage = (wrapperBottom - itemTop) / itemHeight * 100;
            }

            // Set visibility state based on percentage
            let visibilityState;

            if (visibilityPercentage === 0) {
                if (itemTop >= wrapperBottom) {
                    visibilityState = 'entering'; // Below the view, about to enter
                } else {
                    visibilityState = 'exiting'; // Above the view, has exited
                }
            } else if (visibilityPercentage < 30) {
                visibilityState = 'partial'; // Less than 30% visible
            } else if (visibilityPercentage < 80) {
                visibilityState = 'mostly-visible'; // Between 30% and 80% visible
            } else {
                visibilityState = 'fully-visible'; // More than 80% visible
            }

            // Update the visibility state if it has changed
            if (item.dataset.visibility !== visibilityState) {
                item.dataset.visibility = visibilityState;
            }
        });
    }

    // Function to handle scroll events (simplified - no infinite scroll)
    function handleCommentScroll() {
        if (!commentsWrapper) return;

        // Just update the animations when scrolling
        requestAnimationFrame(handleScrollAnimations);
    }

    // No longer needed - removed infinite scroll functionality

    // Username handling functions
    function saveUsername() {
        const username = usernameInput.value.trim();
        if (username) {
            // Save username to localStorage
            localStorage.setItem('tayori-username', username);

            // Update all username display elements
            updateUsernameDisplay(username);

            // Toggle visibility
            usernameInputContainer.classList.add('hidden');
            welcomeMessageContainer.classList.remove('hidden');
        }
    }

    // Update all instances of username display
    function updateUsernameDisplay(username) {
        // Update the usernameDisplay variable reference
        if (usernameDisplay) {
            usernameDisplay.textContent = username;
        }

        // Also update by ID to ensure all instances are updated
        const usernameDisplayElements = document.querySelectorAll('#username-display');
        usernameDisplayElements.forEach(element => {
            element.textContent = username;
        });
    }

    function handleLogout() {
        // Clear username from localStorage
        localStorage.removeItem('tayori-username');

        // Reset input field
        usernameInput.value = '';

        // Reset username display
        updateUsernameDisplay('User');

        // Toggle visibility
        welcomeMessageContainer.classList.add('hidden');
        usernameInputContainer.classList.remove('hidden');

        // Focus the input field
        setTimeout(() => {
            usernameInput.focus();
        }, 100);
    }

    function handleUsernameKeydown(event) {
        // Save on Enter key
        if (event.key === 'Enter') {
            event.preventDefault();
            saveUsername();
        }
    }

    function loadSavedUsername() {
        const savedUsername = localStorage.getItem('tayori-username');
        if (savedUsername) {
            // Update all username display elements
            updateUsernameDisplay(savedUsername);

            // Toggle visibility
            usernameInputContainer.classList.add('hidden');
            welcomeMessageContainer.classList.remove('hidden');
        } else {
            // Show input field
            usernameInputContainer.classList.remove('hidden');
            welcomeMessageContainer.classList.add('hidden');
        }
    }

    // Initialize everything
    function init() {
        captureInitialState();

        // Load saved username
        loadSavedUsername();

        // Event listeners for mouse enter/leave on the comments container
        if (commentsContainer) {
            commentsContainer.addEventListener('mouseenter', handleMouseEnter);
            commentsContainer.addEventListener('mouseleave', handleMouseLeave);

            // Add mousemove listener to track mouse position accurately
            commentsContainer.addEventListener('mousemove', function() {
                // Update hover state based on current mouse position
                isHoveringComments = true;
            });
        }

        // Also add event listeners to the comments list itself
        if (commentsList) {
            commentsList.addEventListener('mouseenter', handleMouseEnter);
            commentsList.addEventListener('mouseleave', handleMouseLeave);

            // Add mousemove listener to track mouse position accurately
            commentsList.addEventListener('mousemove', function() {
                // Update hover state based on current mouse position
                isHoveringComments = true;
            });
        }

        // Add scroll event listener to handle normal page scrolling
        window.addEventListener('scroll', function() {
            // We don't need to do anything special on scroll anymore
            // since we're not fixing the header to the top of the screen

            // However, we still want to activate/deactivate special mode
            // based on whether we're hovering over the comments section
            if (isHoveringComments && !isSpecialScrollMode) {
                activateSpecialScrollMode();
            } else if (!isHoveringComments && isSpecialScrollMode) {
                deactivateSpecialScrollMode();
            }
        });

        // Add scroll event listener to the comments wrapper for blur effects
        if (commentsWrapper) {
            commentsWrapper.addEventListener('scroll', function() {
                // Use requestAnimationFrame for smoother performance
                if (!this.scrollRAF) {
                    this.scrollRAF = requestAnimationFrame(() => {
                        handleScrollAnimations();
                        this.scrollRAF = null;
                    });
                }
            });

            // Also listen for wheel events to catch fast scrolling
            commentsWrapper.addEventListener('wheel', function(event) {
                // Immediately update blur effects on wheel events
                if (!this.wheelRAF) {
                    this.wheelRAF = requestAnimationFrame(() => {
                        handleScrollAnimations();
                        this.wheelRAF = null;
                    });
                }
            });
        }

        // Update blur effects when window is resized
        window.addEventListener('resize', function() {
            if (!this.resizeRAF) {
                this.resizeRAF = requestAnimationFrame(() => {
                    handleScrollAnimations();
                    this.resizeRAF = null;
                });
            }
        });

        // Render initial comments
        renderComments();

        // Apply initial blur effects immediately using requestAnimationFrame
        // This ensures blur effects are applied as soon as the DOM is ready
        requestAnimationFrame(() => {
            handleScrollAnimations();

            // Run it again after a short delay to ensure all items are processed
            setTimeout(() => {
                handleScrollAnimations();
            }, 100);
        });

        // Add event listeners only if elements exist
        if (cancelQuoteButton) {
            cancelQuoteButton.addEventListener('click', handleCancelQuote);
        }
        if (sendButton) {
            sendButton.addEventListener('click', handleSendMessage);
        }
        if (commentForm) {
            commentForm.addEventListener('submit', handleSendMessage);
        }
        if (messageInput) {
            messageInput.addEventListener('keydown', handleMessageInputKeydown);
        }

        // Username related event listeners
        if (saveUsernameBtn) {
            saveUsernameBtn.addEventListener('click', saveUsername);
        }
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
        if (usernameInput) {
            usernameInput.addEventListener('keydown', handleUsernameKeydown);
        }
    }



    // Start everything
    init();
});
