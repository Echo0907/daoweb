// 等待页面加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化变量
    const header = document.querySelector('.main-header');
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    let isPlaying = false;

    // 移除加载动画
    setTimeout(() => {
        const loadingScreen = document.querySelector('.loading-screen');
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 2000);

    // 背景音乐控制
    musicToggle.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicToggle.innerHTML = '<i class="fas fa-music"></i>';
        } else {
            bgMusic.play();
            musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
        }
        isPlaying = !isPlaying;
    });

    // 滚动效果
    window.addEventListener('scroll', () => {
        // 导航栏背景变化
        if (window.scrollY > 50) {
            header.style.background = 'rgba(0, 0, 0, 0.95)';
        } else {
            header.style.background = 'rgba(0, 0, 0, 0.8)';
        }

        // 添加元素动画
        animateOnScroll();
    });

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 动态加载道长数据
    const masters = [
        {
            name: '张道长',
            title: '玄学大师',
            experience: 20,
            image: 'images/master1.jpg',
            specialties: ['八字', '紫微斗数', '符咒'],
            rating: 4.8,
            status: 'online'
        },
        // 可以添加更多道长数据
    ];

    // 渲染道长卡片
    function renderMasters() {
        const mastersGrid = document.querySelector('.masters-grid');
        masters.forEach(master => {
            const masterCard = createMasterCard(master);
            mastersGrid.appendChild(masterCard);
        });
    }

    // 创建道长卡片
    function createMasterCard(master) {
        const card = document.createElement('div');
        card.className = 'master-card animate__animated';
        card.innerHTML = `
            <div class="master-image">
                <img src="${master.image}" alt="${master.name}">
                <div class="status ${master.status}"></div>
            </div>
            <div class="master-info">
                <h3>${master.name}</h3>
                <p class="title">${master.title}</p>
                <p class="experience">从业${master.experience}年</p>
                <div class="specialties">
                    ${master.specialties.map(s => `<span>${s}</span>`).join('')}
                </div>
                <div class="rating">
                    <div class="stars">
                        ${generateStars(master.rating)}
                    </div>
                    <span class="rating-number">${master.rating}</span>
                </div>
                <button class="consult-button">
                    <i class="fas fa-comments"></i>
                    立即咨询
                </button>
            </div>
        `;
        return card;
    }

    // 生成星级评分
    function generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let starsHTML = '';
        
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        if (hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }
        
        return starsHTML;
    }

    // 滚动动画
    function animateOnScroll() {
        const elements = document.querySelectorAll(
            '.service-card, .master-card, .culture-card, .testimonial-card'
        );
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight - 100 && elementBottom > 0) {
                element.classList.add('animate__animated', 'animate__fadeInUp');
            }
        });
    }

    // Web3钱包连接
    const walletButton = document.querySelector('.wallet-connect');
    walletButton.addEventListener('click', async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts'
                });
                const shortAddress = `${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`;
                walletButton.innerHTML = `
                    <i class="fas fa-wallet"></i>
                    <span>${shortAddress}</span>
                `;
                walletButton.classList.add('connected');
            } catch (error) {
                console.error('连接钱包失败:', error);
                alert('连接钱包失败，请重试');
            }
        } else {
            alert('请安装 MetaMask!');
            window.open('https://metamask.io/download.html', '_blank');
        }
    });

    // 表单提交处理
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = '发送中...';

            try {
                // 这里添加表单提交逻辑
                await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟API请求
                alert('消息已发送，我们会尽快回复您！');
                contactForm.reset();
            } catch (error) {
                console.error('提交失败:', error);
                alert('发送失败，请重试');
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = '发送信息';
            }
        });
    }

    // 语言切换
    const languageButtons = document.querySelectorAll('.language-switch button');
    languageButtons.forEach(button => {
        button.addEventListener('click', function() {
            languageButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            // 这里添加语言切换逻辑
            const language = this.textContent;
            // 临时提示
            alert(`语言将切换为${language}（功能开发中）`);
        });
    });

    // 初始化
    renderMasters();
    animateOnScroll();
});

// 页面加载完成后的动画
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// 禁用右键菜单
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// 添加页面切换动画
window.addEventListener('beforeunload', () => {
    document.body.classList.add('page-transition');
});