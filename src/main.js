// 游戏主要变量
let grid = [];
let score = 0;
let bestScore = 0;
let isGameOver = false;
const GRID_SIZE = 4;
const EMPTY_CELL = 0;

// 背景图片
const backgroundImages = [
    'pic/back (1).png',
    'pic/back (2).png',
    'pic/back (3).png',
    'pic/back (4).png',
    'pic/back (5).png',
    'pic/back (6).png',
    'pic/back (7).png'
];
let currentBackground = 0;

// DOM 元素
const gameBoard = document.querySelector('.game-board');
const scoreElement = document.getElementById('score');
const bestScoreElement = document.getElementById('best-score');
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const newGameButton = document.getElementById('new-game');
const retryButton = document.getElementById('retry');
const backgroundContainer = document.querySelector('.background-container');
const backgroundOptions = document.querySelector('.background-options');
const gameTitle = document.getElementById('game-title');
const backgroundModal = document.getElementById('background-modal');
const closeModalButton = document.querySelector('.close-modal');

// 初始化游戏
function initializeGame() {
    // 重置游戏状态
    grid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(EMPTY_CELL));
    score = 0;
    isGameOver = false;
    
    // 更新UI
    updateScore();
    loadBestScore();
    
    // 清空游戏板
    gameBoard.innerHTML = '';
    
    // 创建初始网格
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.id = `tile-${i}-${j}`;
            gameBoard.appendChild(tile);
        }
    }
    
    // 隐藏游戏结束界面
    gameOverElement.style.display = 'none';
    
    // 生成两个初始方块
    generateNewTile();
    generateNewTile();
    
    // 更新UI
    updateUI();
    
    // 添加游戏板出现动画
    gameBoard.classList.add('fadeIn');
    setTimeout(() => {
        gameBoard.classList.remove('fadeIn');
    }, 500);
}

// 初始化背景选择器
function initializeBackgroundSelector() {
    // 清空背景选项
    backgroundOptions.innerHTML = '';
    
    // 创建背景选项
    backgroundImages.forEach((bgImage, index) => {
        const option = document.createElement('div');
        option.className = 'background-option';
        if (index === currentBackground) {
            option.classList.add('active');
        }
        
        const img = document.createElement('img');
        img.src = bgImage;
        img.alt = `背景 ${index + 1}`;
        
        option.appendChild(img);
        option.addEventListener('click', () => {
            setBackground(index);
            closeBackgroundModal();
        });
        
        backgroundOptions.appendChild(option);
    });
    
    // 设置初始背景
    loadSavedBackground();
    
    // 添加标题点击事件
    gameTitle.addEventListener('click', openBackgroundModal);
    
    // 添加关闭按钮事件
    closeModalButton.addEventListener('click', closeBackgroundModal);
    
    // 点击模态框外部关闭
    window.addEventListener('click', (event) => {
        if (event.target === backgroundModal) {
            closeBackgroundModal();
        }
    });
    
    // 为所有按钮添加点击效果
    addButtonEffects();
}

// 为所有按钮添加点击效果
function addButtonEffects() {
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
function openBackgroundModal() {
    backgroundModal.style.display = 'flex';
    // 添加淡入动画
    setTimeout(() => {
        backgroundModal.classList.add('show');
    }, 10);
}

// 关闭背景选择模态框
function closeBackgroundModal() {
    backgroundModal.classList.remove('show');
    // 等待动画完成后隐藏
    setTimeout(() => {
        backgroundModal.style.display = 'none';
    }, 300);
}

// 设置背景
function setBackground(index) {
    // 更新当前背景索引
    currentBackground = index;
    
    // 更新背景图片
    backgroundContainer.style.backgroundImage = `url('${backgroundImages[index]}')`;
    
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
function loadSavedBackground() {
    const savedBackground = localStorage.getItem('background2048');
    if (savedBackground !== null) {
        currentBackground = parseInt(savedBackground);
    }
    
    // 设置背景
    backgroundContainer.style.backgroundImage = `url('${backgroundImages[currentBackground]}')`;
    
    // 更新活动状态
    const options = document.querySelectorAll('.background-option');
    if (options.length > 0) {
        options.forEach((option, i) => {
            if (i === currentBackground) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }
}

// 生成一个新方块
function generateNewTile() {
    // 获取所有空位置
    const emptyCells = [];
    
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (grid[i][j] === EMPTY_CELL) {
                emptyCells.push({ row: i, col: j });
            }
        }
    }
    
    // 如果没有空位，则退出
    if (emptyCells.length === 0) return false;
    
    // 随机选择一个空位
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    
    // 90%的概率生成2，10%的概率生成4
    grid[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    
    // 标记为新生成的方块，用于动画
    setTimeout(() => {
        const tile = document.getElementById(`tile-${randomCell.row}-${randomCell.col}`);
        if (tile) {
            tile.classList.add('tile-new');
            setTimeout(() => {
                tile.classList.remove('tile-new');
            }, 200);
        }
    }, 10);
    
    return true;
}

// 更新UI
function updateUI() {
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            const tile = document.getElementById(`tile-${i}-${j}`);
            const value = grid[i][j];
            
            // 更新方块的内容和样式
            tile.textContent = value !== EMPTY_CELL ? value : '';
            tile.className = 'tile';
            
            if (value !== EMPTY_CELL) {
                tile.classList.add(`tile-${value}`);
            }
        }
    }
}

// 更新分数
function updateScore() {
    const oldScore = parseInt(scoreElement.textContent);
    scoreElement.textContent = score;
    
    // 添加分数变化动画
    if (score > oldScore) {
        scoreElement.classList.add('score-change');
        setTimeout(() => {
            scoreElement.classList.remove('score-change');
        }, 600);
    }
    
    if (score > bestScore) {
        bestScore = score;
        bestScoreElement.textContent = bestScore;
        saveBestScore();
        
        // 添加最高分变化动画
        bestScoreElement.classList.add('score-change');
        setTimeout(() => {
            bestScoreElement.classList.remove('score-change');
        }, 600);
    }
}

// 保存最高分
function saveBestScore() {
    localStorage.setItem('bestScore2048', bestScore);
}

// 加载最高分
function loadBestScore() {
    const savedScore = localStorage.getItem('bestScore2048');
    if (savedScore) {
        bestScore = parseInt(savedScore);
        bestScoreElement.textContent = bestScore;
    }
}

// 处理键盘事件
function handleKeyPress(event) {
    if (isGameOver) return;
    
    // 如果背景选择模态框打开，则不处理游戏操作
    if (backgroundModal.style.display === 'flex') return;
    
    let moved = false;
    
    switch (event.key) {
        case 'ArrowUp':
            moved = moveUp();
            break;
        case 'ArrowDown':
            moved = moveDown();
            break;
        case 'ArrowLeft':
            moved = moveLeft();
            break;
        case 'ArrowRight':
            moved = moveRight();
            break;
        case 'Escape':
            // ESC键关闭模态框
            closeBackgroundModal();
            return;
        default:
            return; // 如果不是方向键，直接返回
    }
    
    // 如果有有效移动，则生成新方块并更新UI
    if (moved) {
        generateNewTile();
        updateUI();
        updateScore();
        
        // 检查游戏是否结束
        if (!canMove()) {
            gameOver();
        }
    } else {
        // 无效移动时添加震动效果
        gameBoard.classList.add('shake');
        setTimeout(() => {
            gameBoard.classList.remove('shake');
        }, 500);
    }
}

// 向左移动
function moveLeft() {
    let moved = false;
    
    for (let i = 0; i < GRID_SIZE; i++) {
        const originalRow = [...grid[i]];
        const row = grid[i].filter(cell => cell !== EMPTY_CELL); // 去除空单元格
        
        // 合并相同的方块
        for (let j = 0; j < row.length - 1; j++) {
            if (row[j] === row[j + 1]) {
                row[j] *= 2;
                row[j + 1] = EMPTY_CELL;
                score += row[j]; // 增加分数
                
                // 标记合并的方块，用于动画
                setTimeout(() => {
                    const tile = document.getElementById(`tile-${i}-${j}`);
                    if (tile) {
                        tile.classList.add('tile-merged');
                        setTimeout(() => {
                            tile.classList.remove('tile-merged');
                        }, 300);
                    }
                }, 10);
                
                j++; // 跳过已合并的方块
            }
        }
        
        // 再次过滤掉空单元格并填充剩余空间
        const newRow = row.filter(cell => cell !== EMPTY_CELL);
        while (newRow.length < GRID_SIZE) {
            newRow.push(EMPTY_CELL);
        }
        
        // 更新网格
        grid[i] = newRow;
        
        // 检查是否有移动
        if (!moved && !arraysEqual(originalRow, newRow)) {
            moved = true;
        }
    }
    
    return moved;
}

// 向右移动
function moveRight() {
    let moved = false;
    
    for (let i = 0; i < GRID_SIZE; i++) {
        const originalRow = [...grid[i]];
        const row = grid[i].filter(cell => cell !== EMPTY_CELL); // 去除空单元格
        
        // 合并相同的方块
        for (let j = row.length - 1; j > 0; j--) {
            if (row[j] === row[j - 1]) {
                row[j] *= 2;
                row[j - 1] = EMPTY_CELL;
                score += row[j]; // 增加分数
                
                // 标记合并的方块，用于动画
                const finalJ = j;
                setTimeout(() => {
                    // 计算在网格中的实际位置
                    const actualJ = GRID_SIZE - row.filter(cell => cell !== EMPTY_CELL).length + finalJ;
                    const tile = document.getElementById(`tile-${i}-${actualJ}`);
                    if (tile) {
                        tile.classList.add('tile-merged');
                        setTimeout(() => {
                            tile.classList.remove('tile-merged');
                        }, 300);
                    }
                }, 10);
                
                j--; // 跳过已合并的方块
            }
        }
        
        // 再次过滤掉空单元格并填充剩余空间
        const newRow = row.filter(cell => cell !== EMPTY_CELL);
        while (newRow.length < GRID_SIZE) {
            newRow.unshift(EMPTY_CELL); // 在左侧添加空单元格
        }
        
        // 更新网格
        grid[i] = newRow;
        
        // 检查是否有移动
        if (!moved && !arraysEqual(originalRow, newRow)) {
            moved = true;
        }
    }
    
    return moved;
}

// 向上移动
function moveUp() {
    let moved = false;
    
    for (let j = 0; j < GRID_SIZE; j++) {
        // 构建当前列
        const originalCol = [];
        for (let i = 0; i < GRID_SIZE; i++) {
            originalCol.push(grid[i][j]);
        }
        
        const col = originalCol.filter(cell => cell !== EMPTY_CELL); // 去除空单元格
        
        // 合并相同的方块
        for (let i = 0; i < col.length - 1; i++) {
            if (col[i] === col[i + 1]) {
                col[i] *= 2;
                col[i + 1] = EMPTY_CELL;
                score += col[i]; // 增加分数
                
                // 标记合并的方块，用于动画
                const finalI = i;
                setTimeout(() => {
                    const tile = document.getElementById(`tile-${finalI}-${j}`);
                    if (tile) {
                        tile.classList.add('tile-merged');
                        setTimeout(() => {
                            tile.classList.remove('tile-merged');
                        }, 300);
                    }
                }, 10);
                
                i++; // 跳过已合并的方块
            }
        }
        
        // 再次过滤掉空单元格并填充剩余空间
        const newCol = col.filter(cell => cell !== EMPTY_CELL);
        while (newCol.length < GRID_SIZE) {
            newCol.push(EMPTY_CELL);
        }
        
        // 更新网格
        for (let i = 0; i < GRID_SIZE; i++) {
            grid[i][j] = newCol[i];
        }
        
        // 检查是否有移动
        if (!moved && !arraysEqual(originalCol, newCol)) {
            moved = true;
        }
    }
    
    return moved;
}

// 向下移动
function moveDown() {
    let moved = false;
    
    for (let j = 0; j < GRID_SIZE; j++) {
        // 构建当前列
        const originalCol = [];
        for (let i = 0; i < GRID_SIZE; i++) {
            originalCol.push(grid[i][j]);
        }
        
        const col = originalCol.filter(cell => cell !== EMPTY_CELL); // 去除空单元格
        
        // 合并相同的方块
        for (let i = col.length - 1; i > 0; i--) {
            if (col[i] === col[i - 1]) {
                col[i] *= 2;
                col[i - 1] = EMPTY_CELL;
                score += col[i]; // 增加分数
                
                // 标记合并的方块，用于动画
                const finalI = i;
                setTimeout(() => {
                    // 计算在网格中的实际位置
                    const actualI = GRID_SIZE - col.filter(cell => cell !== EMPTY_CELL).length + finalI;
                    const tile = document.getElementById(`tile-${actualI}-${j}`);
                    if (tile) {
                        tile.classList.add('tile-merged');
                        setTimeout(() => {
                            tile.classList.remove('tile-merged');
                        }, 300);
                    }
                }, 10);
                
                i--; // 跳过已合并的方块
            }
        }
        
        // 再次过滤掉空单元格并填充剩余空间
        const newCol = col.filter(cell => cell !== EMPTY_CELL);
        while (newCol.length < GRID_SIZE) {
            newCol.unshift(EMPTY_CELL); // 在顶部添加空单元格
        }
        
        // 更新网格
        for (let i = 0; i < GRID_SIZE; i++) {
            grid[i][j] = newCol[i];
        }
        
        // 检查是否有移动
        if (!moved && !arraysEqual(originalCol, newCol)) {
            moved = true;
        }
    }
    
    return moved;
}

// 检查两个数组是否相等
function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

// 检查是否还能移动
function canMove() {
    // 如果还有空位，可以移动
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (grid[i][j] === EMPTY_CELL) {
                return true;
            }
        }
    }
    
    // 检查水平方向是否有相邻的相同方块
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE - 1; j++) {
            if (grid[i][j] === grid[i][j + 1]) {
                return true;
            }
        }
    }
    
    // 检查垂直方向是否有相邻的相同方块
    for (let i = 0; i < GRID_SIZE - 1; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (grid[i][j] === grid[i + 1][j]) {
                return true;
            }
        }
    }
    
    // 如果以上条件都不满足，则无法移动
    return false;
}

// 游戏结束
function gameOver() {
    isGameOver = true;
    setTimeout(() => {
        gameOverElement.style.display = 'flex';
        finalScoreElement.textContent = score;
    }, 500);
}

// 事件监听
document.addEventListener('keydown', handleKeyPress);
newGameButton.addEventListener('click', initializeGame);
retryButton.addEventListener('click', initializeGame);

// 添加触摸滑动支持
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
});

document.addEventListener('touchmove', function(event) {
    touchEndX = event.touches[0].clientX;
    touchEndY = event.touches[0].clientY;
});

document.addEventListener('touchend', function() {
    // 如果背景选择模态框打开，则不处理游戏操作
    if (backgroundModal.style.display === 'flex') return;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // 最小滑动距离，防止误触
    const minSwipeDistance = 30;
    
    // 检测滑动方向
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
        // 水平滑动
        if (deltaX > 0) {
            // 向右滑动
            if (moveRight()) {
                generateNewTile();
                updateUI();
                updateScore();
                if (!canMove()) gameOver();
            } else {
                // 无效移动时添加震动效果
                gameBoard.classList.add('shake');
                setTimeout(() => {
                    gameBoard.classList.remove('shake');
                }, 500);
            }
        } else {
            // 向左滑动
            if (moveLeft()) {
                generateNewTile();
                updateUI();
                updateScore();
                if (!canMove()) gameOver();
            } else {
                // 无效移动时添加震动效果
                gameBoard.classList.add('shake');
                setTimeout(() => {
                    gameBoard.classList.remove('shake');
                }, 500);
            }
        }
    } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > minSwipeDistance) {
        // 垂直滑动
        if (deltaY > 0) {
            // 向下滑动
            if (moveDown()) {
                generateNewTile();
                updateUI();
                updateScore();
                if (!canMove()) gameOver();
            } else {
                // 无效移动时添加震动效果
                gameBoard.classList.add('shake');
                setTimeout(() => {
                    gameBoard.classList.remove('shake');
                }, 500);
            }
        } else {
            // 向上滑动
            if (moveUp()) {
                generateNewTile();
                updateUI();
                updateScore();
                if (!canMove()) gameOver();
            } else {
                // 无效移动时添加震动效果
                gameBoard.classList.add('shake');
                setTimeout(() => {
                    gameBoard.classList.remove('shake');
                }, 500);
            }
        }
    }
});

// 游戏初始化
window.onload = function() {
    initializeGame();
    initializeBackgroundSelector();
}; 