document.addEventListener('DOMContentLoaded', function() {
    // 初始化变量
    const tabs = document.querySelectorAll('.tab');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const bookingButton = document.querySelector('.book-button');
    const bookingModal = document.getElementById('bookingModal');
    const closeModal = document.querySelector('.close-modal');
    const bookingForm = document.getElementById('bookingForm');
    const walletButton = document.querySelector('.wallet-connect');
    const languageButtons = document.querySelectorAll('.language-switch button');

    // 标签页切换
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 移除所有活动状态
            tabs.forEach(t => t.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // 添加当前活动状态
            tab.classList.add('active');
            const targetPane = document.getElementById(tab.dataset.tab);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });

    // 预约弹窗控制
    bookingButton.addEventListener('click', () => {
        if (!isWalletConnected) {
            alert('请先连接钱包');
            return;
        }
        bookingModal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        bookingModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === bookingModal) {
            bookingModal.style.display = 'none';
        }
    });

    // 预约表单处理
    let isWalletConnected = false;
    let userAddress = '';

    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!isWalletConnected) {
            alert('请先连接钱包');
            return;
        }

        const formData = new FormData(bookingForm);
        const bookingData = {
            name: formData.get('name'),
            birthdate: formData.get('birthdate'),
            birthtime: formData.get('birthtime'),
            phone: formData.get('phone'),
            service: formData.get('service'),
            walletAddress: userAddress
        };

        try {
            // 这里添加支付逻辑
            const amount = '0.1'; // ETH
            const weiAmount = ethers.utils.parseEther(amount);
            
            // 发送支付交易
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            
            // 替换为实际的合约地址
            const contractAddress = 'YOUR_CONTRACT_ADDRESS';
            
            const tx = await signer.sendTransaction({
                to: contractAddress,
                value: weiAmount
            });

            // 等待交易确认
            await tx.wait();

            // 发送预约信息到服务器
            // 这里添加实际的API调用
            console.log('预约信息：', bookingData);
            
            alert('预约成功！');
            bookingModal.style.display = 'none';
            bookingForm.reset();
        } catch (error) {
            console.error('预约失败：', error);
            alert('预约失败，请重试');
        }
    });

    // Web3钱包连接
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
                isWalletConnected = true;

                // 监听账户变化
                window.ethereum.on('accountsChanged', function (accounts) {
                    if (accounts.length === 0) {
                        // 用户断开了钱包
                        isWalletConnected = false;
                        walletButton.innerHTML = `
                            <i class="fas fa-wallet"></i>
                            <span>连接钱包</span>
                        `;
                    } else {
                        userAddress = accounts[0];
                        const shortAddress = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
                        walletButton.innerHTML = `
                            <i class="fas fa-wallet"></i>
                            <span>${shortAddress}</span>
                        `;
                    }
                });

            } catch (error) {
                console.error('连接钱包失败:', error);
                alert('连接钱包失败，请重试');
            }
        } else {
            alert('请安装 MetaMask!');
            window.open('https://metamask.io/download.html', '_blank');
        }
    });

    // 语言切换
    languageButtons.forEach(button => {
        button.addEventListener('click', function() {
            languageButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const language = this.textContent;
            if (language === 'EN') {
                translateToEnglish();
            } else {
                translateToChinese();
            }
        });
    });

    // 语言翻译函数
    function translateToEnglish() {
        const translations = {
            'service': {
                title: 'Our Services',
                items: [
                    'BaZi Fortune Telling: Analyze Life Destiny',
                    'Purple Star Astrology: Understand Fortune Changes',
                    'Talisman Creation: Resolve Fortune Obstacles'
                ]
            },
            'rules': {
                title: 'Service Rules',
                items: [
                    'Service will be arranged within 24 hours after payment',
                    'Appointments can be made one week in advance',
                    'Please cancel appointments 12 hours in advance'
                ]
            }
            // 添加更多翻译内容
        };

        // 更新页面文本
        updatePageContent(translations);
    }

    function translateToChinese() {
        const translations = {
            'service': {
                title: '道教服务内容',
                items: [
                    '八字算命：解析人生命运',
                    '紫微斗数：了解运势变化',
                    '符咒制作：化解运势阻碍'
                ]
            },
            'rules': {
                title: '服务规则',
                items: [
                    '预约付款后24小时内安排服务',
                    '可提前一周预约时段',
                    '如需取消预约请提前12小时'
                ]
            }
            // 添加更多翻译内容
        };

        // 更新页面文本
        updatePageContent(translations);
    }

    function updatePageContent(translations) {
        // 更新服务内容
        const servicePane = document.getElementById('service');
        if (servicePane) {
            servicePane.querySelector('h2').textContent = translations.service.title;
            const ul = servicePane.querySelector('ul');
            ul.innerHTML = translations.service.items.map(item => `<li>${item}</li>`).join('');
        }

        // 更新规则说明
        const rulesPane = document.getElementById('rules');
        if (rulesPane) {
            rulesPane.querySelector('h2').textContent = translations.rules.title;
            const ul = rulesPane.querySelector('ul');
            ul.innerHTML = translations.rules.items.map(item => `<li>${item}</li>`).join('');
        }
    }

    // 动态更新预约时间
    function updateNextAvailable() {
        const nextAvailableSpan = document.querySelector('.next-available');
        if (nextAvailableSpan) {
            const today = new Date();
            const nextDate = new Date(today);
            nextDate.setDate(today.getDate() + 1); // 设置为明天
            
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const dateString = nextDate.toLocaleDateString('zh-CN', options);
            nextAvailableSpan.textContent = `下一个可预约时段：${dateString}`;
        }
    }

    // 初始化
    updateNextAvailable();
});