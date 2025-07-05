// UI管理和背景控制类
export class UIManager {
    constructor() {
        // 背景图片
        this.backgroundImages = [
            'pic/back (1).png',
            'pic/back (2).png',
            'pic/back (3).png',
            'pic/back (4).png',
            'pic/back (5).png',
            'pic/back (6).png',
            'pic/back (7).png'
        ];
        this.currentBackground = 0;
        
        // DOM 元素
        this.gameBoard = document.querySelector('.game-board');
        this.scoreElement = document.getElementById('score');
        this.bestScoreElement = document.getElementById('best-score');
        this.gameOverElement = document.getElementById('game-over');
        this.finalScoreElement = document.getElementById('final-score');
        this.newGameButton = document.getElementById('new-game');
        this.retryButton = document.getElementById('retry');
        this.backgroundContainer = document.querySelector('.background-container');
        this.backgroundOptions = document.querySelector('.background-options');
        this.gameTitle = document.getElementById('game-title');
        this.backgroundModal = document.getElementById('background-modal');
        this.closeModalButton = document.querySelector('.close-modal');
        
        // 触摸事件变量
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
    }

    // 初始化UI
    initializeUI() {
        // 清空游戏板
        this.gameBoard.innerHTML = '';
        
        // 创建初始网格
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.id = `tile-${i}-${j}`;
                this.gameBoard.appendChild(tile);
            }
        }
        
        // 隐藏游戏结束界面
        this.gameOverElement.style.display = 'none';
        
        // 添加游戏板出现动画
        this.gameBoard.classList.add('fadeIn');
        setTimeout(() => {
            this.gameBoard.classList.remove('fadeIn');
        }, 500);
    }

    // 初始化背景选择器
    initializeBackgroundSelector() {
        // 清空背景选项
        this.backgroundOptions.innerHTML = '';
        
        // 创建背景选项
        this.backgroundImages.forEach((bgImage, index) => {
            const option = document.createElement('div');
            option.className = 'background-option';
            if (index === this.currentBackground) {
                option.classList.add('active');
            }
            
            const img = document.createElement('img');
            img.src = bgImage;
            img.alt = `背景 ${index + 1}`;
            
            option.appendChild(img);
            option.addEventListener('click', () => {
                this.setBackground(index);
                this.closeBackgroundModal();
            });
            
            this.backgroundOptions.appendChild(option);
        });
        
        // 设置初始背景
        this.loadSavedBackground();
        
        // 添加标题点击事件
        this.gameTitle.addEventListener('click', () => this.openBackgroundModal());
        
        // 添加关闭按钮事件
        this.closeModalButton.addEventListener('click', () => this.closeBackgroundModal());
        
        // 点击模态框外部关闭
        window.addEventListener('click', (event) => {
            if (event.target === this.backgroundModal) {
                this.closeBackgroundModal();
            }
        });
        
        // 为所有按钮添加点击效果
        this.addButtonEffects();
    }

    // 为所有按钮添加点击效果
    addButtonEffects() {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('mousedown', () => {
                button.classList.add('clicked');
            });
            
            button.addEventListener('mouseup', () => {
                button.classList.remove('clicked');
            });
            
            button.addEventListener('mouseleave', () => {
                button.classList.remove('clicked');
            });
        });
    }

    // 打开背景选择模态框
    openBackgroundModal() {
        this.backgroundModal.style.display = 'flex';
        // 添加淡入动画
        setTimeout(() => {
            this.backgroundModal.classList.add('show');
        }, 10);
    }

    // 关闭背景选择模态框
    closeBackgroundModal() {
        this.backgroundModal.classList.remove('show');
        // 等待动画完成后隐藏
        setTimeout(() => {
            this.backgroundModal.style.display = 'none';
        }, 300);
    }

    // 设置背景
    setBackground(index) {
        // 更新当前背景索引
        this.currentBackground = index;
        
        // 更新背景图片
        this.backgroundContainer.style.backgroundImage = `url('${this.backgroundImages[index]}')`;
        
        // 更新活动状态
        const options = document.querySelectorAll('.background-option');
        options.forEach((option, i) => {
            if (i === index) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
        
        // 保存背景选择
        localStorage.setItem('background2048', index);
    }

    // 加载保存的背景
    loadSavedBackground() {
        const savedBackground = localStorage.getItem('background2048');
        if (savedBackground !== null) {
            this.currentBackground = parseInt(savedBackground);
        }
        
        // 设置背景
        this.backgroundContainer.style.backgroundImage = `url('${this.backgroundImages[this.currentBackground]}')`;
        
        // 更新活动状态
        const options = document.querySelectorAll('.background-option');
        if (options.length > 0) {
            options.forEach((option, i) => {
                if (i === this.currentBackground) {
                    option.classList.add('active');
                } else {
                    option.classList.remove('active');
                }
            });
        }
    }

    // 更新UI
    updateUI(grid) {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const tile = document.getElementById(`tile-${i}-${j}`);
                const value = grid[i][j];
                
                // 更新方块的内容和样式
                tile.textContent = value !== 0 ? value : '';
                tile.className = 'tile';
                
                if (value !== 0) {
                    tile.classList.add(`tile-${value}`);
                }
            }
        }
    }

    // 更新分数
    updateScore(score, bestScore) {
        const oldScore = parseInt(this.scoreElement.textContent);
        this.scoreElement.textContent = score;
        
        // 添加分数变化动画
        if (score > oldScore) {
            this.scoreElement.classList.add('score-change');
            setTimeout(() => {
                this.scoreElement.classList.remove('score-change');
            }, 600);
        }
        
        this.bestScoreElement.textContent = bestScore;
    }

    // 显示最高分更新动画
    showBestScoreUpdate() {
        this.bestScoreElement.classList.add('score-change');
        setTimeout(() => {
            this.bestScoreElement.classList.remove('score-change');
        }, 600);
    }

    // 显示新方块动画
    showNewTileAnimation(position) {
        setTimeout(() => {
            const tile = document.getElementById(`tile-${position.row}-${position.col}`);
            if (tile) {
                tile.classList.add('tile-new');
                setTimeout(() => {
                    tile.classList.remove('tile-new');
                }, 200);
            }
        }, 10);
    }

    // 显示合并动画
    showMergeAnimation(mergedTiles) {
        mergedTiles.forEach(position => {
            setTimeout(() => {
                const tile = document.getElementById(`tile-${position.row}-${position.col}`);
                if (tile) {
                    tile.classList.add('tile-merged');
                    setTimeout(() => {
                        tile.classList.remove('tile-merged');
                    }, 300);
                }
            }, 10);
        });
    }

    // 显示无效移动动画
    showInvalidMoveAnimation() {
        this.gameBoard.classList.add('shake');
        setTimeout(() => {
            this.gameBoard.classList.remove('shake');
        }, 500);
    }

    // 显示游戏结束界面
    showGameOver(finalScore) {
        setTimeout(() => {
            this.gameOverElement.style.display = 'flex';
            this.finalScoreElement.textContent = finalScore;
        }, 500);
    }

    // 检查背景模态框是否打开
    isBackgroundModalOpen() {
        return this.backgroundModal.style.display === 'flex';
    }

    // 设置触摸事件监听器
    setupTouchEvents(onSwipe) {
        document.addEventListener('touchstart', (event) => {
            this.touchStartX = event.touches[0].clientX;
            this.touchStartY = event.touches[0].clientY;
        });

        document.addEventListener('touchmove', (event) => {
            this.touchEndX = event.touches[0].clientX;
            this.touchEndY = event.touches[0].clientY;
        });

        document.addEventListener('touchend', () => {
            // 如果背景选择模态框打开，则不处理游戏操作
            if (this.isBackgroundModalOpen()) return;
            
            const deltaX = this.touchEndX - this.touchStartX;
            const deltaY = this.touchEndY - this.touchStartY;
            
            // 最小滑动距离，防止误触
            const minSwipeDistance = 30;
            
            let direction = null;
            
            // 检测滑动方向
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
                // 水平滑动
                direction = deltaX > 0 ? 'right' : 'left';
            } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > minSwipeDistance) {
                // 垂直滑动
                direction = deltaY > 0 ? 'down' : 'up';
            }
            
            if (direction) {
                onSwipe(direction);
            }
        });
    }
}
