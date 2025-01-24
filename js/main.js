document.addEventListener('DOMContentLoaded', function() {
    // 移除加载动画
    setTimeout(() => {
        document.querySelector('.loading-screen').style.display = 'none';
    }, 2000);

    // 导航栏滚动效果
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.background = 'rgba(0, 0, 0, 0.9)';
        } else {
            header.style.background = 'rgba(0, 0, 0, 0.8)';
        }
    });

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // 语言切换
    const languageButtons = document.querySelectorAll('.language-switch button');
    languageButtons.forEach(button => {
        button.addEventListener('click', function() {
            languageButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            // 这里添加语言切换逻辑
        });
    });

    // Web3钱包连接
    const walletButton = document.querySelector('.wallet-connect');
    walletButton.addEventListener('click', async function() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts'
                });
                walletButton.innerHTML = `
                    <i class="fas fa-wallet"></i>
                    <span>${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}</span>
                `;
            } catch (error) {
                console.error('连接钱包失败:', error);
            }
        } else {
            alert('请安装 MetaMask!');
        }
    });

    // 动态加载道长数据
    const mastersGrid = document.querySelector('.masters-grid');
    const masters = [
        {
            name: '张道长',
            image: 'images/master1.jpg',
            experience: 20,
            specialties: ['符咒', '风水', '算命'],
            rating: 4.8
        },
        // 可以添加更多道长数据
    ];

    // 添加动画效果
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.master-card, .service-card');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.classList.add('animate__animated', 'animate__fadeInUp');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
});