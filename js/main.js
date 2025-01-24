document.addEventListener('DOMContentLoaded', function() {
    // 语言切换功能
    const languageButtons = document.querySelectorAll('.language-switch button');
    languageButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 切换语言逻辑
            const language = this.textContent;
            console.log(`切换到${language}`);
        });
    });

    // Web3钱包连接
    async function connectWallet() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts'
                });
                console.log('钱包已连接:', accounts[0]);
            } catch (error) {
                console.error('连接钱包失败:', error);
            }
        } else {
            console.log('请安装 MetaMask!');
        }
    }
});