document.addEventListener('DOMContentLoaded', function() {
    // 初始化变量
    const tabs = document.querySelectorAll('.tab');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const bookingButton = document.querySelector('.book-button');
    const bookingModal = document.getElementById('bookingModal');
    const closeModal = document.querySelector('.close-modal');
    const bookingForm = document.getElementById('bookingForm');
    const walletButton = document.querySelector('.wallet-connect');
    
    // 添加水墨动画效果
    function addInkEffect(element) {
        const ink = document.createElement('div');
        ink.className = 'ink-effect';
        element.appendChild(ink);
        
        setTimeout(() => {
            ink.remove();
        }, 1000);
    }

    // 符咒装饰动画
    function animateTalismans() {
        const talismans = document.querySelectorAll('.talisman-decoration');
        talismans.forEach(talisman => {
            talisman.style.transform = `rotate(${Math.random() * 30 - 15}deg)`;
            talisman.style.opacity = (Math.random() * 0.03 + 0.01).toString();
        });
    }
    
    setInterval(animateTalismans, 5000);

    // 标签页切换
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 添加水墨效果
            addInkEffect(tab);
            
            // 移除所有活动状态
            tabs.forEach(t => t.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // 添加当前活动状态
            tab.classList.add('active');
            const targetPane = document.getElementById(tab.dataset.tab);
            if (targetPane) {
                targetPane.classList.add('active');
                targetPane.style.animation = 'fadeIn 0.5s ease-out';
            }
        });
    });

    // 更新时辰和排队信息
    function updateAvailability() {
        const now = new Date();
        const hours = now.getHours();
        let currentPeriod = '';
        let nextPeriod = '';
        
        // 计算当前和下一个时辰
        const periods = [
            { name: '子时', start: 23, end: 1 },
            { name: '丑时', start: 1, end: 3 },
            { name: '寅时', start: 3, end: 5 },
            { name: '卯时', start: 5, end: 7 },
            { name: '辰时', start: 7, end: 9 },
            { name: '巳时', start: 9, end: 11 },
            { name: '午时', start: 11, end: 13 },
            { name: '未时', start: 13, end: 15 },
            { name: '申时', start: 15, end: 17 },
            { name: '酉时', start: 17, end: 19 },
            { name: '戌时', start: 19, end: 21 },
            { name: '亥时', start: 21, end: 23 }
        ];

        for (let i = 0; i < periods.length; i++) {
            if ((hours >= periods[i].start && hours < periods[i].end) ||
                (periods[i].start > periods[i].end && (hours >= periods[i].start || hours < periods[i].end))) {
                currentPeriod = periods[i].name;
                nextPeriod = periods[(i + 1) % 12].name;
                break;
            }
        }

        // 更新显示
        const nextSlot = document.querySelector('.next-slot span');
        if (nextSlot) {
            nextSlot.textContent = `下一可预约时段：${nextPeriod}`;
        }

        // 随机更新排队人数（演示用）
        const queueInfo = document.querySelector('.queue-info span');
        if (queueInfo) {
            queueInfo.textContent = `当前排队：${Math.floor(Math.random() * 5 + 1)}人`;
        }
    }

    // 定期更新时辰信息
    setInterval(updateAvailability, 60000);
    updateAvailability();

    // Web3钱包连接
    let isWalletConnected = false;
    let userAddress = '';

    walletButton.addEventListener('click', async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts'
                });
                userAddress = accounts[0];
                const shortAddress = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
                walletButton.innerHTML = `
                    <i class="fas fa-wallet"></i>
                    <span>${shortAddress}</span>
                `;
                walletButton.classList.add('connected');
                isWalletConnected = true;

                // 添加连接成功的水墨效果
                addInkEffect(walletButton);

            } catch (error) {
                console.error('连接钱包失败:', error);
                alert('连接钱包失败，请重试');
            }
        } else {
            alert('请安装 MetaMask!');
            window.open('https://metamask.io/download.html', '_blank');
        }
    });

    // 预约表单处理
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!isWalletConnected) {
            alert('请先连接钱包');
            return;
        }

        const submitButton = bookingForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在提交...';

        try {
            const formData = new FormData(bookingForm);
            const bookingData = {
                name: formData.get('name'),
                birthdate: formData.get('birthdate'),
                birthtime: formData.get('birthtime'),
                service: formData.get('service'),
                phone: formData.get('phone'),
                walletAddress: userAddress
            };

            // 这里添加实际的支付和预约逻辑
            await new Promise(resolve => setTimeout(resolve, 2000)); // 模拟API请求

            alert('预约成功！道长将在约定时辰为您解惑。');
            bookingModal.style.display = 'none';
            bookingForm.reset();

        } catch (error) {
            console.error('预约失败：', error);
            alert('预约失败，请重试');
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = '确认预约';
        }
    });

    // 预约弹窗控制
    bookingButton.addEventListener('click', () => {
        if (!isWalletConnected) {
            alert('请先连接钱包');
            return;
        }
        bookingModal.style.display = 'block';
        addInkEffect(bookingModal.querySelector('.modal-content'));
    });

    closeModal.addEventListener('click', () => {
        bookingModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === bookingModal) {
            bookingModal.style.display = 'none';
        }
    });

    // 添加页面载入动画
    document.body.classList.add('loaded');

    // 添加滚动动画
    function revealOnScroll() {
        const elements = document.querySelectorAll('.service-item, .master-card');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight - 100 && elementBottom > 0) {
                element.classList.add('revealed');
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
});

// 添加水墨效果的样式
const style = document.createElement('style');
style.textContent = `
    .ink-effect {
        position: absolute;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 50%;
        transform: scale(0);
        animation: ink 1s ease-out;
        pointer-events: none;
    }

    @keyframes ink {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(4);
            opacity: 0;
        }
    }

    .revealed {
        animation: slideUp 0.6s ease-out forwards;
    }

    @keyframes slideUp {
        from {
            transform: translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
`;

document.head.appendChild(style);