const app = document.querySelector("#app");
const toast = document.querySelector("#toast");

const VERSION = "home-precision-20260603c";
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const STORAGE = {
  records: "mood.records.v2",
  paid: "mood.paid.v2",
  testUses: "mood.testUses.v2",
  events: "mood.events.v2",
  streakPrompted: "mood.streakPrompted.v2",
  lastWeatherKey: "mood.lastWeatherKey.v2"
};

const PAGE_SPECS = {
  homeWide: { shell: "shell-home-wide", designWidth: 457, designHeight: 1104 },
  homeRain: { shell: "shell-home-rain", designWidth: 377, designHeight: 1024 },
  result: { shell: "shell-flow", designWidth: 377, designHeight: 1474 },
  testIntro: { shell: "shell-flow", designWidth: 377, designHeight: 925 },
  question: { shell: "shell-question", designWidth: 412, designHeight: 925 },
  archive: { shell: "shell-flow", designWidth: 377, designHeight: 1461 }
};

const ASSET = {
  avatar: `assets/avatar.gif?v=${VERSION}`,
  gameIcon: `assets/game-icon-box.png?v=${VERSION}`,
  archiveIcon: `assets/archive-icon-box.png?v=${VERSION}`,
  good: `assets/record-good.png?v=${VERSION}`,
  ok: `assets/record-ok.png?v=${VERSION}`,
  hard: `assets/record-hard.png?v=${VERSION}`,
  collapse: `assets/record-collapse.png?v=${VERSION}`,
  weatherSun: `assets/cutouts/weather-sun.png?v=${VERSION}`,
  weatherCloudy: `assets/cutouts/weather-cloudy.png?v=${VERSION}`,
  weatherRain: `assets/cutouts/weather-rain.png?v=${VERSION}`,
  weatherStorm: `assets/cutouts/weather-storm.png?v=${VERSION}`,
  resultSun: `assets/cutouts/result-sun-clean.png?v=${VERSION}`,
  resultCloudy: `assets/cutouts/result-cloudy-clean.png?v=${VERSION}`,
  resultRain: `assets/cutouts/result-rain-clean.png?v=${VERSION}`,
  resultStorm: `assets/cutouts/result-storm-clean.png?v=${VERSION}`,
  testStar: `assets/figma-extracted/test-star.png?v=${VERSION}`
};

const moods = {
  good: {
    value: 2,
    label: "好极了",
    weatherKey: "sun",
    homeWeather: "晴空万里",
    resultName: "晴空万里",
    feedback: "今天是个好日子，继续保持",
    quote: "你不必一直晴朗，但今天的你，值得一朵小花。",
    advice: [
      "今天奖励自己一件小事：奶茶、早睡半小时或追一集剧",
      "把今天让我开心的一个瞬间记下来",
      "对一个人说谢谢，或告诉TA有你真好"
    ]
  },
  ok: {
    value: 1,
    label: "还可以",
    weatherKey: "cloudy",
    homeWeather: "多云转阴",
    resultName: "多云转阴",
    feedback: "平平淡淡也是真，没关系",
    quote: "阴天不是坏天气，它只是天空在休息。你也一样。",
    advice: [
      "今晚做一件最小可完成的事：洗个热水澡、整理一个抽屉或倒一杯温水喝掉",
      "如果不想说话，发一条消息给一个人：今天有点累，不用回我",
      "给自己一个允许：允许今天不开心，允许什么都不做"
    ]
  },
  hard: {
    value: 0,
    label: "好难",
    weatherKey: "rain",
    homeWeather: "阴雨连绵",
    resultName: "阴雨连绵",
    feedback: "今天辛苦了，明天会更好",
    quote: "下雨的时候，不需要假装有太阳。允许自己撑伞，也允许自己停下来躲雨。",
    advice: [
      "今晚做一件最小可完成的事：洗个热水澡、整理一个抽屉或倒一杯温水喝掉",
      "如果不想说话，发一条消息给一个人：今天有点累，不用回我",
      "给自己一个允许：允许今天不开心，允许什么都不做"
    ]
  }
};

const weatherMeta = {
  default: {
    theme: "theme-default",
    homeTitle: "",
    quote: "今天心情怎么样？选择一个记录一下吧！",
    art: ASSET.weatherCloudy
  },
  sun: {
    theme: "theme-sun",
    homeTitle: "晴空万里",
    resultTitle: "晴空万里",
    quote: "今天是个好日子，继续保持",
    reportQuote: "你不必一直晴朗，但今天的你，值得一朵小花。",
    art: ASSET.weatherSun,
    resultArt: ASSET.resultSun,
    moodKey: "good",
    scoreText: "气象指数: 0/12",
    quality: ["稳定", "充足", "轻盈"],
    advice: [
      "今天奖励自己一件小事：奶茶、早睡半小时或追一集剧",
      "把今天让我开心的一个瞬间记下来",
      "对一个人说谢谢，或告诉TA有你真好"
    ]
  },
  cloudy: {
    theme: "theme-cloudy",
    homeTitle: "多云转阴",
    resultTitle: "多云转阴",
    quote: "平平淡淡也是真，没关系",
    reportQuote: "阴天不是坏天气，它只是天空在休息。你也一样。",
    art: ASSET.weatherCloudy,
    resultArt: ASSET.resultCloudy,
    moodKey: "ok",
    scoreText: "气象指数: 6/12",
    quality: ["平稳", "缓慢", "休息"]
  },
  rain: {
    theme: "theme-rain",
    homeTitle: "阴雨连绵",
    resultTitle: "阴雨连绵",
    quote: "下雨的时候，不需要假装有太阳",
    reportQuote: "下雨的时候，不需要假装有太阳。允许自己撑伞，也允许自己停下来躲雨。",
    art: ASSET.weatherRain,
    resultArt: ASSET.resultRain,
    moodKey: "hard",
    scoreText: "气象指数: 9/12",
    quality: ["偏低", "不足", "低落"]
  },
  storm: {
    theme: "theme-storm",
    homeTitle: "红色暴雨预警",
    resultTitle: "红色暴雨预警",
    quote: "暴雨不是你的错，该找个屋檐了",
    reportQuote: "暴雨不是你的错，是天在提醒你：该找个屋檐了。你不是一个人。",
    art: ASSET.weatherStorm,
    resultArt: ASSET.resultStorm,
    moodKey: "hard",
    scoreText: "气象指数: 12/12",
    quality: ["很低", "告急", "预警"],
    advice: [
      "最重要的一步：今晚告诉一个你信任的人，我现在不太好",
      "专业求助：拨打希望24热线 400-161-9995（24小时免费）",
      "今晚对自己好一点：喝点热的，早点躺下，不强迫自己好起来"
    ]
  }
};

const HOME_SPECS = {
  default: {
    frame: "home-frame-default",
    layout: "home-default-layout",
    shellKey: "homeWide",
    designWidth: 457,
    designHeight: 1064,
    canvasHeight: 984
  },
  sun: {
    frame: "home-frame-sun",
    layout: "home-weather-layout",
    shellKey: "homeWide",
    designWidth: 457,
    designHeight: 1104,
    canvasHeight: 1024
  },
  cloudy: {
    frame: "home-frame-cloudy",
    layout: "home-weather-layout",
    shellKey: "homeWide",
    designWidth: 457,
    designHeight: 1104,
    canvasHeight: 1024
  },
  rain: {
    frame: "home-frame-rain",
    layout: "home-weather-layout",
    shellKey: "homeRain",
    designWidth: 377,
    designHeight: 1024,
    canvasHeight: 1024
  },
  storm: {
    frame: "home-frame-storm",
    layout: "home-weather-layout",
    shellKey: "homeWide",
    designWidth: 457,
    designHeight: 1104,
    canvasHeight: 1024
  }
};

const questions = [
  {
    icon: "sun",
    title: "早晨的第一个念头",
    question: "闹钟响后，你醒来时的第一个感觉是？",
    options: [
      { text: "今天又是元气满满的一天！", score: 0, mark: "☀️" },
      { text: "再睡5分钟...就5分钟...", score: 1, mark: "🛏️" },
      { text: "为什么又要起床？不想面对。", score: 2, mark: "😫" }
    ]
  },
  {
    icon: "game",
    title: "你的“快乐开关”",
    question: "想到你以前最喜欢做的事（追剧/打游戏/运动/做饭），现在？",
    options: [
      { text: "还是那么香！一有空就想做", score: 0, mark: "🎮⚡" },
      { text: "还行吧，但提不起劲主动开始", score: 1, mark: "📱💤" },
      { text: "没意思，碰都不想碰", score: 2, mark: "💀📦" }
    ]
  },
  {
    icon: "signal",
    title: "大脑的“信号格”",
    question: "最近工作/学习时，你的大脑信号有几格？",
    options: [
      { text: "满格！效率超高，心流状态", score: 0, mark: "📶📡" },
      { text: "两三格，时不时走神但还能拉回来", score: 1, mark: "📶🐌" },
      { text: "无服务...脑子像一团浆糊", score: 2, mark: "📶❌" }
    ]
  },
  {
    icon: "party",
    title: "社交“电量”",
    question: "朋友约你聚会/同事喊你吃饭，你的第一反应是？",
    options: [
      { text: "去！正好想见见他们", score: 0, mark: "🎉⚡" },
      { text: "看心情吧...去了应该也还行", score: 1, mark: "🤔💭" },
      { text: "不想去，不想解释，就想一个人待着", score: 2, mark: "🧊🚪" }
    ]
  },
  {
    icon: "battery",
    title: "身体的“电量条”",
    question: "忙了一天回到家，你的身体电量还剩多少？",
    options: [
      { text: "80%以上！还能再战", score: 0, mark: "🔋💯" },
      { text: "30%左右，只想躺平刷手机", score: 1, mark: "🔋🟡" },
      { text: "0%自动关机...连洗澡都觉得累", score: 2, mark: "🔴⚰️" }
    ]
  },
  {
    icon: "mirror",
    title: "镜子里的自己",
    question: "晚上照镜子/睡前复盘时，你心里冒出来的声音是？",
    options: [
      { text: "今天也辛苦了，你做得不错", score: 0, mark: "👑✨" },
      { text: "还行吧，有好的也有不好的", score: 1, mark: "🤷‍♂️💨" },
      { text: "我真没用...什么都做不好", score: 2, mark: "💔🔇" }
    ]
  }
];

const levels = [
  { max: 3, key: "sun", moodKey: "good", name: "晴空万里" },
  { max: 6, key: "cloudy", moodKey: "ok", name: "多云转阴" },
  { max: 9, key: "rain", moodKey: "hard", name: "阴雨连绵" },
  { max: 12, key: "storm", moodKey: "hard", name: "红色暴雨预警" }
];

const moodStates = {
  sun: { moodKey: "good", label: "好极了", weatherLabel: "晴空万里", assetKey: "good" },
  cloudy: { moodKey: "ok", label: "还可以", weatherLabel: "多云转阴", assetKey: "ok" },
  rain: { moodKey: "hard", label: "好难", weatherLabel: "阴雨连绵", assetKey: "hard" },
  storm: { moodKey: "hard", label: "崩溃", weatherLabel: "红色暴雨预警", assetKey: "collapse" }
};

function icon(name, extraClass = "") {
  const icons = {
    brand: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M15 31h20c4.6 0 8-3.1 8-7.2 0-4-3.3-7-7.5-7.1C33.8 11.7 29.4 8 23.8 8 17.2 8 12 13.1 12 19.5 7.8 20.5 5 23.4 5 27.1 5 29.4 7 31 10.3 31H15Z" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    cloud: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M15 31h20c4.6 0 8-3.1 8-7.2 0-4-3.3-7-7.5-7.1C33.8 11.7 29.4 8 23.8 8 17.2 8 12 13.1 12 19.5 7.8 20.5 5 23.4 5 27.1 5 29.4 7 31 10.3 31H15Z" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    game: `<svg viewBox="0 0 56 56" aria-hidden="true"><rect x="12" y="21" width="32" height="20" rx="8" fill="none" stroke="currentColor" stroke-width="3.2"/><path d="M21 26v9M16.5 30.5h9" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><circle cx="36" cy="29" r="2.4" fill="currentColor"/><circle cx="40" cy="34" r="2.4" fill="currentColor"/></svg>`,
    archive: `<svg viewBox="0 0 56 56" aria-hidden="true"><rect x="16" y="15" width="24" height="28" rx="4" fill="none" stroke="currentColor" stroke-width="3"/><path d="M21 12v8M35 12v8M16 24h24M22 30h3M31 30h3M22 36h3M31 36h3" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/></svg>`,
    sun: `<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="14" fill="#ffd747"/><path d="M32 7v9M32 48v9M7 32h9M48 32h9M14 14l6.5 6.5M43.5 43.5 50 50M50 14l-6.5 6.5M20.5 43.5 14 50" stroke="#ffd747" stroke-width="4.2" stroke-linecap="round"/></svg>`,
    signal: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M14 42c11.8-11.8 24.2-11.8 36 0M22 50c6.4-6.4 13.6-6.4 20 0" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><circle cx="32" cy="55" r="3.8" fill="currentColor"/></svg>`,
    party: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M18 48l10-32 20 20-30 12Z" fill="#66d58d" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M35 16c5-7 12-6 14-1M43 27c7 0 10 4 11 8M23 21c-4-4-8-5-12-3" fill="none" stroke="#ffd747" stroke-width="3" stroke-linecap="round"/></svg>`,
    battery: `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="12" y="22" width="36" height="21" rx="5" fill="none" stroke="currentColor" stroke-width="3.5"/><path d="M50 29h3c2 0 3 1.5 3 3.5s-1 3.5-3 3.5h-3" fill="none" stroke="currentColor" stroke-width="3.5"/><rect x="18" y="28" width="21" height="9" rx="2.5" fill="#66d58d"/></svg>`,
    mirror: `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="20" y="8" width="24" height="36" rx="12" fill="#f7faf8" stroke="currentColor" stroke-width="3"/><path d="M32 44v9M23 55h18" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M27 26c3 3 7 3 10 0" fill="none" stroke="#66d58d" stroke-width="3" stroke-linecap="round"/></svg>`,
    chart: `<svg viewBox="0 0 56 56" aria-hidden="true"><path d="M13 39l9-9 8 6 13-17" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M39 19h4v4" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>`,
    doc: `<svg viewBox="0 0 56 56" aria-hidden="true"><path d="M18 10h16l8 8v28H18V10Z" fill="none" stroke="currentColor" stroke-width="3"/><path d="M34 10v10h8M23 28h14M23 35h14" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>`,
    lock: `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="18" y="29" width="28" height="24" rx="6" fill="none" stroke="currentColor" stroke-width="4"/><path d="M23 29v-8c0-7 4-12 9-12s9 5 9 12v8" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>`,
    home: `<svg viewBox="0 0 56 56" aria-hidden="true"><path d="M12 28 28 14l16 14v18H17V29" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 46V34h8v12" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round"/></svg>`,
    bolt: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M36 5 16 36h15l-4 23 21-34H33l3-20Z" fill="#ffc928"/></svg>`,
    rainbow: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M10 45a22 22 0 0 1 44 0" fill="none" stroke="#f04d61" stroke-width="6" stroke-linecap="round"/><path d="M18 45a14 14 0 0 1 28 0" fill="none" stroke="#ffd747" stroke-width="6" stroke-linecap="round"/><path d="M26 45a6 6 0 0 1 12 0" fill="none" stroke="#49c96f" stroke-width="6" stroke-linecap="round"/><path d="M8 49h48" stroke="#3aa3ff" stroke-width="5" stroke-linecap="round"/></svg>`,
    bars: `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="13" y="34" width="8" height="18" fill="#28b766"/><rect x="28" y="22" width="8" height="30" fill="#2d8cff"/><rect x="43" y="10" width="8" height="42" fill="#ff5965"/><path d="M9 54h46" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>`,
    fire: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M34 6c5 10 17 15 17 30 0 13-9 22-20 22S12 49 12 37c0-8 5-14 12-20-1 8 3 12 7 14 6-7 2-16 3-25Z" fill="#ff563f"/><path d="M32 35c5 5 8 8 8 14 0 5-4 9-9 9s-9-4-9-9c0-5 4-9 10-14Z" fill="#ffd747"/></svg>`,
    sparkle: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 5c4 15 12 23 27 27-15 4-23 12-27 27C28 44 20 36 5 32 20 28 28 20 32 5Z" fill="#ffd747"/><path d="M48 5c2 7 5 10 12 12-7 2-10 5-12 12-2-7-5-10-12-12 7-2 10-5 12-12Z" fill="#ff9b5f"/></svg>`,
    book: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M14 13h17c5 0 8 3 8 8v31c0-5-3-8-8-8H14V13Z" fill="#eaf3f0" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M50 13H39c-5 0-8 3-8 8v31c0-5 3-8 8-8h11V13Z" fill="#fff" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M20 23h9M20 31h9M40 23h5M40 31h5" stroke="#91a696" stroke-width="2.5" stroke-linecap="round"/></svg>`,
    mood: `<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="21" fill="#ffd76a"/><path d="M24 28h.1M40 28h.1" stroke="#223a2f" stroke-width="6" stroke-linecap="round"/><path d="M24 39c4.5 4.2 11.5 4.2 16 0" fill="none" stroke="#223a2f" stroke-width="3.2" stroke-linecap="round"/><path d="M41 12c4 1 7 3 9 7" fill="none" stroke="#ff9b5f" stroke-width="4" stroke-linecap="round"/></svg>`,
    collapseFace: `<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="21" fill="#d6d8d5"/><path d="M22 26c4-4 8-4 11 0M31 26c-4-4-8-4-11 0M37 26c4-4 8-4 11 0M46 26c-4-4-8-4-11 0" fill="none" stroke="#68716d" stroke-width="2.6" stroke-linecap="round"/><path d="M24 43c4-7 12-7 16 0" fill="none" stroke="#223a2f" stroke-width="3.2" stroke-linecap="round"/></svg>`
  };
  return `<span class="app-icon ${extraClass}">${icons[name] || icons.brand}</span>`;
}

function img(src, className, alt = "") {
  const cleanSrc = src.split("?v=")[0];
  return `<img class="${className}" src="${src}" alt="${alt}" draggable="false" onerror="this.src='${cleanSrc}';this.onerror=null;" />`;
}

function designEmoji(mark, className = "design-emoji") {
  return `<span class="${className}" aria-hidden="true">${mark}</span>`;
}

function safeParse(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function dateKey(offset = 0) {
  const d = new Date(Date.now() + offset * MS_PER_DAY);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function displayDate(key) {
  if (key === dateKey()) return "今天";
  if (key === dateKey(-1)) return "昨天";
  return key.slice(5);
}

function displayTime(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "刚刚";
  if (Date.now() - d.getTime() < 60 * 1000) return "刚刚";
  if (Date.now() - d.getTime() < MS_PER_DAY) return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  return `${Math.max(1, Math.round((Date.now() - d.getTime()) / MS_PER_DAY))}天前`;
}

function currentMonthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function normalizeWeatherKey(key) {
  return weatherMeta[key] ? key : "default";
}

function weatherFromRecord(record = {}) {
  if (moodStates[record.weatherKey]) return record.weatherKey;
  if (record.label === "崩溃" || record.label === "红色暴雨预警") return "storm";
  const moodKey = record.moodKey || record.mood || "ok";
  return moods[moodKey]?.weatherKey || "cloudy";
}

function moodStateForWeather(weatherKey) {
  return moodStates[weatherKey] || moodStates.cloudy;
}

function createRecord({ type = "mood", moodKey = "ok", score, label, weatherKey, createdAt = new Date().toISOString() }) {
  const mood = moods[moodKey] || moods.ok;
  const resolvedWeather = weatherKey || mood.weatherKey;
  const moodState = moodStateForWeather(resolvedWeather);
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type,
    date: createdAt.slice(0, 10),
    moodKey: moodState.moodKey,
    moodValue: resolvedWeather === "storm" ? 0 : mood.value,
    label: label || moodState.label,
    iconAsset: moodState.assetKey,
    weatherKey: resolvedWeather,
    score,
    createdAt
  };
}

function seedRecords() {
  return [
    createRecord({ moodKey: "good", createdAt: new Date().toISOString() }),
    createRecord({ moodKey: "ok", createdAt: new Date(Date.now() - MS_PER_DAY).toISOString() }),
    createRecord({ moodKey: "hard", createdAt: new Date(Date.now() - 2 * MS_PER_DAY).toISOString() }),
    createRecord({ moodKey: "hard", label: "崩溃", weatherKey: "storm", createdAt: new Date(Date.now() - 3 * MS_PER_DAY).toISOString() })
  ];
}

function normalizeRecords(records) {
  if (!Array.isArray(records) || !records.length) return seedRecords();
  return records.map((record) => {
    const weatherKey = weatherFromRecord(record);
    const moodState = moodStateForWeather(weatherKey);
    const moodKey = record.moodKey || record.mood || "ok";
    return {
      ...record,
      moodKey: moodState.moodKey || moodKey,
      moodValue: weatherKey === "storm" ? 0 : (moods[moodState.moodKey]?.value ?? record.moodValue ?? 1),
      label: moodState.label,
      iconAsset: moodState.assetKey,
      weatherKey
    };
  });
}

const storedRecords = safeParse(STORAGE.records, null);
const storedWeatherKey = localStorage.getItem(STORAGE.lastWeatherKey) || "default";
const hasStoredRecords = Array.isArray(storedRecords) && storedRecords.length > 0;
const initialWeatherKey = hasStoredRecords && weatherMeta[storedWeatherKey] ? storedWeatherKey : "default";

const state = {
  page: "home",
  records: normalizeRecords(storedRecords),
  paid: safeParse(STORAGE.paid, { trendUnlocked: false, lifetime: false }),
  testUses: safeParse(STORAGE.testUses, { monthKey: currentMonthKey(), count: 0 }),
  events: safeParse(STORAGE.events, []),
  answers: [],
  lastWeatherKey: initialWeatherKey,
  lastResultSource: null,
  lastReportScore: null,
  previousPageBeforePay: null,
  previousWeatherKeyBeforePay: null
};

if (state.testUses.monthKey !== currentMonthKey()) state.testUses = { monthKey: currentMonthKey(), count: 0 };
if (!weatherMeta[state.lastWeatherKey]) state.lastWeatherKey = "default";

function persist() {
  localStorage.setItem(STORAGE.records, JSON.stringify(state.records));
  localStorage.setItem(STORAGE.paid, JSON.stringify(state.paid));
  localStorage.setItem(STORAGE.testUses, JSON.stringify(state.testUses));
  localStorage.setItem(STORAGE.events, JSON.stringify(state.events.slice(-120)));
  localStorage.setItem(STORAGE.lastWeatherKey, state.lastWeatherKey);
}

function track(name, payload = {}) {
  state.events.push({ name, payload, createdAt: new Date().toISOString() });
  persist();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1700);
}

function hasPaidAccess() {
  return state.paid.lifetime || state.paid.trendUnlocked;
}

function setScreen(className = "") {
  app.className = `screen ${className}`.trim();
  app.removeAttribute("style");
  const shell = document.querySelector(".phone-shell");
  if (shell) {
    const shellKey = className.includes("question-screen") ? "question"
      : className.includes("test-intro-screen") ? "testIntro"
      : className.includes("archive-screen") ? "archive"
      : className.includes("result-screen") ? "result"
      : className.includes("home-frame-rain") ? "homeRain"
      : "homeWide";
    shell.className = `phone-shell ${PAGE_SPECS[shellKey].shell}`;
  }
  window.scrollTo(0, 0);
}

function topbar() {
  return `<div class="topbar">
    <div class="avatar">${img(ASSET.avatar, "asset-img", "头像")}</div>
    <div class="date">6月1日星期一<br>下午好</div>
  </div>`;
}

function brand() {
  return `<div class="brand"><h1>${icon("brand", "brand-icon")}<span>心情气象台</span></h1><p>“你的情绪天气预报”</p></div>`;
}

function card(title, body, className = "") {
  return `<section class="card ${className}">${title ? `<h2 class="section-title">${title}</h2>` : ""}${body}</section>`;
}

function renderHome() {
  state.page = "home";
  const weatherKey = normalizeWeatherKey(state.lastWeatherKey);
  const meta = weatherMeta[weatherKey] || weatherMeta.default;
  const spec = HOME_SPECS[weatherKey] || HOME_SPECS.default;
  setScreen(`home-screen ${meta.theme} ${spec.layout} ${spec.frame}`);
  app.style.setProperty("--home-canvas-height", `${spec.canvasHeight}px`);
  app.innerHTML = `
    ${topbar()}
    ${brand()}
    ${weatherKey === "default" ? homeMoodChooser() : homeWeatherCard(meta, weatherKey)}
    ${detectCard()}
    ${recentCard()}
  `;
}

function homeMoodChooser() {
  return `<section class="card home-mood-card">
    <div class="mood-select-row">
      ${moodPick("good")}
      ${moodPick("ok")}
      ${moodPick("hard")}
    </div>
    <p class="mood-prompt">“今天心情怎么样？选择一个记录一下吧！”</p>
  </section>`;
}

function moodPick(key) {
  const mood = moods[key];
  return `<button class="mood-pick" data-mood="${key}" aria-label="选择${mood.label}">
    ${img(ASSET[key], "mood-pick-img", mood.label)}
    <b>${mood.label}</b>
    <span>${mood.homeWeather}</span>
  </button>`;
}

function homeWeatherCard(meta, weatherKey) {
  return `${img(meta.art, `home-weather-art home-weather-art-${weatherKey}`, meta.homeTitle)}
  <section class="card home-weather-card ${meta.theme}">
    <p class="eyebrow">当前心情天气</p>
    <h2 class="weather-title">${meta.homeTitle}</h2>
    <div class="quote">“${meta.quote}”</div>
    <button class="link-button large-tap" data-action="choose">重新选择心情</button>
  </section>`;
}

function detectCard() {
  return `<section class="card detect-card">
    <div class="module-head">
      <div class="icon-box">${img(ASSET.gameIcon, "asset-img", "气象探测")}</div>
      <div><h2>情绪深度气象探测</h2><p>6个有趣问题 · 生成完整报告</p></div>
    </div>
    <button class="primary" data-action="test">点击开启 →</button>
  </section>`;
}

function recentCard() {
  return `<section class="card archive-card">
    <div class="module-head compact">
      <div class="small-line-icon">${icon("archive")}</div>
      <h2>最近心情</h2>
    </div>
    ${state.records.slice(0, 4).map(recordRow).join("")}
    <button class="row-link" data-action="archive"><span>查看完整档案</span><span>›</span></button>
  </section>`;
}

function recordRow(record) {
  const weatherKey = weatherFromRecord(record);
  const moodState = moodStateForWeather(weatherKey);
  const label = moodState.label;
  const assetKey = moodState.assetKey;
  return `<div class="record-row">
    <div class="record-emoji">${img(ASSET[assetKey] || ASSET.ok, "asset-img", label)}</div>
    <div class="record-copy">
      <div class="record-title">${displayDate(record.date)} <span>${label}</span></div>
      <div class="record-sub">已记录情绪天气${typeof record.score === "number" ? ` · ${record.score}/12` : ""}</div>
    </div>
    <div class="record-time">${displayTime(record.createdAt)}</div>
  </div>`;
}

function renderMoodResult(key) {
  const mood = moods[key] || moods.ok;
  state.lastWeatherKey = mood.weatherKey;
  state.lastResultSource = "mood";
  track("result_view", { moodKey: key, weatherKey: mood.weatherKey });
  persist();
  renderMoodSnapshotResult(key);
}

function renderMoodSnapshotResult(key) {
  state.page = "moodResult";
  const mood = moods[key] || moods.ok;
  const meta = weatherMeta[mood.weatherKey] || weatherMeta.cloudy;
  setScreen(`result-screen mood-result-screen ${meta.theme}`);
  app.innerHTML = `
    <h1 class="result-heading">今日心情</h1>
    <section class="result-hero mood-result-hero">
      ${img(ASSET[key], "result-art mood-result-art", mood.label)}
      <h2>${mood.resultName}</h2>
      <p>“${mood.feedback}”</p>
    </section>
    ${card("治愈话语", `<p class="mood-result-quote">“${mood.quote}”</p>`, "mood-quote-card")}
    ${card(`${icon("doc", "title-icon")}今日可以试试这些:`, adviceList(mood.advice, "mood_result"), "advice-card")}
    ${trendCard(false, "mood_result")}
    <div class="bottom-actions">
      <button class="secondary square-action" data-action="test">${icon("bolt", "button-icon")}做一次深度测评</button>
      <button class="secondary square-action" data-action="home">${icon("home", "button-icon")}返回首页</button>
    </div>
  `;
}

function renderResult(weatherKey, adviceSource, score) {
  state.page = "testReport";
  state.lastReportScore = typeof score === "number" ? score : state.lastReportScore;
  const meta = weatherMeta[weatherKey] || weatherMeta.cloudy;
  const advice = meta.advice || moods[meta.moodKey]?.advice || moods.ok.advice;
  const scoreText = typeof score === "number" ? `气象指数: ${score}/12` : meta.scoreText;
  setScreen(`result-screen ${meta.theme}`);
  app.innerHTML = `
    <h1 class="result-heading">今日预报</h1>
    <section class="result-hero">
      ${img(meta.resultArt, "result-art", meta.resultTitle)}
      <h2>${meta.resultTitle}</h2>
      <p>“${meta.reportQuote}”</p>
      <div class="score-pill">${scoreText}</div>
    </section>
    ${qualityCard(meta)}
    ${card(`${icon("doc", "title-icon")}今日可以试试这些:`, adviceList(advice, adviceSource), "advice-card")}
    ${trendCard(false, adviceSource)}
    <p class="report-saved-note">本次记录已存入观测档案</p>
    <div class="bottom-actions">
      <button class="secondary square-action" data-action="home">${icon("home", "button-icon")}返回首页</button>
      <button class="secondary square-action" data-action="archive">${icon("doc", "button-icon")}查看档案</button>
    </div>
  `;
}

function qualityCard(meta) {
  const quality = meta.quality || weatherMeta.cloudy.quality;
  const items = [
    { svg: designEmoji("😊", "design-emoji quality-emoji"), label: "情绪", value: quality[0] },
    { svg: designEmoji("⚡", "design-emoji quality-emoji"), label: "能量", value: quality[1] },
    { svg: designEmoji("🌈", "design-emoji quality-emoji"), label: "状态", value: quality[2] }
  ];
  return card("气象质量", `<div class="quality-grid">${items.map((item) => `<div class="quality-item">
    <div class="quality-icon">${item.svg}</div>
    <span>${item.label}</span><b>${item.value}</b>
  </div>`).join("")}</div>`, "quality-card");
}

function adviceList(items, source) {
  return `<div class="advice-list">${items.map((item, index) => `<button class="check-item" data-action="check" data-source="${source}" data-index="${index}">
    <span class="box" aria-hidden="true"></span><span class="advice-text">${item}</span>
  </button>`).join("")}</div>`;
}

function trendCard(paid = false, source = "trend") {
  return card(`${icon("chart", "title-icon")}近期情绪走势 <span class="free-note">${paid ? "近30天" : "免费用户显示最近7天"}</span>`,
    `${chartSvg(recentValues(paid ? 30 : 7), paid)}
    ${paid ? `<div class="unlock-note">已解锁全部记录及走势</div>` : `<button class="trend-lock tap-card" data-action="pay" data-pay-source="${source}">${icon("lock", "lock-icon")}<span class="lock-copy">解锁全部记录及走势</span><span class="primary small-primary">解锁完整走势及专属情绪报告 → 9.9元</span></button>`}`,
    "trend-card");
}

function recentValues(days) {
  const valuesByDate = new Map();
  state.records.forEach((record) => {
    if (!valuesByDate.has(record.date)) valuesByDate.set(record.date, record.moodValue);
  });
  return Array.from({ length: days }, (_, index) => {
    const key = dateKey(index - days + 1);
    return valuesByDate.has(key) ? valuesByDate.get(key) : 1;
  });
}

function chartSvg(values, paid = false) {
  const width = 306;
  const height = 174;
  const plotLeft = 24;
  const plotRight = 270;
  const step = (plotRight - plotLeft) / Math.max(values.length - 1, 1);
  const coords = values.map((v, i) => ({ x: plotLeft + i * step, y: 120 - v * 36 }));
  const path = coords.reduce((d, point, index) => {
    if (index === 0) return `M${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
    const prev = coords[index - 1];
    const midX = (prev.x + point.x) / 2;
    return `${d} C${midX.toFixed(1)} ${prev.y.toFixed(1)} ${midX.toFixed(1)} ${point.y.toFixed(1)} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
  }, "");
  const dotIndexes = paid
    ? coords.map((_, index) => index).filter((index) => index === 0 || index === coords.length - 1 || index >= coords.length - 4)
    : coords.map((_, index) => index);
  const week = ["周一", "周二", "周三", "周四", "周五", "周六", "今天"];
  const labelIndexes = values.length === 7 ? coords.map((_, i) => i) : [0, 5, 10, 15, 20, 25, 29].filter((i) => i < coords.length);
  return `<svg class="chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="情绪走势折线图">
    <rect x="0" y="0" width="${width}" height="${height}" fill="#e8f8ec"/>
    <path d="M20 40H286M20 82H286M20 124H286" stroke="#d9efdf" stroke-dasharray="3 5"/>
    <path d="${path}" fill="none" stroke="#58c978" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    ${dotIndexes.map((index) => `<circle cx="${coords[index].x.toFixed(1)}" cy="${coords[index].y.toFixed(1)}" r="${paid ? 6 : 6}" fill="#fff" stroke="#58c978" stroke-width="4"/>`).join("")}
    ${paid ? "" : `<defs><filter id="chartBlur"><feGaussianBlur stdDeviation="4"/></filter></defs><rect x="0" y="128" width="${width}" height="46" fill="#eff8ef" opacity=".8" filter="url(#chartBlur)"/>`}
    <g class="chart-axis"><text x="286" y="42">好</text><text x="286" y="84">中</text><text x="286" y="126">差</text></g>
    <g class="chart-days">${labelIndexes.map((index, i) => `<text x="${coords[index].x.toFixed(1)}" y="154" text-anchor="middle">${values.length === 7 ? week[i] : `${index + 1}`}</text>`).join("")}</g>
  </svg>`;
}

function renderTestIntro() {
  state.page = "testIntro";
  if (state.testUses.count >= 3 && !state.paid.lifetime) {
    track("test_limit_pay_prompt", { count: state.testUses.count });
    renderHome();
    renderPay("本月免费次数已用完", "本月还剩0次，解锁后可继续完成情绪深度气象探测。", "test-limit");
    return;
  }
  setScreen("test-intro-screen");
  app.innerHTML = `
    ${img(ASSET.testStar, "star-mark", "星光")}
    <h1 class="test-title">欢迎来到<br>心情气象探测中心</h1>
    <div class="spark-row"><span></span><span></span><span></span></div>
    <section class="test-intro-card">
      <p>接下来的<span>6个问题</span>，<br>就像翻看6张生活抓拍照。<br>没有对错，只有你最真实的感受。</p>
      <div class="divider"></div>
      <h2>完成后你将获得:</h2>
      <div class="benefit-list">
        <div>${designEmoji("☀️", "design-emoji benefit-emoji")}专属情绪气象报告</div>
        <div>${designEmoji("📖", "design-emoji benefit-emoji")}治愈避风港指南</div>
        <div>${designEmoji("✨", "design-emoji benefit-emoji")}6个生活化问题</div>
      </div>
    </section>
    <button class="primary intro-primary" data-action="start-test">开始探测 →</button>
    <button class="plain-back" data-action="home">← 返回首页</button>
  `;
}

function renderQuestion(index = 0) {
  state.page = "testQuestion";
  const item = questions[index];
  setScreen("question-screen");
  app.innerHTML = `
    <button class="question-back" data-action="test">← 返回</button>
    <div class="question-progress-label"><span>第 ${index + 1} 题</span><span>共 6 题</span></div>
    <div class="progress"><div class="bar" style="width:${((index + 1) / questions.length) * 100}%"></div></div>
    <p class="question-kicker">${item.title}</p>
    <h1 class="question-title">${item.question}</h1>
    <div class="option-list">${item.options.map((option) => `<button class="option-card" data-score="${option.score}" data-index="${index}">
      <span class="option-icon question-emoji">${option.mark}</span>
      <span>${option.text}</span>
    </button>`).join("")}</div>
    ${index > 0 ? `<button class="question-prev" data-action="prev-question" data-prev-index="${index - 1}">← 上一题</button>` : ""}
  `;
}

function renderReport() {
  const score = state.answers.reduce((sum, n) => sum + n, 0);
  const level = levels.find((item) => score <= item.max) || levels[1];
  state.page = "testReport";
  state.lastWeatherKey = level.key;
  state.lastResultSource = "test";
  state.testUses.count += 1;
  state.records.unshift(createRecord({
    type: "test",
    moodKey: level.moodKey,
    score,
    label: moodStateForWeather(level.key).label,
    weatherKey: level.key
  }));
  persist();
  track("test_complete", { score, level: level.name, weatherKey: level.key });
  renderResult(level.key, "test_report", score);
}

function renderArchive() {
  state.page = "archive";
  const paid = hasPaidAccess();
  const visibleRecords = paid ? state.records : state.records.slice(0, 3);
  track("archive_view", { paid });
  setScreen("archive-screen");
  app.innerHTML = `
    <button class="archive-back" data-action="home">← 返回</button>
    <h1 class="archive-title">气象台观测档案</h1>
    <p class="archive-subtitle">你的情绪记录与走势</p>
    <div class="stat-row">
      <div class="stat-card">${designEmoji("📊", "design-emoji stat-emoji")}<span>记录天数</span><b>${Math.min(30, state.records.length)}天</b></div>
      <div class="stat-card">${designEmoji("😊", "design-emoji stat-emoji")}<span>好心情</span><b>${goodRate()}%</b></div>
      <div class="stat-card">${designEmoji("🔥", "design-emoji stat-emoji")}<span>连续记录</span><b>${streakCount()}天</b></div>
    </div>
    ${trendCard(paid, "archive-trend")}
    ${card(`${icon("doc", "title-icon")}历史记录`, `${visibleRecords.map(recordRow).join("")}${paid ? "" : `<button class="history-lock tap-card" data-action="pay" data-pay-source="archive-history">${icon("lock", "lock-icon")}<span class="lock-copy">解锁全部记录及走势</span><span class="primary small-primary">解锁完整走势及专属情绪报告 → 9.9元</span></button>`}`, "history-card")}
    ${lifetimeCard()}
  `;
}

function goodRate() {
  if (!state.records.length) return 43;
  const good = state.records.filter((record) => record.moodKey === "good").length;
  return Math.round((good / state.records.length) * 100);
}

function lifetimeCard() {
  return `<section class="lifetime-card">
    <h2>${icon("doc", "title-icon")}永久打包优惠</h2>
    <p>解锁全部功能，记录你的每一次心情</p>
    <ul><li>无限次深度测评</li><li>30天完整情绪走势图及测评报告</li><li>全部历史记录查看</li><li>未来功能免费更新</li></ul>
    <button class="lifetime-button" data-action="pay" data-pay-source="archive-lifetime">仅需 19.9元 · 永久解锁</button>
  </section>`;
}

function renderPay(title = "解锁完整情绪报告", text = "你的每一次记录，都在画一条属于你的情绪线。", source = "generic") {
  state.previousPageBeforePay = state.page;
  state.previousWeatherKeyBeforePay = state.lastWeatherKey;
  state.page = "payModal";
  track("pay_entry_click", { source });
  const oldModal = app.querySelector(".modal");
  if (oldModal) oldModal.remove();
  app.insertAdjacentHTML("beforeend", `
    <div class="modal" data-action="close-pay">
      <div class="modal-panel" role="dialog" aria-modal="true" aria-label="${title}">
        <h3>${title}</h3>
        <p>${text}</p>
        <div class="benefits">
          <span>30天完整情绪走势图</span>
          <span>低谷/高峰日期标注</span>
          <span>全部历史记录</span>
          <span>个性化建议分析</span>
        </div>
        <div class="price-grid">
          <button class="price" data-action="buy-99"><b>9.9元</b><span>解锁走势和历史</span></button>
          <button class="price" data-action="buy-199"><b>19.9元</b><span>永久打包全部功能</span></button>
        </div>
        <button class="secondary modal-close" data-action="close-pay">稍后再说</button>
      </div>
    </div>
  `);
}

function saveMood(key) {
  const mood = moods[key] || moods.ok;
  state.lastWeatherKey = mood.weatherKey;
  state.lastResultSource = "mood";
  state.records.unshift(createRecord({ type: "mood", moodKey: key, label: mood.label, weatherKey: mood.weatherKey }));
  track("mood_click", { moodKey: key, moodValue: mood.value, weatherKey: mood.weatherKey });
  persist();
  if (navigator.vibrate) navigator.vibrate(18);
  renderMoodResult(key);
  maybePromptStreak();
}

function streakCount() {
  const days = new Set(state.records.map((record) => record.date));
  let count = 0;
  for (let offset = 0; offset > -60; offset -= 1) {
    if (!days.has(dateKey(offset))) break;
    count += 1;
  }
  return count;
}

function maybePromptStreak() {
  const prompted = localStorage.getItem(STORAGE.streakPrompted) === "1";
  if (streakCount() >= 7 && !prompted && !hasPaidAccess()) {
    localStorage.setItem(STORAGE.streakPrompted, "1");
    window.setTimeout(() => renderPay("恭喜连续7天记录！", "你的专属情绪报告已可生成，解锁完整走势图仅需9.9元。", "seven-day-streak"), 500);
  }
}

function restoreAfterPayClose() {
  const page = state.previousPageBeforePay || "home";
  state.page = page;
  if (page === "archive") renderArchive();
  else if (page === "moodResult") {
    const weatherKey = state.previousWeatherKeyBeforePay || state.lastWeatherKey;
    renderMoodSnapshotResult(weatherMeta[weatherKey]?.moodKey || "ok");
  } else if (page === "testReport") {
    renderResult(state.previousWeatherKeyBeforePay || state.lastWeatherKey, "test_report", state.lastReportScore);
  }
  else renderHome();
}

app.addEventListener("click", (event) => {
  const target = event.target.closest("button, [data-action]");
  if (!target) return;
  const action = target.dataset.action;

  if (action === "close-pay" && target.classList.contains("modal") && event.target.closest(".modal-panel")) return;

  if (target.dataset.mood) {
    saveMood(target.dataset.mood);
    return;
  }

  if (target.dataset.score) {
    const index = Number(target.dataset.index);
    state.answers[index] = Number(target.dataset.score);
    index + 1 >= questions.length ? renderReport() : renderQuestion(index + 1);
    return;
  }

  if (action === "choose") {
    state.lastWeatherKey = "default";
    persist();
    renderHome();
    return;
  }
  if (action === "home") {
    renderHome();
    return;
  }
  if (action === "test") {
    renderTestIntro();
    return;
  }
  if (action === "archive") {
    renderArchive();
    return;
  }
  if (action === "start-test") {
    state.answers = [];
    track("test_start", { remainingFreeUses: Math.max(0, 3 - state.testUses.count) });
    renderQuestion(0);
    return;
  }
  if (action === "prev-question") {
    const prev = Number(target.dataset.prevIndex || 0);
    state.answers = state.answers.slice(0, Math.max(0, prev + 1));
    renderQuestion(prev);
    return;
  }
  if (action === "check") {
    target.classList.toggle("done");
    track("advice_check", {
      source: target.dataset.source,
      index: Number(target.dataset.index),
      done: target.classList.contains("done")
    });
    showToast(target.classList.contains("done") ? "已打勾，给自己一点确定感" : "已取消");
    return;
  }
  if (action === "pay") {
    renderPay(undefined, undefined, target.dataset.paySource || "generic");
    return;
  }
  if (action === "close-pay") {
    const modal = app.querySelector(".modal");
    if (modal) modal.remove();
    restoreAfterPayClose();
    return;
  }
  if (action === "buy-99" || action === "buy-199") {
    state.paid.trendUnlocked = true;
    if (action === "buy-199") state.paid.lifetime = true;
    track("pay_success", { product: action === "buy-99" ? "trend_9_9" : "lifetime_19_9" });
    persist();
    const modal = app.querySelector(".modal");
    if (modal) modal.remove();
    showToast("已解锁完整档案");
    restoreAfterPayClose();
  }
});

persist();
renderHome();
