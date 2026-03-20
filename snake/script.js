const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const primaryStatLabel = document.getElementById("primaryStatLabel");
const primaryStatValue = document.getElementById("primaryStatValue");
const secondaryStatLabel = document.getElementById("secondaryStatLabel");
const secondaryStatValue = document.getElementById("secondaryStatValue");
const statusTextEl = document.getElementById("statusText");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const restartBtn = document.getElementById("restartBtn");
const speedSelect = document.getElementById("speedSelect");
const boardCaptionEl = document.getElementById("boardCaption");
const tipsListEl = document.getElementById("tipsList");
const modeDescriptionEl = document.getElementById("modeDescription");
const playerSetupEl = document.getElementById("playerSetup");
const playerASkinSelect = document.getElementById("playerASkinSelect");
const playerBSkinSelect = document.getElementById("playerBSkinSelect");
const mobileControlsEl = document.getElementById("mobileControls");
const padButtons = document.querySelectorAll(".pad-btn");
const themeButtons = document.querySelectorAll(".theme-chip");
const modeButtons = document.querySelectorAll(".mode-chip");

const BOARD_SIZE = 600;
const GRID_COUNT = 20;
const CELL_SIZE = BOARD_SIZE / GRID_COUNT;
const FOOD_SAFE_MARGIN = 1;
const BEST_SCORE_KEY = "rainbow-snake-best-score";
const THEME_STORAGE_KEY = "rainbow-snake-theme";
const MODE_STORAGE_KEY = "rainbow-snake-mode";
const PLAYER_A_SKIN_STORAGE_KEY = "rainbow-snake-player-a-skin";
const PLAYER_B_SKIN_STORAGE_KEY = "rainbow-snake-player-b-skin";
const DEFAULT_THEME = "candy";
const DEFAULT_MODE = "single";
const DEFAULT_PLAYER_SKINS = {
  A: "future",
  B: "ember"
};

const vectorUp = { x: 0, y: -1 };
const vectorDown = { x: 0, y: 1 };
const vectorLeft = { x: -1, y: 0 };
const vectorRight = { x: 1, y: 0 };

const SINGLE_INPUT_MAP = {
  ArrowUp: { playerId: "A", direction: vectorUp },
  ArrowDown: { playerId: "A", direction: vectorDown },
  ArrowLeft: { playerId: "A", direction: vectorLeft },
  ArrowRight: { playerId: "A", direction: vectorRight },
  KeyW: { playerId: "A", direction: vectorUp },
  KeyS: { playerId: "A", direction: vectorDown },
  KeyA: { playerId: "A", direction: vectorLeft },
  KeyD: { playerId: "A", direction: vectorRight }
};

const VERSUS_INPUT_MAP = {
  ArrowUp: { playerId: "B", direction: vectorUp },
  ArrowDown: { playerId: "B", direction: vectorDown },
  ArrowLeft: { playerId: "B", direction: vectorLeft },
  ArrowRight: { playerId: "B", direction: vectorRight },
  KeyW: { playerId: "A", direction: vectorUp },
  KeyS: { playerId: "A", direction: vectorDown },
  KeyA: { playerId: "A", direction: vectorLeft },
  KeyD: { playerId: "A", direction: vectorRight }
};

const padDirectionMap = {
  up: vectorUp,
  down: vectorDown,
  left: vectorLeft,
  right: vectorRight
};

const THEMES = {
  candy: {
    snakePalette: ["#ff79c8", "#ffd86d", "#7de4ff", "#85ffbd"],
    snakeShiftSpeed: 120,
    boardTile: "rgba(255, 255, 255, 0.025)",
    foodGlowInner: "rgba(255, 241, 168, 0.95)",
    foodGlowMid: "rgba(255, 101, 178, 0.9)",
    foodGlowOuter: "rgba(255, 101, 178, 0)",
    foodCore: "#ffe978",
    foodHighlight: "#ffffff",
    eyeColor: "#17355d",
    overlayBg: "rgba(8, 18, 42, 0.46)",
    overlayBorder: "rgba(255, 255, 255, 0.16)",
    overlayTitle: "#ffffff",
    overlaySubtitle: "rgba(255, 255, 255, 0.85)"
  },
  aurora: {
    snakePalette: ["#76f4ff", "#90ffd1", "#89b0ff", "#cb96ff"],
    snakeShiftSpeed: 140,
    boardTile: "rgba(233, 249, 255, 0.028)",
    foodGlowInner: "rgba(193, 252, 255, 0.92)",
    foodGlowMid: "rgba(127, 202, 255, 0.84)",
    foodGlowOuter: "rgba(127, 202, 255, 0)",
    foodCore: "#97f7ff",
    foodHighlight: "#f8ffff",
    eyeColor: "#0f3042",
    overlayBg: "rgba(8, 28, 49, 0.5)",
    overlayBorder: "rgba(195, 242, 255, 0.18)",
    overlayTitle: "#f1fcff",
    overlaySubtitle: "rgba(241, 252, 255, 0.82)"
  },
  forest: {
    snakePalette: ["#b0f07e", "#68df99", "#ffd36f", "#5ad4af"],
    snakeShiftSpeed: 150,
    boardTile: "rgba(236, 255, 228, 0.026)",
    foodGlowInner: "rgba(255, 225, 145, 0.92)",
    foodGlowMid: "rgba(162, 232, 102, 0.78)",
    foodGlowOuter: "rgba(162, 232, 102, 0)",
    foodCore: "#ffc970",
    foodHighlight: "#fff8e7",
    eyeColor: "#20341c",
    overlayBg: "rgba(22, 42, 20, 0.5)",
    overlayBorder: "rgba(219, 255, 197, 0.16)",
    overlayTitle: "#f7fff0",
    overlaySubtitle: "rgba(247, 255, 240, 0.82)"
  },
  ember: {
    snakePalette: ["#ffb14b", "#ff6d84", "#ff82d7", "#ffd36c"],
    snakeShiftSpeed: 115,
    boardTile: "rgba(255, 242, 228, 0.024)",
    foodGlowInner: "rgba(255, 220, 150, 0.92)",
    foodGlowMid: "rgba(255, 94, 134, 0.86)",
    foodGlowOuter: "rgba(255, 94, 134, 0)",
    foodCore: "#ffd46d",
    foodHighlight: "#fff6ea",
    eyeColor: "#4b1930",
    overlayBg: "rgba(52, 15, 30, 0.5)",
    overlayBorder: "rgba(255, 214, 194, 0.16)",
    overlayTitle: "#fff3ef",
    overlaySubtitle: "rgba(255, 243, 239, 0.82)"
  },
  ink: {
    snakePalette: ["#f2f1ea", "#c2cbc7", "#87969a", "#5b6a70"],
    snakeShiftSpeed: 180,
    boardTile: "rgba(255, 255, 255, 0.03)",
    foodGlowInner: "rgba(249, 248, 241, 0.92)",
    foodGlowMid: "rgba(130, 146, 151, 0.58)",
    foodGlowOuter: "rgba(130, 146, 151, 0)",
    foodCore: "#f3f0e7",
    foodHighlight: "#ffffff",
    eyeColor: "#253138",
    overlayBg: "rgba(29, 36, 39, 0.52)",
    overlayBorder: "rgba(243, 242, 236, 0.14)",
    overlayTitle: "#f7f6ef",
    overlaySubtitle: "rgba(247, 246, 239, 0.8)"
  },
  future: {
    snakePalette: ["#ff5cd6", "#a16cff", "#ff4568", "#ff8b68"],
    snakeShiftSpeed: 105,
    boardTile: "rgba(255, 221, 243, 0.035)",
    foodGlowInner: "rgba(255, 230, 244, 0.96)",
    foodGlowMid: "rgba(255, 82, 129, 0.88)",
    foodGlowOuter: "rgba(255, 82, 129, 0)",
    foodCore: "#ff7ca7",
    foodHighlight: "#fff7fd",
    eyeColor: "#351447",
    overlayBg: "rgba(31, 8, 37, 0.56)",
    overlayBorder: "rgba(255, 145, 208, 0.2)",
    overlayTitle: "#fff3fd",
    overlaySubtitle: "rgba(255, 232, 246, 0.84)"
  }
};

let players = [];
let foods = [];
let bestScore = Number(localStorage.getItem(BEST_SCORE_KEY) || 0);
let currentThemeName = DEFAULT_THEME;
let currentTheme = THEMES[DEFAULT_THEME];
let gameMode = DEFAULT_MODE;
let playerSkinChoices = {
  A: DEFAULT_PLAYER_SKINS.A,
  B: DEFAULT_PLAYER_SKINS.B
};
let gameRunning = false;
let gamePaused = false;
let gameOver = false;
let hasStarted = false;
let tickTimer = null;
let endOverlayTitle = "";
let endOverlaySubtitle = "";

function sanitizeTheme(themeName) {
  return THEMES[themeName] ? themeName : DEFAULT_THEME;
}

function sanitizeMode(modeName) {
  return modeName === "versus" ? "versus" : DEFAULT_MODE;
}

function createDirection(x, y) {
  return { x, y };
}

function cloneSegment(segment) {
  return { x: segment.x, y: segment.y };
}

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  const expanded = normalized.length === 3
    ? normalized.split("").map((part) => part + part).join("")
    : normalized;
  const value = Number.parseInt(expanded, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255
  };
}

function toRgba(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function cellsEqual(first, second) {
  return first.x === second.x && first.y === second.y;
}

function getPlayerById(playerId) {
  return players.find((player) => player.id === playerId) || null;
}

function getSinglePlayer() {
  return players[0] || null;
}

function getPlayerTheme(player) {
  const skinKey = gameMode === "single" ? currentThemeName : player.skinKey;
  return THEMES[skinKey] || currentTheme;
}

function createPlayer(config) {
  return {
    id: config.id,
    label: config.label,
    segments: config.segments.map(cloneSegment),
    direction: createDirection(config.direction.x, config.direction.y),
    nextDirection: createDirection(config.direction.x, config.direction.y),
    score: 0,
    skinKey: config.skinKey
  };
}

function createSinglePlayer() {
  return createPlayer({
    id: "A",
    label: "玩家",
    segments: [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ],
    direction: vectorRight,
    skinKey: currentThemeName
  });
}

function createVersusPlayers() {
  return [
    createPlayer({
      id: "A",
      label: "A",
      segments: [
        { x: 4, y: 6 },
        { x: 3, y: 6 },
        { x: 2, y: 6 }
      ],
      direction: vectorRight,
      skinKey: playerSkinChoices.A
    }),
    createPlayer({
      id: "B",
      label: "B",
      segments: [
        { x: 15, y: 13 },
        { x: 16, y: 13 },
        { x: 17, y: 13 }
      ],
      direction: vectorLeft,
      skinKey: playerSkinChoices.B
    })
  ];
}

function applyTheme(themeName) {
  const nextThemeName = sanitizeTheme(themeName);

  currentThemeName = nextThemeName;
  currentTheme = THEMES[nextThemeName];
  document.body.dataset.theme = nextThemeName;
  localStorage.setItem(THEME_STORAGE_KEY, nextThemeName);

  themeButtons.forEach((button) => {
    const isActive = button.dataset.theme === nextThemeName;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  if (gameMode === "single" && players.length > 0) {
    updateStats();
  }
}

function updatePlayerSkinChoice(playerId, skinName) {
  const nextSkin = sanitizeTheme(skinName);

  playerSkinChoices[playerId] = nextSkin;
  localStorage.setItem(
    playerId === "A" ? PLAYER_A_SKIN_STORAGE_KEY : PLAYER_B_SKIN_STORAGE_KEY,
    nextSkin
  );

  const player = getPlayerById(playerId);

  if (player) {
    player.skinKey = nextSkin;
  }
}

function updateTips() {
  if (gameMode === "single") {
    modeDescriptionEl.textContent = "单人模式支持方向键和 WASD，吃糖果会变长并持续加速。";
    boardCaptionEl.textContent = "方向键 / WASD 控制，空格可开始或暂停。";
    tipsListEl.innerHTML = `
      <li>吃到糖果球就会变长，并增加分数。</li>
      <li>撞到墙壁或撞到自己，游戏结束。</li>
      <li>速度会随着分数慢慢提升，越到后面越刺激。</li>
    `;
  } else {
    modeDescriptionEl.textContent = "双人模式下 A 用 WASD，B 用方向键；场上会同时出现 2 到 3 颗糖果。";
    boardCaptionEl.textContent = "A: W A S D，B: ↑ ↓ ← →，空格可开始或暂停。";
    tipsListEl.innerHTML = `
      <li>A 使用 W A S D，B 使用方向键，双方同时移动。</li>
      <li>头撞到边界、自己身体或对方身体都会直接判负。</li>
      <li>场上会维持 2 到 3 颗糖果，吃到会变长；同一帧互撞或抢到同一格时判平局。</li>
    `;
  }
}

function syncModeUi() {
  modeButtons.forEach((button) => {
    const isActive = button.dataset.mode === gameMode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  playerSetupEl.hidden = gameMode !== "versus";
  mobileControlsEl.hidden = gameMode !== "single";
  updateTips();
  updateStats();
}

function applyMode(modeName, options = {}) {
  const { shouldRestart = true } = options;
  const nextMode = sanitizeMode(modeName);

  gameMode = nextMode;
  localStorage.setItem(MODE_STORAGE_KEY, nextMode);
  syncModeUi();

  if (shouldRestart) {
    prepareRound();
  }
}

function updateStats() {
  if (gameMode === "single") {
    const player = getSinglePlayer();
    primaryStatLabel.textContent = "当前分数";
    primaryStatValue.textContent = String(player ? player.score : 0);
    secondaryStatLabel.textContent = "历史最高";
    secondaryStatValue.textContent = String(bestScore);
    return;
  }

  const playerA = getPlayerById("A");
  const playerB = getPlayerById("B");

  primaryStatLabel.textContent = "A 方得分";
  primaryStatValue.textContent = String(playerA ? playerA.score : 0);
  secondaryStatLabel.textContent = "B 方得分";
  secondaryStatValue.textContent = String(playerB ? playerB.score : 0);
}

function updateBestScoreIfNeeded() {
  const player = getSinglePlayer();

  if (!player || player.score <= bestScore) {
    return;
  }

  bestScore = player.score;
  localStorage.setItem(BEST_SCORE_KEY, String(bestScore));
  updateStats();
}

function setStatus(text) {
  statusTextEl.textContent = text;
}

function syncButtons() {
  startBtn.disabled = gameRunning;
  pauseBtn.disabled = !gameRunning;
  pauseBtn.textContent = gameMode === "versus" ? "暂停对战" : "暂停";

  if (gameRunning) {
    startBtn.textContent = gameMode === "versus" ? "对战中" : "进行中";
  } else if (gamePaused) {
    startBtn.textContent = gameMode === "versus" ? "继续对战" : "继续游戏";
  } else {
    startBtn.textContent = gameMode === "versus" ? "开始对战" : "开始游戏";
  }
}

function resetRound() {
  players = gameMode === "single" ? [createSinglePlayer()] : createVersusPlayers();
  foods = [];
  syncFoodSupply();
  gamePaused = false;
  gameOver = false;
  endOverlayTitle = "";
  endOverlaySubtitle = "";
  updateStats();
}

function prepareRound() {
  clearTimeout(tickTimer);
  hasStarted = false;
  gameRunning = false;
  gamePaused = false;
  gameOver = false;
  resetRound();
  setStatus("等待开始");
  syncButtons();
}

function getCurrentSpeed() {
  const baseSpeed = Number(speedSelect.value);

  if (gameMode === "single") {
    const player = getSinglePlayer();
    const bonus = player ? Math.floor(player.score / 4) * 4 : 0;
    return Math.max(55, baseSpeed - bonus);
  }

  const combinedScore = players.reduce((sum, player) => sum + player.score, 0);
  const bonus = Math.floor(combinedScore / 3) * 3;
  return Math.max(65, baseSpeed - bonus);
}

function scheduleNextTick() {
  clearTimeout(tickTimer);

  if (!gameRunning) {
    return;
  }

  tickTimer = setTimeout(() => {
    tick();
    scheduleNextTick();
  }, getCurrentSpeed());
}

function startGame() {
  if (gameRunning) {
    return;
  }

  if (!hasStarted || gameOver) {
    resetRound();
  }

  hasStarted = true;
  gameRunning = true;
  gamePaused = false;
  setStatus(gameMode === "versus" ? "对战中" : "游戏中");
  syncButtons();
  scheduleNextTick();
}

function pauseGame() {
  if (!gameRunning) {
    return;
  }

  clearTimeout(tickTimer);
  gameRunning = false;
  gamePaused = true;
  setStatus("暂停中");
  syncButtons();
}

function restartGame() {
  clearTimeout(tickTimer);
  hasStarted = false;
  gameRunning = false;
  gamePaused = false;
  gameOver = false;
  resetRound();
  hasStarted = true;
  gameRunning = true;
  setStatus(gameMode === "versus" ? "对战中" : "游戏中");
  syncButtons();
  scheduleNextTick();
}

function endGame(status, title, subtitle) {
  clearTimeout(tickTimer);
  gameRunning = false;
  gamePaused = false;
  gameOver = true;
  endOverlayTitle = title;
  endOverlaySubtitle = subtitle;
  setStatus(status);
  syncButtons();
}

function setPlayerDirection(player, nextDirection) {
  const reverseX = nextDirection.x === -player.direction.x;
  const reverseY = nextDirection.y === -player.direction.y;

  if (reverseX && reverseY) {
    return;
  }

  player.nextDirection = createDirection(nextDirection.x, nextDirection.y);
}

function handleDirectionInput(playerId, nextDirection) {
  if (!nextDirection) {
    return;
  }

  if (!hasStarted || gameOver) {
    return;
  }

  const player = getPlayerById(playerId);

  if (!player) {
    return;
  }

  setPlayerDirection(player, nextDirection);

  if (gamePaused) {
    startGame();
  }
}

function getTargetFoodCount() {
  if (gameMode === "single") {
    return 1;
  }

  const combinedScore = players.reduce((sum, player) => sum + player.score, 0);
  return combinedScore >= 4 ? 3 : 2;
}

function generateFood(excludedFoods = foods) {
  const availableCells = [];
  const innerCells = [];

  for (let y = 0; y < GRID_COUNT; y += 1) {
    for (let x = 0; x < GRID_COUNT; x += 1) {
      const occupiedBySnake = players.some((player) =>
        player.segments.some((segment) => segment.x === x && segment.y === y)
      );
      const occupiedByFood = excludedFoods.some((food) => food.x === x && food.y === y);

      if (occupiedBySnake || occupiedByFood) {
        continue;
      }

      const cell = { x, y };
      availableCells.push(cell);

      const insideSafeZone =
        x >= FOOD_SAFE_MARGIN &&
        x < GRID_COUNT - FOOD_SAFE_MARGIN &&
        y >= FOOD_SAFE_MARGIN &&
        y < GRID_COUNT - FOOD_SAFE_MARGIN;

      if (insideSafeZone) {
        innerCells.push(cell);
      }
    }
  }

  if (availableCells.length === 0) {
    return null;
  }

  const spawnPool = innerCells.length > 0 ? innerCells : availableCells;
  const index = Math.floor(Math.random() * spawnPool.length);
  return spawnPool[index];
}

function syncFoodSupply() {
  const targetCount = getTargetFoodCount();

  if (foods.length > targetCount) {
    foods = foods.slice(0, targetCount);
  }

  while (foods.length < targetCount) {
    const nextFood = generateFood(foods);

    if (!nextFood) {
      break;
    }

    foods.push(nextFood);
  }
}

function resolveVersusWinner() {
  const playerA = getPlayerById("A");
  const playerB = getPlayerById("B");

  if (!playerA || !playerB) {
    endGame("平局", "平局", "双方同时结束了这一局。");
    return;
  }

  if (playerA.score === playerB.score) {
    endGame("平局", "平局", "棋盘被吃满了，双方得分相同。");
    return;
  }

  const winner = playerA.score > playerB.score ? "A" : "B";
  const loser = winner === "A" ? "B" : "A";
  endGame(`${winner} 获胜`, `${winner} 获胜`, `${loser} 在得分上落后，这局由 ${winner} 拿下。`);
}

function tick() {
  const nextHeads = new Map();
  const willEatFood = new Map();
  const losers = new Set();

  players.forEach((player) => {
    player.direction = createDirection(player.nextDirection.x, player.nextDirection.y);

    const nextHead = {
      x: player.segments[0].x + player.direction.x,
      y: player.segments[0].y + player.direction.y
    };

    nextHeads.set(player.id, nextHead);
    willEatFood.set(
      player.id,
      foods.findIndex((food) => cellsEqual(nextHead, food))
    );
  });

  players.forEach((player) => {
    const nextHead = nextHeads.get(player.id);
    const hitWall =
      nextHead.x < 0 ||
      nextHead.x >= GRID_COUNT ||
      nextHead.y < 0 ||
      nextHead.y >= GRID_COUNT;

    if (hitWall) {
      losers.add(player.id);
      return;
    }

    const selfBody = willEatFood.get(player.id) !== -1
      ? player.segments
      : player.segments.slice(0, -1);

    if (selfBody.some((segment) => cellsEqual(segment, nextHead))) {
      losers.add(player.id);
    }

    players.forEach((otherPlayer) => {
      if (otherPlayer.id === player.id) {
        return;
      }

      const otherBody = willEatFood.get(otherPlayer.id) !== -1
        ? otherPlayer.segments
        : otherPlayer.segments.slice(0, -1);

      if (otherBody.some((segment) => cellsEqual(segment, nextHead))) {
        losers.add(player.id);
      }
    });
  });

  for (let index = 0; index < players.length; index += 1) {
    for (let compareIndex = index + 1; compareIndex < players.length; compareIndex += 1) {
      const firstPlayer = players[index];
      const secondPlayer = players[compareIndex];
      const firstHead = nextHeads.get(firstPlayer.id);
      const secondHead = nextHeads.get(secondPlayer.id);

      if (cellsEqual(firstHead, secondHead)) {
        losers.add(firstPlayer.id);
        losers.add(secondPlayer.id);
      }
    }
  }

  if (losers.size > 0) {
    if (gameMode === "single") {
      updateBestScoreIfNeeded();
      const player = getSinglePlayer();
      const score = player ? player.score : 0;
      endGame("游戏结束", "游戏结束", `本局得分 ${score}，再来一局吧`);
      return;
    }

    if (losers.size > 1) {
      endGame("平局", "平局", "双方同一帧撞上了边界或蛇身。");
      return;
    }

    if (losers.has("A")) {
      endGame("B 获胜", "B 获胜", "A 撞上了边界或蛇身。");
      return;
    }

    endGame("A 获胜", "A 获胜", "B 撞上了边界或蛇身。");
    return;
  }

  const eatenFoodIndexes = new Set();

  players.forEach((player) => {
    const nextHead = nextHeads.get(player.id);
    const eatenFoodIndex = willEatFood.get(player.id);

    player.segments.unshift(nextHead);

    if (eatenFoodIndex !== -1) {
      player.score += 1;
      eatenFoodIndexes.add(eatenFoodIndex);
      return;
    }

    player.segments.pop();
  });

  if (eatenFoodIndexes.size > 0) {
    foods = foods.filter((_, index) => !eatenFoodIndexes.has(index));

    if (gameMode === "single") {
      updateBestScoreIfNeeded();
    }

    syncFoodSupply();

    if (foods.length === 0) {
      if (gameMode === "single") {
        updateBestScoreIfNeeded();
        endGame("通关啦", "你通关啦", "整张棋盘都被你吃满了。");
      } else {
        resolveVersusWinner();
      }

      updateStats();
      return;
    }
  }

  updateStats();
}

function roundRectPath(x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);

  ctx.beginPath();
  ctx.moveTo(x + safeRadius, y);
  ctx.arcTo(x + width, y, x + width, y + height, safeRadius);
  ctx.arcTo(x + width, y + height, x, y + height, safeRadius);
  ctx.arcTo(x, y + height, x, y, safeRadius);
  ctx.arcTo(x, y, x + width, y, safeRadius);
  ctx.closePath();
}

function drawBackground() {
  for (let y = 0; y < GRID_COUNT; y += 1) {
    for (let x = 0; x < GRID_COUNT; x += 1) {
      if ((x + y) % 2 !== 0) {
        continue;
      }

      ctx.fillStyle = currentTheme.boardTile;
      ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
}

function drawFood(frameTime) {
  if (foods.length === 0) {
    return;
  }

  foods.forEach((food, index) => {
    const centerX = food.x * CELL_SIZE + CELL_SIZE / 2;
    const centerY = food.y * CELL_SIZE + CELL_SIZE / 2;
    const pulse = 0.5 + Math.sin(frameTime / 180 + index * 1.35) * 0.5;
    const radius = CELL_SIZE * (0.28 + pulse * 0.04);

    const glow = ctx.createRadialGradient(centerX, centerY, 2, centerX, centerY, CELL_SIZE * 0.65);
    glow.addColorStop(0, currentTheme.foodGlowInner);
    glow.addColorStop(0.45, currentTheme.foodGlowMid);
    glow.addColorStop(1, currentTheme.foodGlowOuter);

    ctx.save();
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(centerX, centerY, CELL_SIZE * 0.66, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = currentTheme.foodCore;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = currentTheme.foodHighlight;
    ctx.beginPath();
    ctx.arc(centerX - 5, centerY - 5, radius * 0.28, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawSnakeEyes(head, direction, skinTheme) {
  const eyeOffsetX = direction.x === 0 ? 7 : direction.x > 0 ? 17 : 9;
  const eyeOffsetY = direction.y === 0 ? 7 : direction.y > 0 ? 17 : 9;

  const firstEye = {
    x: head.x * CELL_SIZE + eyeOffsetX,
    y: head.y * CELL_SIZE + (direction.x === 0 ? 10 : 9)
  };

  const secondEye = {
    x: head.x * CELL_SIZE + (direction.x === 0 ? 20 : eyeOffsetX),
    y: head.y * CELL_SIZE + (direction.y === 0 ? 20 : eyeOffsetY)
  };

  ctx.save();
  ctx.fillStyle = skinTheme.eyeColor;
  ctx.beginPath();
  ctx.arc(firstEye.x, firstEye.y, 2.8, 0, Math.PI * 2);
  ctx.arc(secondEye.x, secondEye.y, 2.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawPlayerBadge(player, headCell, skinTheme) {
  if (gameMode !== "versus") {
    return;
  }

  const centerX = headCell.x * CELL_SIZE + CELL_SIZE / 2;
  const centerY = headCell.y * CELL_SIZE + CELL_SIZE / 2;

  ctx.save();
  ctx.fillStyle = toRgba(skinTheme.foodHighlight, 0.22);
  ctx.beginPath();
  ctx.arc(centerX, centerY + 1, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = skinTheme.overlayTitle;
  ctx.font = "700 11px 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(player.id, centerX, centerY + 1);
  ctx.restore();
}

function drawSnake(player, frameTime) {
  const skinTheme = getPlayerTheme(player);
  const palette = skinTheme.snakePalette;
  const paletteShift = Math.floor(frameTime / skinTheme.snakeShiftSpeed) + player.score + (player.id === "B" ? 2 : 0);

  player.segments.forEach((segment, index) => {
    const x = segment.x * CELL_SIZE + 2;
    const y = segment.y * CELL_SIZE + 2;
    const size = CELL_SIZE - 4;
    const firstColor = palette[(index + paletteShift) % palette.length];
    const secondColor = palette[(index + paletteShift + 1) % palette.length];
    const gradient = ctx.createLinearGradient(x, y, x + size, y + size);

    gradient.addColorStop(0, firstColor);
    gradient.addColorStop(1, secondColor);

    ctx.save();
    ctx.shadowColor = toRgba(firstColor, index === 0 ? 0.72 : 0.56);
    ctx.shadowBlur = index === 0 ? 22 : 14;
    ctx.fillStyle = gradient;
    roundRectPath(x, y, size, size, index === 0 ? 12 : 9);
    ctx.fill();
    ctx.restore();

    if (index === 0) {
      drawSnakeEyes(segment, player.direction, skinTheme);
      drawPlayerBadge(player, segment, skinTheme);
    }
  });
}

function getOverlaySubtitleLines(subtitle, maxWidth) {
  return String(subtitle)
    .split("\n")
    .flatMap((rawLine) => {
      if (!rawLine) {
        return [""];
      }

      const wrappedLines = [];
      let currentLine = "";

      for (const char of rawLine) {
        const nextLine = currentLine + char;

        if (currentLine && ctx.measureText(nextLine).width > maxWidth) {
          wrappedLines.push(currentLine);
          currentLine = char;
        } else {
          currentLine = nextLine;
        }
      }

      wrappedLines.push(currentLine);
      return wrappedLines;
    });
}

function drawOverlay(title, subtitle) {
  ctx.save();
  ctx.fillStyle = currentTheme.overlayBg;
  roundRectPath(110, 208, 380, 170, 28);
  ctx.fill();

  ctx.strokeStyle = currentTheme.overlayBorder;
  ctx.lineWidth = 1;
  roundRectPath(110, 208, 380, 170, 28);
  ctx.stroke();

  ctx.fillStyle = currentTheme.overlayTitle;
  ctx.font = "700 34px 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(title, BOARD_SIZE / 2, 270);

  ctx.fillStyle = currentTheme.overlaySubtitle;
  ctx.font = "500 18px 'Segoe UI', sans-serif";
  const subtitleLines = getOverlaySubtitleLines(subtitle, 290);
  const lineHeight = 24;
  const startY = 314 - ((subtitleLines.length - 1) * lineHeight) / 2;

  subtitleLines.forEach((line, index) => {
    ctx.fillText(line, BOARD_SIZE / 2, startY + index * lineHeight);
  });
  ctx.restore();
}

function draw(frameTime) {
  ctx.clearRect(0, 0, BOARD_SIZE, BOARD_SIZE);
  drawBackground();
  drawFood(frameTime);
  players.forEach((player) => drawSnake(player, frameTime));

  if (!hasStarted && !gameRunning && !gameOver) {
    const subtitle = gameMode === "single"
      ? "按空格或点击开始游戏\n方向键 / WASD 控制移动"
      : "按空格或点击开始对战\nA 用 WASD，B 用方向键";
    drawOverlay("准备开局", subtitle);
  } else if (gamePaused) {
    drawOverlay("暂停中", "按空格或点击开始继续");
  } else if (gameOver) {
    const subtitle = endOverlaySubtitle
      ? `${endOverlaySubtitle}\n按空格或点重新开始再来一局。`
      : "按空格或点重新开始再来一局。";
    drawOverlay(endOverlayTitle, subtitle);
  }
}

function render(frameTime = 0) {
  draw(frameTime);
  requestAnimationFrame(render);
}

startBtn.addEventListener("click", startGame);
pauseBtn.addEventListener("click", pauseGame);
restartBtn.addEventListener("click", restartGame);

speedSelect.addEventListener("change", () => {
  if (gameRunning) {
    scheduleNextTick();
  }
});

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyMode(button.dataset.mode);
  });
});

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyTheme(button.dataset.theme);
  });
});

playerASkinSelect.addEventListener("change", () => {
  updatePlayerSkinChoice("A", playerASkinSelect.value);
});

playerBSkinSelect.addEventListener("change", () => {
  updatePlayerSkinChoice("B", playerBSkinSelect.value);
});

window.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();

    if (gameRunning) {
      pauseGame();
    } else {
      startGame();
    }

    return;
  }

  if (event.code === "KeyR") {
    restartGame();
    return;
  }

  const inputMap = gameMode === "single" ? SINGLE_INPUT_MAP : VERSUS_INPUT_MAP;
  const input = inputMap[event.code];

  if (!input) {
    return;
  }

  event.preventDefault();
  handleDirectionInput(input.playerId, input.direction);
});

padButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (gameMode !== "single") {
      return;
    }

    handleDirectionInput("A", padDirectionMap[button.dataset.direction]);
  });
});

bestScore = Number(localStorage.getItem(BEST_SCORE_KEY) || 0);
playerSkinChoices = {
  A: sanitizeTheme(localStorage.getItem(PLAYER_A_SKIN_STORAGE_KEY) || DEFAULT_PLAYER_SKINS.A),
  B: sanitizeTheme(localStorage.getItem(PLAYER_B_SKIN_STORAGE_KEY) || DEFAULT_PLAYER_SKINS.B)
};

playerASkinSelect.value = playerSkinChoices.A;
playerBSkinSelect.value = playerSkinChoices.B;

applyTheme(localStorage.getItem(THEME_STORAGE_KEY) || DEFAULT_THEME);
applyMode(localStorage.getItem(MODE_STORAGE_KEY) || DEFAULT_MODE, { shouldRestart: false });
prepareRound();
requestAnimationFrame(render);
