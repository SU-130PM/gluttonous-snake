const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const primaryStatLabel = document.getElementById("primaryStatLabel");
const primaryStatValue = document.getElementById("primaryStatValue");
const secondaryStatLabel = document.getElementById("secondaryStatLabel");
const secondaryStatValue = document.getElementById("secondaryStatValue");
const statusTextEl = document.getElementById("statusText");
const growthTimerPillEl = document.getElementById("growthTimerPill");
const growthTimerValueEl = document.getElementById("growthTimerValue");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const restartBtn = document.getElementById("restartBtn");
const speedSelect = document.getElementById("speedSelect");
const boardCaptionEl = document.getElementById("boardCaption");
const tipsListEl = document.getElementById("tipsList");
const modeDescriptionEl = document.getElementById("modeDescription");
const versusRuleSetupEl = document.getElementById("versusRuleSetup");
const playerSetupEl = document.getElementById("playerSetup");
const playerASkinSelect = document.getElementById("playerASkinSelect");
const playerBSkinSelect = document.getElementById("playerBSkinSelect");
const playerASkinNoteEl = document.getElementById("playerASkinNote");
const playerBSkinNoteEl = document.getElementById("playerBSkinNote");
const playerASkinPickerEl = playerASkinSelect.closest(".skin-picker");
const playerBSkinPickerEl = playerBSkinSelect.closest(".skin-picker");
const mobileControlsEl = document.getElementById("mobileControls");
const padButtons = document.querySelectorAll(".pad-btn");
const themeButtons = document.querySelectorAll(".theme-chip");
const modeButtons = document.querySelectorAll(".mode-chip");
const versusRuleButtons = document.querySelectorAll(".versus-rule-chip");

const CELL_SIZE = 30;
const GRID_ROWS = 20;
const SINGLE_GRID_COLUMNS = 20;
const VERSUS_GRID_COLUMNS = 32;
const FOOD_SAFE_MARGIN = 1;
const BEST_SCORE_KEY = "rainbow-snake-best-score";
const THEME_STORAGE_KEY = "rainbow-snake-theme";
const MODE_STORAGE_KEY = "rainbow-snake-mode";
const VERSUS_RULE_STORAGE_KEY = "rainbow-snake-versus-rule";
const PLAYER_A_SKIN_STORAGE_KEY = "rainbow-snake-player-a-skin";
const PLAYER_B_SKIN_STORAGE_KEY = "rainbow-snake-player-b-skin";
const DEFAULT_THEME = "candy";
const DEFAULT_MODE = "single";
const DEFAULT_VERSUS_RULE = "classic";
const DEFAULT_PLAYER_SKINS = {
  A: "future",
  B: "ember"
};
const GROWTH_MODE_DURATION_MS = 60 * 1000;
const TIME_CUT_POWER_UP_MS = 5 * 1000;
const FUN_ITEM_LIFETIME_MS = 10 * 1000;
const FUN_ITEM_RESPAWN_MS = 3500;
const MAGNET_EFFECT_DURATION_MS = 8 * 1000;
const FOOD_ATTRACTION_ANIMATION_MS = 420;
const SPEED_LEVELS = [210, 165, 130, 100, 75];
const STANDARD_SPEED_TIER = 2;
const MAX_COMPETITIVE_POWER_UPS = 2;
const MYSTERY_BOX_SUCCESS_RATE = 0.8;
const MYSTERY_BOX_PENALTY_LENGTH = 5;
const MYSTERY_FLASH_DURATION_MS = 1000;
const POWER_UPS = {
  speedUp: {
    symbol: "+",
    label: "加速球",
    fill: "#7df0ff",
    glow: "rgba(125, 240, 255, 0.88)",
    text: "#0f3357"
  },
  speedDown: {
    symbol: "-",
    label: "减速球",
    fill: "#95a6ff",
    glow: "rgba(149, 166, 255, 0.84)",
    text: "#122347"
  },
  magnet: {
    symbol: "U",
    label: "磁石",
    fill: "#ff92df",
    glow: "rgba(255, 146, 223, 0.86)",
    text: "#4b1745"
  },
  plusFive: {
    symbol: "+5",
    label: "加五球",
    fill: "#8cff9e",
    glow: "rgba(140, 255, 158, 0.86)",
    text: "#173e20"
  },
  timeCut: {
    symbol: "-5S",
    label: "减时球",
    fill: "#ffe17f",
    glow: "rgba(255, 225, 127, 0.86)",
    text: "#5f2f0f"
  },
  mysteryBox: {
    symbol: "?",
    label: "盲盒",
    fill: "#9d8dff",
    glow: "rgba(157, 141, 255, 0.88)",
    text: "#261653"
  },
  halve: {
    symbol: "-50%",
    label: "减半球",
    fill: "#ffb56d",
    glow: "rgba(255, 181, 109, 0.86)",
    text: "#52261a"
  }
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

const SKIN_PROFILES = {
  candy: {
    style: "bubble",
    summary: "珠光圆角，像一串会发光的糖豆",
    headRadius: 15,
    bodyRadius: 12,
    outline: "#fffdf9",
    accent: "#fff7ff",
    accentAlt: "#ffd86d"
  },
  aurora: {
    style: "crystal",
    summary: "冰晶切面，带冷色流光斜纹",
    headRadius: 13,
    bodyRadius: 9,
    outline: "#ebfdff",
    accent: "#ddfcff",
    accentAlt: "#8bd5ff"
  },
  forest: {
    style: "leaf",
    summary: "叶脉与枝纹，更像会生长的藤蛇",
    headRadius: 14,
    bodyRadius: 11,
    outline: "#f0ffdf",
    accent: "#f8ffe6",
    accentAlt: "#6bd88c"
  },
  ember: {
    style: "flame",
    summary: "火焰芯脉，身体里有跃动焰尾",
    headRadius: 14,
    bodyRadius: 10,
    outline: "#ffe7c5",
    accent: "#fff0dc",
    accentAlt: "#ff6f77"
  },
  ink: {
    style: "brush",
    summary: "水墨断笔，纹理像干湿交替的笔锋",
    headRadius: 12,
    bodyRadius: 8,
    outline: "#f7f4eb",
    accent: "#f6f2e9",
    accentAlt: "#7d8a90"
  },
  future: {
    style: "circuit",
    summary: "霓虹电路，赛博刻线感更强",
    headRadius: 13,
    bodyRadius: 9,
    outline: "#ffd9f5",
    accent: "#ffe7fd",
    accentAlt: "#ff4f88"
  }
};

let players = [];
let foods = [];
let bestScore = Number(localStorage.getItem(BEST_SCORE_KEY) || 0);
let currentThemeName = DEFAULT_THEME;
let currentTheme = THEMES[DEFAULT_THEME];
let gameMode = DEFAULT_MODE;
let versusRule = DEFAULT_VERSUS_RULE;
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
let activePowerUps = [];
let nextPowerUpSpawnAt = 0;
let growthTimeRemainingMs = GROWTH_MODE_DURATION_MS;
let growthResumeAt = 0;
let funSpeedTier = SPEED_LEVELS.indexOf(Number(speedSelect.value));
let statusMessage = "等待开始";
let foodAttractionAnimations = [];

function sanitizeTheme(themeName) {
  return THEMES[themeName] ? themeName : DEFAULT_THEME;
}

function sanitizeMode(modeName) {
  return modeName === "versus" ? "versus" : DEFAULT_MODE;
}

function sanitizeVersusRule(ruleName) {
  if (ruleName === "growth" || ruleName === "fun") {
    return "competitive";
  }

  return ["classic", "competitive"].includes(ruleName) ? ruleName : DEFAULT_VERSUS_RULE;
}

function isCompetitiveVersusMode() {
  return gameMode === "versus" && versusRule === "competitive";
}

function isGrowthVersusMode() {
  return isCompetitiveVersusMode();
}

function isFunVersusMode() {
  return isCompetitiveVersusMode();
}

function getGridColumns() {
  return gameMode === "versus" ? VERSUS_GRID_COLUMNS : SINGLE_GRID_COLUMNS;
}

function getBoardWidth() {
  return getGridColumns() * CELL_SIZE;
}

function getBoardHeight() {
  return GRID_ROWS * CELL_SIZE;
}

function syncCanvasSize() {
  canvas.width = getBoardWidth();
  canvas.height = getBoardHeight();
}

function getSelectedSpeedTier() {
  const selectedValue = Number(speedSelect.value);
  const selectedTier = SPEED_LEVELS.indexOf(selectedValue);
  return selectedTier === -1 ? STANDARD_SPEED_TIER : selectedTier;
}

function setFunSpeedTier(nextTier) {
  const clampedTier = Math.max(0, Math.min(SPEED_LEVELS.length - 1, nextTier));
  funSpeedTier = clampedTier;
  speedSelect.value = String(SPEED_LEVELS[clampedTier]);
}

function setCompetitiveSpeedToStandard() {
  setFunSpeedTier(STANDARD_SPEED_TIER);
}

function getPlayerLength(player) {
  return player ? player.segments.length + player.pendingGrowth : 0;
}

function getGrowthTimeRemainingMs() {
  if (!isGrowthVersusMode()) {
    return 0;
  }

  if (gameRunning && growthResumeAt > 0) {
    return Math.max(0, growthTimeRemainingMs - (Date.now() - growthResumeAt));
  }

  return Math.max(0, growthTimeRemainingMs);
}

function reduceGrowthTime(amountMs, now = Date.now()) {
  if (!isGrowthVersusMode()) {
    return 0;
  }

  const currentRemaining = getGrowthTimeRemainingMs();
  const nextRemaining = Math.max(0, currentRemaining - amountMs);
  const reducedMs = currentRemaining - nextRemaining;

  growthTimeRemainingMs = nextRemaining;
  growthResumeAt = gameRunning ? now : 0;
  return reducedMs;
}

function formatTimer(ms) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
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

function getPlayerSkinKey(player) {
  return gameMode === "single" ? currentThemeName : player.skinKey;
}

function getPlayerTheme(player) {
  const skinKey = getPlayerSkinKey(player);
  return THEMES[skinKey] || currentTheme;
}

function getPlayerProfile(player) {
  const skinKey = getPlayerSkinKey(player);
  return SKIN_PROFILES[skinKey] || SKIN_PROFILES[DEFAULT_THEME];
}

function syncSkinPickerNote(noteEl, pickerEl, skinKey) {
  if (!noteEl || !pickerEl) {
    return;
  }

  const nextSkinKey = sanitizeTheme(skinKey);
  const profile = SKIN_PROFILES[nextSkinKey] || SKIN_PROFILES[DEFAULT_THEME];
  noteEl.textContent = profile.summary;
  pickerEl.dataset.skinPreview = nextSkinKey;
}

function syncSkinPickerUi() {
  syncSkinPickerNote(playerASkinNoteEl, playerASkinPickerEl, playerSkinChoices.A);
  syncSkinPickerNote(playerBSkinNoteEl, playerBSkinPickerEl, playerSkinChoices.B);
}

function createPlayer(config) {
  return {
    id: config.id,
    label: config.label,
    segments: config.segments.map(cloneSegment),
    direction: createDirection(config.direction.x, config.direction.y),
    nextDirection: createDirection(config.direction.x, config.direction.y),
    score: 0,
    pendingGrowth: 0,
    magnetUntil: 0,
    effectFlash: null,
    skinKey: config.skinKey
  };
}

function createSinglePlayer() {
  const centerX = Math.floor(getGridColumns() / 2);
  const centerY = Math.floor(GRID_ROWS / 2);

  return createPlayer({
    id: "A",
    label: "玩家",
    segments: [
      { x: centerX, y: centerY },
      { x: centerX - 1, y: centerY },
      { x: centerX - 2, y: centerY }
    ],
    direction: vectorRight,
    skinKey: currentThemeName
  });
}

function createVersusPlayers() {
  const gridColumns = getGridColumns();
  const topLane = Math.max(4, Math.floor(GRID_ROWS / 2) - 4);
  const bottomLane = Math.min(GRID_ROWS - 5, Math.floor(GRID_ROWS / 2) + 3);
  const leftStart = Math.max(5, Math.floor(gridColumns * 0.18));
  const rightStart = gridColumns - leftStart - 1;

  return [
    createPlayer({
      id: "A",
      label: "A",
      segments: [
        { x: leftStart, y: topLane },
        { x: leftStart - 1, y: topLane },
        { x: leftStart - 2, y: topLane }
      ],
      direction: vectorRight,
      skinKey: playerSkinChoices.A
    }),
    createPlayer({
      id: "B",
      label: "B",
      segments: [
        { x: rightStart, y: bottomLane },
        { x: rightStart + 1, y: bottomLane },
        { x: rightStart + 2, y: bottomLane }
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

  syncSkinPickerUi();
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
    if (versusRule === "competitive") {
      modeDescriptionEl.textContent = "竞技模式限时一分钟，双方要边抢长度边抢道具；七种道具等概率刷新，若途中撞墙或撞蛇则会被直接判负。";
      boardCaptionEl.textContent = "A: W A S D，B: ↑ ↓ ← →，一分钟内拼长度也拼道具。";
      tipsListEl.innerHTML = `
        <li>A 使用 W A S D，B 使用方向键，双方同时移动。</li>
        <li>限时一分钟，时间到按当前蛇身长度判定胜负。</li>
        <li>七种道具等概率刷新，场上会同时维持 1 到 2 颗，存在 10 秒后会消失并等待补位。</li>
        <li>若途中撞到边界、自己身体或对方身体，会立刻判对方获胜。</li>
        <li>加速球“+”：提升全场速度 1 档，达到疾速档位后不再继续提升。</li>
        <li>减速球“-”：降低全场速度 1 档，达到宝宝档位后不再继续降低。</li>
        <li>磁石“U”：开启 8 秒磁场，自动吸收蛇头附近 3 x 3 范围内的糖果球。</li>
        <li>加五球“+5”：让自己立刻增加 5 格长度。</li>
        <li>减时球“-5S”：让当前剩余时间立刻减少 5 秒。</li>
        <li>盲盒：80% 概率均分触发其余六种道具之一，20% 概率让自己体长减少 5 格，最低减到 1。</li>
        <li>减半球“-50%”：让对手当前蛇身长度减半，奇数长度会向上取整。</li>
      `;
      return;
    }

    modeDescriptionEl.textContent = "经典模式保留当前双人对战规则：双方同场争夺 2 到 3 颗糖果，撞墙或撞蛇都会直接判负。";
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

  versusRuleButtons.forEach((button) => {
    const isActive = button.dataset.versusRule === versusRule;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  document.body.dataset.mode = gameMode;
  syncCanvasSize();
  versusRuleSetupEl.hidden = gameMode !== "versus";
  playerSetupEl.hidden = gameMode !== "versus";
  mobileControlsEl.hidden = gameMode !== "single";
  updateTips();
  updateStats();
  syncStatusText();
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

function applyVersusRule(ruleName, options = {}) {
  const { shouldRestart = true } = options;
  const nextRule = sanitizeVersusRule(ruleName);

  versusRule = nextRule;
  localStorage.setItem(VERSUS_RULE_STORAGE_KEY, nextRule);
  syncModeUi();

  if (gameMode === "versus" && shouldRestart) {
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

  if (isGrowthVersusMode()) {
    primaryStatLabel.textContent = "A 方长度";
    primaryStatValue.textContent = String(getPlayerLength(playerA));
    secondaryStatLabel.textContent = "B 方长度";
    secondaryStatValue.textContent = String(getPlayerLength(playerB));
    return;
  }

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

function syncGrowthTimerUi() {
  const shouldShowTimer = isGrowthVersusMode();

  growthTimerPillEl.hidden = !shouldShowTimer;

  if (!shouldShowTimer) {
    return;
  }

  if (gameOver) {
    growthTimerValueEl.textContent = "00:00";
    return;
  }

  growthTimerValueEl.textContent = formatTimer(getGrowthTimeRemainingMs());
}

function syncStatusText() {
  syncGrowthTimerUi();
  statusTextEl.textContent = statusMessage;
}

function setStatus(text) {
  statusMessage = text;
  syncStatusText();
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
  activePowerUps = [];
  foodAttractionAnimations = [];
  nextPowerUpSpawnAt = isFunVersusMode() ? Date.now() + FUN_ITEM_RESPAWN_MS : 0;
  growthTimeRemainingMs = GROWTH_MODE_DURATION_MS;
  growthResumeAt = 0;
  if (isCompetitiveVersusMode()) {
    setCompetitiveSpeedToStandard();
  } else {
    setFunSpeedTier(getSelectedSpeedTier());
  }
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

  if (isFunVersusMode()) {
    return SPEED_LEVELS[funSpeedTier];
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
  if (isGrowthVersusMode()) {
    growthResumeAt = Date.now();
  }
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
  if (isGrowthVersusMode()) {
    growthTimeRemainingMs = getGrowthTimeRemainingMs();
    growthResumeAt = 0;
  }
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
  if (isGrowthVersusMode()) {
    growthResumeAt = Date.now();
  }
  setStatus(gameMode === "versus" ? "对战中" : "游戏中");
  syncButtons();
  scheduleNextTick();
}

function endGame(status, title, subtitle) {
  clearTimeout(tickTimer);
  gameRunning = false;
  gamePaused = false;
  if (isGrowthVersusMode()) {
    growthTimeRemainingMs = getGrowthTimeRemainingMs();
    growthResumeAt = 0;
  }
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

function getTargetPowerUpCount() {
  return isFunVersusMode() ? MAX_COMPETITIVE_POWER_UPS : 0;
}

function generateOpenCell(excludedFoods = foods, blockedPowerUps = activePowerUps) {
  const availableCells = [];
  const innerCells = [];
  const gridColumns = getGridColumns();

  for (let y = 0; y < GRID_ROWS; y += 1) {
    for (let x = 0; x < gridColumns; x += 1) {
      const occupiedBySnake = players.some((player) =>
        player.segments.some((segment) => segment.x === x && segment.y === y)
      );
      const occupiedByFood = excludedFoods.some((food) => food.x === x && food.y === y);
      const occupiedByPowerUp = blockedPowerUps.some((powerUp) => powerUp.x === x && powerUp.y === y);

      if (occupiedBySnake || occupiedByFood || occupiedByPowerUp) {
        continue;
      }

      const cell = { x, y };
      availableCells.push(cell);

      const insideSafeZone =
        x >= FOOD_SAFE_MARGIN &&
        x < gridColumns - FOOD_SAFE_MARGIN &&
        y >= FOOD_SAFE_MARGIN &&
        y < GRID_ROWS - FOOD_SAFE_MARGIN;

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

function generateFood(excludedFoods = foods) {
  return generateOpenCell(excludedFoods);
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

function generatePowerUp() {
  const spawnCell = generateOpenCell(foods, activePowerUps);

  if (!spawnCell) {
    return null;
  }

  const powerUpTypes = Object.keys(POWER_UPS);
  const nextType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];

  return {
    ...spawnCell,
    type: nextType,
    expiresAt: Date.now() + FUN_ITEM_LIFETIME_MS
  };
}

function syncFunPowerUp(now = Date.now()) {
  const targetCount = getTargetPowerUpCount();

  if (targetCount === 0) {
    activePowerUps = [];
    nextPowerUpSpawnAt = 0;
    return;
  }

  const remainingPowerUps = activePowerUps.filter((powerUp) => powerUp.expiresAt > now);
  const expiredCount = activePowerUps.length - remainingPowerUps.length;

  if (expiredCount > 0) {
    activePowerUps = remainingPowerUps;
  }

  if (activePowerUps.length < targetCount && nextPowerUpSpawnAt === 0) {
    nextPowerUpSpawnAt = now + FUN_ITEM_RESPAWN_MS;
  }

  if (nextPowerUpSpawnAt > 0 && now >= nextPowerUpSpawnAt) {
    const nextPowerUp = generatePowerUp();

    if (nextPowerUp) {
      activePowerUps.push(nextPowerUp);
    }

    nextPowerUpSpawnAt = activePowerUps.length < targetCount
      ? now + FUN_ITEM_RESPAWN_MS
      : 0;
  }
}

function halvePlayer(targetPlayer) {
  if (!targetPlayer) {
    return;
  }

  const nextLength = Math.max(1, Math.ceil(targetPlayer.segments.length / 2));
  targetPlayer.segments = targetPlayer.segments.slice(0, nextLength);
  targetPlayer.pendingGrowth = 0;
  targetPlayer.score = Math.max(0, nextLength - 3);
}

function shrinkPlayerBy(player, shrinkAmount) {
  if (!player || shrinkAmount <= 0) {
    return;
  }

  const nextLength = player.segments.length <= shrinkAmount
    ? 1
    : player.segments.length - shrinkAmount;

  player.segments = player.segments.slice(0, nextLength);
  player.pendingGrowth = 0;
  player.score = Math.max(0, nextLength - 3);
}

function extendPlayerTail(player, extraSegments) {
  if (!player || extraSegments <= 0 || player.segments.length === 0) {
    return;
  }

  const tail = player.segments[player.segments.length - 1];

  for (let index = 0; index < extraSegments; index += 1) {
    player.segments.push(cloneSegment(tail));
  }
}

function isMagnetActive(player, now = Date.now()) {
  return Boolean(player) && player.magnetUntil > now;
}

function queueFoodAttractionAnimation(food, playerId, now) {
  foodAttractionAnimations.push({
    startX: food.x * CELL_SIZE + CELL_SIZE / 2,
    startY: food.y * CELL_SIZE + CELL_SIZE / 2,
    playerId,
    createdAt: now
  });
}

function collectMagnetFoods(player, eatenFoodIndexes, now) {
  const head = player.segments[0];
  let absorbedFoodCount = 0;

  foods.forEach((food, index) => {
    if (eatenFoodIndexes.has(index)) {
      return;
    }

    const insideMagnetField =
      Math.abs(food.x - head.x) <= 1 &&
      Math.abs(food.y - head.y) <= 1;

    if (!insideMagnetField) {
      return;
    }

    eatenFoodIndexes.add(index);
    queueFoodAttractionAnimation(food, player.id, now);
    absorbedFoodCount += 1;
  });

  return absorbedFoodCount;
}

function syncFoodAttractionAnimations(now = Date.now()) {
  foodAttractionAnimations = foodAttractionAnimations.filter((animation) =>
    now - animation.createdAt <= FOOD_ATTRACTION_ANIMATION_MS
  );
}

function createMysteryFlashEffect(text, fill, textColor) {
  return { text, fill, textColor };
}

function triggerPlayerEffectFlash(player, flashEffect, now = Date.now()) {
  if (!player || !flashEffect) {
    return;
  }

  player.effectFlash = {
    ...flashEffect,
    createdAt: now,
    expiresAt: now + MYSTERY_FLASH_DURATION_MS
  };
}

function getPowerUpFlashEffect(powerUpType) {
  const powerUpTheme = POWER_UPS[powerUpType];

  if (!powerUpTheme) {
    return null;
  }

  return createMysteryFlashEffect(powerUpTheme.symbol, powerUpTheme.fill, powerUpTheme.text);
}

function applyMysteryBoxEffect(player, eatenFoodIndexes, now) {
  const rewardTypes = Object.keys(POWER_UPS).filter((type) => type !== "mysteryBox");

  if (Math.random() < MYSTERY_BOX_SUCCESS_RATE && rewardTypes.length > 0) {
    const randomReward = rewardTypes[Math.floor(Math.random() * rewardTypes.length)];
    const rewardResult = applyPowerUpEffect(
      player,
      { ...POWER_UPS[randomReward], type: randomReward },
      eatenFoodIndexes,
      now
    );

    return {
      ...rewardResult,
      selfShrinkAmount: 0,
      flashEffect: getPowerUpFlashEffect(randomReward)
    };
  }

  return {
    extraGrowth: 0,
    instantGrowth: false,
    halveTargetId: null,
    timePenaltyMs: 0,
    selfShrinkAmount: MYSTERY_BOX_PENALTY_LENGTH,
    flashEffect: createMysteryFlashEffect("-5", "#ff6f8f", "#fff7fb")
  };
}

function applyPowerUpEffect(player, powerUp, eatenFoodIndexes, now) {
  if (!powerUp) {
    return {
      extraGrowth: 0,
      instantGrowth: false,
      halveTargetId: null,
      timePenaltyMs: 0,
      selfShrinkAmount: 0,
      flashEffect: null
    };
  }

  if (powerUp.type === "speedUp") {
    setFunSpeedTier(funSpeedTier + 1);
    return {
      extraGrowth: 0,
      instantGrowth: false,
      halveTargetId: null,
      timePenaltyMs: 0,
      selfShrinkAmount: 0,
      flashEffect: null
    };
  }

  if (powerUp.type === "speedDown") {
    setFunSpeedTier(funSpeedTier - 1);
    return {
      extraGrowth: 0,
      instantGrowth: false,
      halveTargetId: null,
      timePenaltyMs: 0,
      selfShrinkAmount: 0,
      flashEffect: null
    };
  }

  if (powerUp.type === "magnet") {
    player.magnetUntil = now + MAGNET_EFFECT_DURATION_MS;

    return {
      extraGrowth: collectMagnetFoods(player, eatenFoodIndexes, now),
      instantGrowth: false,
      halveTargetId: null,
      timePenaltyMs: 0,
      selfShrinkAmount: 0,
      flashEffect: null
    };
  }

  if (powerUp.type === "plusFive") {
    return {
      extraGrowth: 5,
      instantGrowth: true,
      halveTargetId: null,
      timePenaltyMs: 0,
      selfShrinkAmount: 0,
      flashEffect: null
    };
  }

  if (powerUp.type === "timeCut") {
    return {
      extraGrowth: 0,
      instantGrowth: false,
      halveTargetId: null,
      timePenaltyMs: reduceGrowthTime(TIME_CUT_POWER_UP_MS, now),
      selfShrinkAmount: 0,
      flashEffect: null
    };
  }

  if (powerUp.type === "mysteryBox") {
    return applyMysteryBoxEffect(player, eatenFoodIndexes, now);
  }

  return {
    extraGrowth: 0,
    instantGrowth: false,
    halveTargetId: player.id === "A" ? "B" : "A",
    timePenaltyMs: 0,
    selfShrinkAmount: 0,
    flashEffect: null
  };
}

function resolveGrowthWinner(reason) {
  const playerA = getPlayerById("A");
  const playerB = getPlayerById("B");

  if (!playerA || !playerB) {
    endGame("平局", "平局", "双方同时结束了这一局。");
    return;
  }

  const playerALength = getPlayerLength(playerA);
  const playerBLength = getPlayerLength(playerB);

  if (playerALength === playerBLength) {
    endGame("平局", "平局", `${reason} 双方长度相同。`);
    return;
  }

  const winner = playerALength > playerBLength ? "A" : "B";
  const loser = winner === "A" ? "B" : "A";
  endGame(`${winner} 获胜`, `${winner} 获胜`, `${reason} ${winner} 比 ${loser} 更长，拿下这一局。`);
}

function resolveVersusWinner() {
  if (isGrowthVersusMode()) {
    resolveGrowthWinner("时间结束，按长度判定。");
    return;
  }

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
  const now = Date.now();
  syncFoodAttractionAnimations(now);

  if (isGrowthVersusMode() && getGrowthTimeRemainingMs() <= 0) {
    growthTimeRemainingMs = 0;
    resolveGrowthWinner("时间结束，按长度判定。");
    return;
  }

  syncFunPowerUp(now);

  const nextHeads = new Map();
  const willEatFood = new Map();
  const losers = new Set();
  const gridColumns = getGridColumns();
  const growthByPlayer = new Map(players.map((player) => [player.id, 0]));
  const instantGrowthByPlayer = new Map(players.map((player) => [player.id, false]));
  const pendingSelfShrinkByPlayer = new Map(players.map((player) => [player.id, 0]));
  const powerUpConsumptions = [];
  const pendingHalveTargetIds = [];

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

    const powerUpIndex = activePowerUps.findIndex((powerUp) => cellsEqual(nextHead, powerUp));

    if (powerUpIndex !== -1) {
      powerUpConsumptions.push({ playerId: player.id, powerUpIndex });
    }
  });

  players.forEach((player) => {
    const nextHead = nextHeads.get(player.id);
    const hitWall =
      nextHead.x < 0 ||
      nextHead.x >= gridColumns ||
      nextHead.y < 0 ||
      nextHead.y >= GRID_ROWS;

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
      growthByPlayer.set(player.id, growthByPlayer.get(player.id) + 1);
      eatenFoodIndexes.add(eatenFoodIndex);
    }
  });

  if (powerUpConsumptions.length > 0) {
    const consumedPowerUpIndexes = new Set();
    let shouldSyncTimer = false;

    powerUpConsumptions.forEach(({ playerId, powerUpIndex }) => {
      if (consumedPowerUpIndexes.has(powerUpIndex)) {
        return;
      }

      const powerUp = activePowerUps[powerUpIndex];
      const consumer = getPlayerById(playerId);

      if (!powerUp || !consumer) {
        return;
      }

      const { extraGrowth, instantGrowth, halveTargetId, timePenaltyMs, selfShrinkAmount, flashEffect } = applyPowerUpEffect(
        consumer,
        powerUp,
        eatenFoodIndexes,
        now
      );

      growthByPlayer.set(consumer.id, growthByPlayer.get(consumer.id) + extraGrowth);
      instantGrowthByPlayer.set(consumer.id, instantGrowthByPlayer.get(consumer.id) || instantGrowth);

      if (halveTargetId) {
        pendingHalveTargetIds.push(halveTargetId);
      }

      if (timePenaltyMs > 0) {
        shouldSyncTimer = true;
      }

      if (selfShrinkAmount > 0) {
        pendingSelfShrinkByPlayer.set(
          consumer.id,
          pendingSelfShrinkByPlayer.get(consumer.id) + selfShrinkAmount
        );
      }

      if (flashEffect) {
        triggerPlayerEffectFlash(consumer, flashEffect, now);
      }

      consumedPowerUpIndexes.add(powerUpIndex);
    });

    if (consumedPowerUpIndexes.size > 0) {
      activePowerUps = activePowerUps.filter((_, index) => !consumedPowerUpIndexes.has(index));

      if (activePowerUps.length < getTargetPowerUpCount() && nextPowerUpSpawnAt === 0) {
        nextPowerUpSpawnAt = now + FUN_ITEM_RESPAWN_MS;
      }
    }

    if (shouldSyncTimer) {
      syncGrowthTimerUi();
    }
  }

  players.forEach((player) => {
    if (!isMagnetActive(player, now)) {
      return;
    }

    const absorbedFoodCount = collectMagnetFoods(player, eatenFoodIndexes, now);

    if (absorbedFoodCount > 0) {
      growthByPlayer.set(player.id, growthByPlayer.get(player.id) + absorbedFoodCount);
    }
  });

  players.forEach((player) => {
    const growthThisTurn = growthByPlayer.get(player.id) || 0;

    if (growthThisTurn > 0) {
      player.score += growthThisTurn;

      if (instantGrowthByPlayer.get(player.id)) {
        extendPlayerTail(player, growthThisTurn - 1);
        return;
      }

      if (growthThisTurn > 1) {
        player.pendingGrowth += growthThisTurn - 1;
      }

      return;
    }

    if (player.pendingGrowth > 0) {
      player.pendingGrowth -= 1;
      return;
    }

    player.segments.pop();
  });

  pendingHalveTargetIds.forEach((targetId) => {
    halvePlayer(getPlayerById(targetId));
  });

  pendingSelfShrinkByPlayer.forEach((shrinkAmount, playerId) => {
    if (shrinkAmount > 0) {
      shrinkPlayerBy(getPlayerById(playerId), shrinkAmount);
    }
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
        if (isGrowthVersusMode()) {
          resolveGrowthWinner("棋盘已被吃满，按长度判定。");
        } else {
          resolveVersusWinner();
        }
      }

      updateStats();
      return;
    }
  }

  if (isGrowthVersusMode() && getGrowthTimeRemainingMs() <= 0) {
    growthTimeRemainingMs = 0;
    resolveGrowthWinner("时间结束，按长度判定。");
    return;
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
  const gridColumns = getGridColumns();

  for (let y = 0; y < GRID_ROWS; y += 1) {
    for (let x = 0; x < gridColumns; x += 1) {
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

function drawPowerUpOrb(powerUp, frameTime) {
  if (!powerUp) {
    return;
  }

  const powerUpTheme = POWER_UPS[powerUp.type];
  const centerX = powerUp.x * CELL_SIZE + CELL_SIZE / 2;
  const centerY = powerUp.y * CELL_SIZE + CELL_SIZE / 2;
  const pulse = 0.5 + Math.sin(frameTime / 170) * 0.5;
  const remainingRatio = Math.max(0, (powerUp.expiresAt - Date.now()) / FUN_ITEM_LIFETIME_MS);
  const alpha = 0.4 + remainingRatio * 0.6;
  const coreRadius = CELL_SIZE * (0.34 + pulse * 0.04);

  ctx.save();
  ctx.globalAlpha = alpha;

  const glow = ctx.createRadialGradient(centerX, centerY, 2, centerX, centerY, CELL_SIZE * 0.84);
  glow.addColorStop(0, toRgba(powerUpTheme.fill, 0.92));
  glow.addColorStop(0.52, powerUpTheme.glow);
  glow.addColorStop(1, toRgba(powerUpTheme.fill, 0));

  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(centerX, centerY, CELL_SIZE * 0.78, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = powerUpTheme.fill;
  ctx.beginPath();
  ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = toRgba(currentTheme.foodHighlight, 0.6);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, coreRadius + 1.5, 0, Math.PI * 2);
  ctx.stroke();

  if (powerUp.type === "mysteryBox") {
    const boxWidth = CELL_SIZE * 0.44;
    const boxHeight = CELL_SIZE * 0.32;
    const lidHeight = CELL_SIZE * 0.1;

    ctx.fillStyle = "#fff8ec";
    roundRectPath(centerX - boxWidth / 2, centerY - boxHeight / 2 + 2, boxWidth, boxHeight, 4);
    ctx.fill();
    ctx.strokeStyle = toRgba(powerUpTheme.text, 0.58);
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.fillStyle = "#fff1cf";
    roundRectPath(centerX - boxWidth / 2, centerY - boxHeight / 2 - lidHeight + 3, boxWidth, lidHeight + 3, 4);
    ctx.fill();

    ctx.fillStyle = powerUpTheme.text;
    ctx.fillRect(centerX - 1.25, centerY - boxHeight / 2 - lidHeight + 4, 2.5, boxHeight + lidHeight - 2);
    ctx.fillRect(centerX - boxWidth / 2 + 2, centerY - 1, boxWidth - 4, 2.5);

    ctx.font = "900 10px 'Segoe UI', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("?", centerX + 0.2, centerY + 0.8);

    ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
    ctx.beginPath();
    ctx.arc(centerX + boxWidth * 0.22, centerY - boxHeight * 0.42, 1.7, 0, Math.PI * 2);
    ctx.arc(centerX + boxWidth * 0.32, centerY - boxHeight * 0.52, 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }

  ctx.fillStyle = powerUpTheme.text;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = powerUp.type === "halve"
    ? "800 11px 'Segoe UI', sans-serif"
    : powerUp.type === "plusFive" || powerUp.type === "timeCut"
      ? "900 14px 'Segoe UI', sans-serif"
    : "900 18px 'Segoe UI', sans-serif";
  ctx.fillText(powerUpTheme.symbol, centerX, centerY + 0.5);
  ctx.restore();
}

function drawPowerUp(frameTime) {
  if (activePowerUps.length === 0) {
    return;
  }

  activePowerUps.forEach((powerUp) => {
    drawPowerUpOrb(powerUp, frameTime);
  });
}

function drawFoodAttractionAnimations(frameTime) {
  if (foodAttractionAnimations.length === 0) {
    return;
  }

  const now = Date.now();
  syncFoodAttractionAnimations(now);

  foodAttractionAnimations.forEach((animation, index) => {
    const player = getPlayerById(animation.playerId);

    if (!player || player.segments.length === 0) {
      return;
    }

    const head = player.segments[0];
    const targetX = head.x * CELL_SIZE + CELL_SIZE / 2;
    const targetY = head.y * CELL_SIZE + CELL_SIZE / 2;
    const progress = Math.min(1, (now - animation.createdAt) / FOOD_ATTRACTION_ANIMATION_MS);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const currentX = animation.startX + (targetX - animation.startX) * easedProgress;
    const currentY = animation.startY + (targetY - animation.startY) * easedProgress;
    const pulse = 0.5 + Math.sin(frameTime / 160 + index) * 0.5;

    ctx.save();
    ctx.strokeStyle = toRgba(POWER_UPS.magnet.fill, 0.32 * (1 - easedProgress));
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(currentX, currentY);
    ctx.lineTo(targetX, targetY);
    ctx.stroke();

    const glow = ctx.createRadialGradient(currentX, currentY, 2, currentX, currentY, CELL_SIZE * 0.52);
    glow.addColorStop(0, currentTheme.foodHighlight);
    glow.addColorStop(0.5, currentTheme.foodCore);
    glow.addColorStop(1, toRgba(currentTheme.foodCore, 0));

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(currentX, currentY, CELL_SIZE * (0.36 + pulse * 0.03), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawMagnetField(player, frameTime) {
  if (!isMagnetActive(player)) {
    return;
  }

  const head = player.segments[0];
  const centerX = head.x * CELL_SIZE + CELL_SIZE / 2;
  const centerY = head.y * CELL_SIZE + CELL_SIZE / 2;
  const pulse = 0.5 + Math.sin(frameTime / 180 + (player.id === "B" ? 0.9 : 0)) * 0.5;
  const fieldSize = CELL_SIZE * 3 - 6;
  const fieldX = centerX - fieldSize / 2;
  const fieldY = centerY - fieldSize / 2;

  ctx.save();
  ctx.strokeStyle = toRgba(POWER_UPS.magnet.fill, 0.32 + pulse * 0.18);
  ctx.lineWidth = 2;
  ctx.setLineDash([7, 6]);
  roundRectPath(fieldX, fieldY, fieldSize, fieldSize, 16);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.beginPath();
  ctx.arc(centerX, centerY, CELL_SIZE * (0.72 + pulse * 0.05), 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawSnakeEyes(head, direction, skinTheme, skinProfile) {
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
  ctx.arc(firstEye.x, firstEye.y, skinProfile.style === "brush" ? 2.3 : 2.8, 0, Math.PI * 2);
  ctx.arc(secondEye.x, secondEye.y, skinProfile.style === "brush" ? 2.3 : 2.8, 0, Math.PI * 2);
  ctx.fill();

  if (skinProfile.style !== "brush") {
    ctx.fillStyle = toRgba(skinProfile.accent, 0.88);
    ctx.beginPath();
    ctx.arc(firstEye.x - 0.6, firstEye.y - 0.8, 0.85, 0, Math.PI * 2);
    ctx.arc(secondEye.x - 0.6, secondEye.y - 0.8, 0.85, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawPlayerBadge(player, headCell, skinTheme, skinProfile) {
  if (gameMode !== "versus") {
    return;
  }

  const centerX = headCell.x * CELL_SIZE + CELL_SIZE / 2;
  const centerY = headCell.y * CELL_SIZE + CELL_SIZE / 2;

  ctx.save();
  ctx.fillStyle = toRgba(skinProfile.accentAlt, 0.24);
  ctx.beginPath();
  ctx.arc(centerX, centerY + 1, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = toRgba(skinProfile.outline, 0.68);
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = skinTheme.overlayTitle;
  ctx.font = "700 11px 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(player.id, centerX, centerY + 1);
  ctx.restore();
}

function drawPlayerEffectFlash(player, headCell, frameTime) {
  if (!player || !player.effectFlash) {
    return;
  }

  const now = Date.now();

  if (player.effectFlash.expiresAt <= now) {
    player.effectFlash = null;
    return;
  }

  const { text, fill, textColor, createdAt, expiresAt } = player.effectFlash;
  const duration = Math.max(1, expiresAt - createdAt);
  const progress = Math.min(1, Math.max(0, (now - createdAt) / duration));
  const blink = 0.45 + Math.abs(Math.sin(frameTime / 75)) * 0.5;
  const alpha = (1 - progress * 0.3) * blink;
  const centerX = headCell.x * CELL_SIZE + CELL_SIZE / 2;
  const centerY = headCell.y * CELL_SIZE - 12 - progress * 6;
  const fontSize = text.length >= 4 ? 10 : 12;

  ctx.save();
  ctx.font = `900 ${fontSize}px 'Segoe UI', sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const textWidth = ctx.measureText(text).width;
  const pillWidth = Math.max(30, textWidth + 18);
  const pillHeight = 22;
  const pillX = centerX - pillWidth / 2;
  const pillY = centerY - pillHeight / 2;

  ctx.globalAlpha = alpha;
  ctx.fillStyle = toRgba(fill, 0.32);
  roundRectPath(pillX, pillY, pillWidth, pillHeight, 11);
  ctx.fill();

  ctx.strokeStyle = toRgba(fill, 0.8);
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.fillStyle = textColor;
  ctx.fillText(text, centerX, centerY + 0.5);
  ctx.restore();
}

function drawSegmentAccent(x, y, size, index, skinProfile, frameTime) {
  const centerX = x + size / 2;
  const centerY = y + size / 2;
  const pulse = 0.5 + Math.sin(frameTime / 180 + index * 0.72) * 0.5;

  ctx.save();

  if (skinProfile.style === "bubble") {
    ctx.fillStyle = toRgba(skinProfile.accent, 0.26 + pulse * 0.18);
    ctx.beginPath();
    ctx.arc(x + size * 0.34, y + size * 0.34, size * 0.18, 0, Math.PI * 2);
    ctx.arc(x + size * 0.68, y + size * 0.62, size * 0.11, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = toRgba(skinProfile.accentAlt, 0.34);
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.arc(centerX, centerY, size * 0.3, Math.PI * 1.08, Math.PI * 1.78);
    ctx.stroke();
    ctx.restore();
    return;
  }

  if (skinProfile.style === "crystal") {
    ctx.strokeStyle = toRgba(skinProfile.accent, 0.5);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x + size * 0.22, y + size * 0.74);
    ctx.lineTo(x + size * 0.5, y + size * 0.22);
    ctx.lineTo(x + size * 0.78, y + size * 0.58);
    ctx.stroke();

    ctx.strokeStyle = toRgba(skinProfile.accentAlt, 0.38);
    ctx.beginPath();
    ctx.moveTo(x + size * 0.38, y + size * 0.24);
    ctx.lineTo(x + size * 0.65, y + size * 0.42);
    ctx.lineTo(x + size * 0.5, y + size * 0.78);
    ctx.stroke();
    ctx.restore();
    return;
  }

  if (skinProfile.style === "leaf") {
    ctx.strokeStyle = toRgba(skinProfile.accent, 0.46);
    ctx.lineWidth = 1.35;
    ctx.beginPath();
    ctx.moveTo(centerX, y + size * 0.2);
    ctx.lineTo(centerX, y + size * 0.82);
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x + size * 0.3, y + size * 0.36);
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x + size * 0.72, y + size * 0.46);
    ctx.moveTo(centerX, y + size * 0.62);
    ctx.lineTo(x + size * 0.38, y + size * 0.8);
    ctx.stroke();
    ctx.restore();
    return;
  }

  if (skinProfile.style === "flame") {
    ctx.fillStyle = toRgba(skinProfile.accentAlt, 0.24 + pulse * 0.18);
    ctx.beginPath();
    ctx.moveTo(centerX, y + size * 0.18);
    ctx.quadraticCurveTo(x + size * 0.7, y + size * 0.4, centerX, y + size * 0.84);
    ctx.quadraticCurveTo(x + size * 0.28, y + size * 0.48, centerX, y + size * 0.18);
    ctx.fill();

    ctx.fillStyle = toRgba(skinProfile.accent, 0.3);
    ctx.beginPath();
    ctx.moveTo(centerX + 1, y + size * 0.3);
    ctx.quadraticCurveTo(x + size * 0.62, y + size * 0.46, centerX, y + size * 0.72);
    ctx.quadraticCurveTo(x + size * 0.42, y + size * 0.48, centerX + 1, y + size * 0.3);
    ctx.fill();
    ctx.restore();
    return;
  }

  if (skinProfile.style === "brush") {
    ctx.strokeStyle = toRgba(skinProfile.accentAlt, 0.4);
    ctx.lineWidth = 2.1;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x + size * 0.24, y + size * 0.72);
    ctx.lineTo(x + size * 0.7, y + size * 0.3);
    ctx.stroke();

    ctx.fillStyle = toRgba(skinProfile.accent, 0.2);
    ctx.beginPath();
    ctx.arc(x + size * 0.72, y + size * 0.28, size * 0.07, 0, Math.PI * 2);
    ctx.arc(x + size * 0.56, y + size * 0.46, size * 0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }

  ctx.strokeStyle = toRgba(skinProfile.accent, 0.52 + pulse * 0.12);
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(x + size * 0.22, y + size * 0.32);
  ctx.lineTo(x + size * 0.55, y + size * 0.32);
  ctx.lineTo(x + size * 0.55, y + size * 0.7);
  ctx.lineTo(x + size * 0.8, y + size * 0.7);
  ctx.stroke();

  ctx.fillStyle = toRgba(skinProfile.accentAlt, 0.58);
  ctx.beginPath();
  ctx.arc(x + size * 0.22, y + size * 0.32, size * 0.045, 0, Math.PI * 2);
  ctx.arc(x + size * 0.8, y + size * 0.7, size * 0.045, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawSnake(player, frameTime) {
  const skinTheme = getPlayerTheme(player);
  const skinProfile = getPlayerProfile(player);
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
    roundRectPath(x, y, size, size, index === 0 ? skinProfile.headRadius : skinProfile.bodyRadius);
    ctx.fill();
    ctx.strokeStyle = toRgba(skinProfile.outline, index === 0 ? 0.48 : 0.3);
    ctx.lineWidth = index === 0 ? 1.4 : 1;
    ctx.stroke();
    drawSegmentAccent(x, y, size, index, skinProfile, frameTime);
    ctx.restore();

    if (index === 0) {
      drawMagnetField(player, frameTime);
      drawSnakeEyes(segment, player.direction, skinTheme, skinProfile);
      drawPlayerBadge(player, segment, skinTheme, skinProfile);
      drawPlayerEffectFlash(player, segment, frameTime);
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
  const boardWidth = canvas.width;
  const boardHeight = canvas.height;
  const overlayWidth = 380;
  const overlayHeight = 170;
  const overlayX = (boardWidth - overlayWidth) / 2;
  const overlayY = (boardHeight - overlayHeight) / 2;

  ctx.save();
  ctx.fillStyle = currentTheme.overlayBg;
  roundRectPath(overlayX, overlayY, overlayWidth, overlayHeight, 28);
  ctx.fill();

  ctx.strokeStyle = currentTheme.overlayBorder;
  ctx.lineWidth = 1;
  roundRectPath(overlayX, overlayY, overlayWidth, overlayHeight, 28);
  ctx.stroke();

  ctx.fillStyle = currentTheme.overlayTitle;
  ctx.font = "700 34px 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(title, boardWidth / 2, overlayY + 62);

  ctx.fillStyle = currentTheme.overlaySubtitle;
  ctx.font = "500 18px 'Segoe UI', sans-serif";
  const subtitleLines = getOverlaySubtitleLines(subtitle, 290);
  const lineHeight = 24;
  const startY = overlayY + 106 - ((subtitleLines.length - 1) * lineHeight) / 2;

  subtitleLines.forEach((line, index) => {
    ctx.fillText(line, boardWidth / 2, startY + index * lineHeight);
  });
  ctx.restore();
}

function draw(frameTime) {
  syncStatusText();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawFood(frameTime);
  drawPowerUp(frameTime);
  players.forEach((player) => drawSnake(player, frameTime));
  drawFoodAttractionAnimations(frameTime);

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
  if (isFunVersusMode()) {
    setFunSpeedTier(getSelectedSpeedTier());
  }

  if (gameRunning) {
    scheduleNextTick();
  }
});

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyMode(button.dataset.mode);
  });
});

versusRuleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyVersusRule(button.dataset.versusRule);
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
versusRule = sanitizeVersusRule(localStorage.getItem(VERSUS_RULE_STORAGE_KEY) || DEFAULT_VERSUS_RULE);
playerSkinChoices = {
  A: sanitizeTheme(localStorage.getItem(PLAYER_A_SKIN_STORAGE_KEY) || DEFAULT_PLAYER_SKINS.A),
  B: sanitizeTheme(localStorage.getItem(PLAYER_B_SKIN_STORAGE_KEY) || DEFAULT_PLAYER_SKINS.B)
};

playerASkinSelect.value = playerSkinChoices.A;
playerBSkinSelect.value = playerSkinChoices.B;
syncSkinPickerUi();

applyTheme(localStorage.getItem(THEME_STORAGE_KEY) || DEFAULT_THEME);
applyMode(localStorage.getItem(MODE_STORAGE_KEY) || DEFAULT_MODE, { shouldRestart: false });
prepareRound();
requestAnimationFrame(render);
