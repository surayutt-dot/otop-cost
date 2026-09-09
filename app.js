// ==========================================================================
// แข่งขันสมุดทำมือ 7 ทีม (7-Team Craft Notebook Tycoon)
// ระบบจำลองธุรกิจ & แข่งขันคิดราคาต้นทุน-กำไร แบบ Live Multiplayer (Kahoot-style)
// ==========================================================================

const NOTEBOOK_CONFIG = {
    name: "สมุดทำมือชุมชนบ้านโมกุล",
    unit: "เล่ม",
    defaultPrice: 89,
    idealPriceBase: 85,
    laborCost: 15,
    materials: {
        paper: { id: "paper", name: "กระดาษถนอมสายตา", unit: "แผ่น", basePrice: 0.40, defaultStock: 300, stepBuy: 50, defaultRecipe: 60, minRec: 30, maxRec: 100, stepRec: 5 },
        cover: { id: "cover", name: "ปกแข็งผ้าทอพื้นเมือง", unit: "ปก", basePrice: 16, defaultStock: 25, stepBuy: 5, defaultRecipe: 1, minRec: 1, maxRec: 1, stepRec: 1 },
        binding: { id: "binding", name: "ด้ายเย็บกี่ & อุปกรณ์เข้าเล่ม", unit: "ชุด", basePrice: 7, defaultStock: 30, stepBuy: 5, defaultRecipe: 1, minRec: 1, maxRec: 1, stepRec: 1 }
    }
};

const TEAMS_SEED = [
    { id: "team1", name: "ทีม 1: ลายผ้าทอโมกุล" },
    { id: "team2", name: "ทีม 2: ใบตองคราฟต์" },
    { id: "team3", name: "ทีม 3: มนต์เสน่ห์โมกุล" },
    { id: "team4", name: "ทีม 4: สมุดดินเผา" },
    { id: "team5", name: "ทีม 5: เชือกป่านทอง" },
    { id: "team6", name: "ทีม 6: กระดาษสาแสงตะวัน" },
    { id: "team7", name: "ทีม 7: มงคลหัตถศิลป์" }
];

const dailyEvents = [
    {
        title: "📖 เปิดตัวสมุดทำมือเอกลักษณ์ชุมชนวันแรก (วันฟ้าใส)",
        desc: "อากาศแจ่มใส ช่างฝีมือทุกทีมร่วมเปิดตัวสินค้า มีลูกค้าสัญจรและผู้มาศึกษาดูงานแวะชมงานหัตถศิลป์ เป็นวันที่ดีในการทดสอบความหนาและตั้งราคาขาย!",
        icon: "☀️",
        demandMod: 1.0,
        priceMod: 1.0
    },
    {
        title: "🌧️ ฝนตกหนัก บรรยากาศเงียบสงบเหมาะกับการเขียนบันทึก",
        desc: "ฝนตกตลอดทั้งวัน ลูกค้าหน้าร้านลดลง 25% แต่คนหันมาสั่งซื้อผ่านแชทและสั่งเป็นของขวัญส่งทางพัสดุมากขึ้น ทีมที่เลือกโปรโมทออนไลน์จะได้เปรียบ!",
        icon: "⛈️",
        demandMod: 0.75,
        priceMod: 1.05
    },
    {
        title: "📉 วิกฤตราคาเยื่อกระดาษในตลาดพุ่งสูงขึ้น",
        desc: "ราคาวัตถุดิบกระดาษวันนี้พุ่งขึ้น 40%! ทุกทีมต้องคำนวณต้นทุนต่อเล่มใหม่และปรับราคาขายให้เหมาะสมเพื่อรักษาผลกำไร ไม่ให้ขาดทุน",
        icon: "⚠️",
        demandMod: 1.0,
        priceMod: 1.0,
        paperPriceMult: 1.4
    },
    {
        title: "🚌 คณะศึกษาดูงานและหน่วยงานราชการสั่งเป็นของที่ระลึก",
        desc: "มีคณะศึกษาดูงานและโรงเรียนเข้ามาสั่งซื้อสมุดทำมือไปเป็นของขวัญของที่ระลึก ความต้องการพุ่งขึ้น 75%! ทีมที่มีสต็อกพร้อมจะได้ยอดขายมหาศาล",
        icon: "🚌",
        demandMod: 1.75,
        priceMod: 1.15
    },
    {
        title: "⭐ สมุดทำมือได้รับรองมาตรฐาน OTOP 4 ดาว & มผช.",
        desc: "ความภาคภูมิใจของชุมชน! สินค้าผ่านการรับรองมาตรฐาน ลูกค้าเชื่อมั่นในความประณีต ยินดีสนับสนุนในราคาพรีเมียม",
        icon: "🏆",
        demandMod: 1.35,
        priceMod: 1.25,
        repBonus: 8
    },
    {
        title: "🏭 สมุดโรงงานพิมพ์ลายราคาถูกเข้ามาตีตลาด",
        desc: "มีสมุดสำเร็จรูปราคาถูกจากภายนอกมาวางจำหน่ายแข่งขัน ทีมที่เน้นความประณีตและการเย็บมือที่กางได้ 180 องศา จะยังรักษาฐานลูกค้าไว้ได้!",
        icon: "⚔️",
        demandMod: 0.85,
        priceMod: 0.9
    },
    {
        title: "🎪 มหกรรมงานสัปดาห์หนังสือและงานคราฟต์จังหวัดวันสุดท้าย",
        desc: "วันปิดงานมหกรรมสุดยิ่งใหญ่ ผู้คนหลั่งไหลมาหาซื้อสมุดบันทึกและของฝากติดไม้ติดมือกลับบ้าน ยอดขายพุ่งสูงสุด มาทำยอดขายส่งท้ายเพื่อชิงแชมป์!",
        icon: "🎉",
        demandMod: 2.0,
        priceMod: 1.2
    }
];

const MARKETING_CHANNELS = [
    { value: 0, name: "วางจำหน่ายหน้าศูนย์เรียนรู้ชุมชน (฿0)", mod: 1.0 },
    { value: 120, name: "ฝากวางขายร้านกาแฟ & ร้านของฝากประจำจังหวัด (฿120)", mod: 1.35 },
    { value: 350, name: "ออกบูธงานมหกรรม OTOP & เทศกาลงานคราฟต์ (฿350)", mod: 1.75 },
    { value: 600, name: "Live สด TikTok & เพจคนรักสมุดบันทึกออนไลน์ (฿600)", mod: 2.25 }
];

// Global State
let currentAppMode = "select"; // 'select', 'host', 'student', 'single'
let gameRound = {
    day: 1,
    activeTeamId: "team1",
    pricesToday: { paper: 0.40, cover: 16.0, binding: 7.0 },
    teams: []
};

// MQTT & Multiplayer State
let mqttClient = null;
let currentRoomPin = "";
let studentMyTeamId = "team1";
let studentMyTeamName = "";
let studentPlanSubmitted = false;

// Public WSS MQTT Brokers
const MQTT_BROKER_URLS = [
    "wss://broker.emqx.io:8084/mqtt",
    "wss://broker.hivemq.com:8884/mqtt"
];

// ==========================================
// Initial Setup & State Creators
// ==========================================
function createFreshTeams() {
    return TEAMS_SEED.map(seed => ({
        id: seed.id,
        name: seed.name,
        members: "",
        cash: 1500,
        reputation: 50,
        villageFund: 0,
        inventory: {
            paper: NOTEBOOK_CONFIG.materials.paper.defaultStock,
            cover: NOTEBOOK_CONFIG.materials.cover.defaultStock,
            binding: NOTEBOOK_CONFIG.materials.binding.defaultStock
        },
        purchases: { paper: 0, cover: 0, binding: 0 },
        recipe: { paper: NOTEBOOK_CONFIG.materials.paper.defaultRecipe },
        pricePerUnit: NOTEBOOK_CONFIG.defaultPrice,
        marketingChannel: 0,
        cumulativeProfit: 0,
        totalUnitsSold: 0,
        isConfirmed: false,
        isSubmitted: false,
        isConnected: false,
        lastResult: null
    }));
}

function initGameRound() {
    gameRound.day = 1;
    gameRound.activeTeamId = "team1";
    gameRound.teams = createFreshTeams();
    updatePricesForDay(1);
}

function updatePricesForDay(day) {
    const ev = dailyEvents[day - 1] || dailyEvents[0];
    const paperMult = ev.paperPriceMult || 1.0;
    gameRound.pricesToday = {
        paper: NOTEBOOK_CONFIG.materials.paper.basePrice * paperMult,
        cover: NOTEBOOK_CONFIG.materials.cover.basePrice,
        binding: NOTEBOOK_CONFIG.materials.binding.basePrice
    };
}

// ==========================================
// Mode Switching & Routing
// ==========================================
function switchModeView(mode) {
    currentAppMode = mode;
    document.getElementById("view-mode-select").classList.add("hide");
    document.getElementById("view-host").classList.add("hide");
    document.getElementById("view-student").classList.add("hide");
    document.getElementById("view-single").classList.add("hide");

    const roleBadge = document.getElementById("role-badge");
    const dayInd = document.getElementById("day-indicator");

    if (mode === "select") {
        document.getElementById("view-mode-select").classList.remove("hide");
        roleBadge.classList.add("hide");
        dayInd.classList.add("hide");
    } else if (mode === "host") {
        document.getElementById("view-host").classList.remove("hide");
        roleBadge.classList.remove("hide");
        roleBadge.textContent = "🖥️ จอกลางอาจารย์";
        dayInd.classList.remove("hide");
        dayInd.textContent = `📅 วันแข่งที่: ${gameRound.day} / 7`;
    } else if (mode === "student") {
        document.getElementById("view-student").classList.remove("hide");
        roleBadge.classList.remove("hide");
        roleBadge.textContent = "📱 โหมดมือถือนักเรียน";
        dayInd.classList.add("hide"); // Student has its own in-card day indicator
    } else if (mode === "single") {
        document.getElementById("view-single").classList.remove("hide");
        roleBadge.classList.remove("hide");
        roleBadge.textContent = "🕹️ เครื่องเดียว (ออฟไลน์)";
        dayInd.classList.remove("hide");
        dayInd.textContent = `📅 วันแข่งที่: ${gameRound.day} / 7`;
    }
}

// Global button handlers
function enterHostMode() {
    initGameRound();
    startHostLobby();
    switchModeView("host");
}

function enterStudentMode(prefilledPin) {
    switchModeView("student");
    document.getElementById("student-join-panel").classList.remove("hide");
    document.getElementById("student-waiting-panel").classList.add("hide");
    document.getElementById("student-prep-panel").classList.add("hide");
    document.getElementById("student-submitted-panel").classList.add("hide");
    document.getElementById("student-results-panel").classList.add("hide");

    if (prefilledPin) {
        const pinInput = document.getElementById("student-input-pin");
        if (pinInput) pinInput.value = prefilledPin;
    }
}

function enterSingleMode() {
    initGameRound();
    initSingleDay();
    switchModeView("single");
}

// ==========================================
// Simulation Calculation Engine
// ==========================================
function calculateUnitCost(recipePaper, prices) {
    const costPaper = recipePaper * prices.paper;
    const costCover = 1 * prices.cover;
    const costBinding = 1 * prices.binding;
    const costLabor = NOTEBOOK_CONFIG.laborCost;
    return {
        paper: costPaper,
        cover: costCover,
        binding: costBinding,
        labor: costLabor,
        total: costPaper + costCover + costBinding + costLabor
    };
}

function simulateDayForTeam(team, event, prices) {
    const purchaseCost = 
        (team.purchases.paper * prices.paper) +
        (team.purchases.cover * prices.cover) +
        (team.purchases.binding * prices.binding);

    // Apply purchases to inventory & cash
    team.inventory.paper += team.purchases.paper;
    team.inventory.cover += team.purchases.cover;
    team.inventory.binding += team.purchases.binding;
    team.cash -= purchaseCost;

    // Marketing
    const marketingCost = team.marketingChannel || 0;
    team.cash -= marketingCost;

    // Max production capacity based on inventory
    const paperReq = team.recipe.paper || 60;
    const maxByPaper = Math.floor(team.inventory.paper / paperReq);
    const maxByCover = team.inventory.cover;
    const maxByBinding = team.inventory.binding;
    const craftableUnits = Math.max(0, Math.min(maxByPaper, maxByCover, maxByBinding));

    // Calculate customer demand
    let baseDemand = 32;
    const mkt = MARKETING_CHANNELS.find(m => m.value === team.marketingChannel) || MARKETING_CHANNELS[0];
    baseDemand *= mkt.mod;

    // Reputation modifier
    const repMod = 0.5 + (team.reputation / 100);
    baseDemand *= repMod;

    // Price elasticity modifier
    const idealPrice = NOTEBOOK_CONFIG.idealPriceBase * (event.priceMod || 1.0);
    const priceDiff = team.pricePerUnit - idealPrice;
    let priceDemandMod = 1.0;
    if (priceDiff > 0) {
        priceDemandMod = Math.max(0.2, 1.0 - (priceDiff / 32));
    } else {
        priceDemandMod = Math.min(1.8, 1.0 + (Math.abs(priceDiff) / 45));
    }
    baseDemand *= priceDemandMod;

    // Thickness / Recipe satisfaction modifier
    if (team.recipe.paper >= 80) baseDemand *= 1.25;
    else if (team.recipe.paper <= 40) baseDemand *= 0.85;

    // Event modifier
    baseDemand *= (event.demandMod || 1.0);

    // Small random factor (95% to 105%)
    const randomFactor = 0.95 + Math.random() * 0.10;
    const finalDemand = Math.max(1, Math.round(baseDemand * randomFactor));

    // Sales realized
    const unitsSold = Math.min(craftableUnits, finalDemand);
    const ranOutOfStock = craftableUnits < finalDemand;

    // Consume inventory
    team.inventory.paper -= (unitsSold * paperReq);
    team.inventory.cover -= unitsSold;
    team.inventory.binding -= unitsSold;

    // Financials
    const revenue = unitsSold * team.pricePerUnit;
    const laborPaid = unitsSold * NOTEBOOK_CONFIG.laborCost;
    team.cash += revenue;

    // Profit calculation
    const unitCostData = calculateUnitCost(paperReq, prices);
    const grossMargin = (team.pricePerUnit - unitCostData.total) * unitsSold;
    
    // Community fund deduction (10% of positive operational gain)
    let villageFundDeduct = 0;
    if (grossMargin > 0) {
        villageFundDeduct = grossMargin * 0.10;
        team.villageFund += villageFundDeduct;
        team.cash -= villageFundDeduct;
    }

    const netProfit = revenue - purchaseCost - marketingCost - villageFundDeduct;
    team.cumulativeProfit += netProfit;
    team.totalUnitsSold += unitsSold;

    // Reputation adjustment
    if (ranOutOfStock) team.reputation = Math.max(10, team.reputation - 6);
    else team.reputation = Math.min(100, team.reputation + 4);

    if (event.repBonus) team.reputation = Math.min(100, team.reputation + event.repBonus);

    // Reset purchases
    team.purchases = { paper: 0, cover: 0, binding: 0 };
    team.isSubmitted = false;
    team.isConfirmed = false;

    const result = {
        demand: finalDemand,
        craftable: craftableUnits,
        unitsSold: unitsSold,
        ranOutOfStock: ranOutOfStock,
        revenue: revenue,
        purchaseCost: purchaseCost,
        marketingCost: marketingCost,
        villageFundDeduct: villageFundDeduct,
        laborPaid: laborPaid,
        netProfit: netProfit,
        unitCost: unitCostData.total
    };

    team.lastResult = result;
    return result;
}

function getTeamScore(team) {
    return team.cumulativeProfit + (team.villageFund * 0.5) + (team.reputation * 10);
}

// Generate customer feedback array for a team
function generateFeedbackLogs(team, res) {
    let logs = [];
    if (!res) return logs;

    if (res.unitsSold > 0) {
        if (team.recipe.paper >= 80) {
            logs.push({ text: `🌟 [${team.name}] สมุดหนา 80+ แผ่น เขียนจุใจ ลูกค้าและนักเรียนชอบมาก!`, class: "positive" });
        } else if (team.recipe.paper < 45) {
            logs.push({ text: `😞 [${team.name}] สมุดค่อนข้างบางไปนิด อยากให้เพิ่มจำนวนหน้า`, class: "negative" });
        } else {
            logs.push({ text: `📖 [${team.name}] ความหนากำลังดี งานเย็บกี่เปิดกางได้ 180 องศา ประทับใจ`, class: "" });
        }

        if (team.pricePerUnit > 105) {
            logs.push({ text: `💸 ราคาขาย ฿${team.pricePerUnit} ค่อนข้างสูงเมื่อเทียบกับร้านอื่น`, class: "negative" });
        } else if (team.pricePerUnit <= 75) {
            logs.push({ text: `❤️ ราคาเล่มละ ฿${team.pricePerUnit} คุ้มค่างานแฮนด์เมดชุมชนมาก`, class: "positive" });
        }

        logs.push({ text: `🤝 วันนี้กระจายค่าแรงงานฝีมือเย็บเล่มสู่ชุมชน รวม ฿${res.laborPaid.toFixed(2)} บาท`, class: "positive" });
    } else {
        logs.push({ text: `⚠️ วันนี้ขายไม่ได้เลย ลองปรับราคาขายหรือเตรียมสต็อกวัตถุดิบดูใหม่`, class: "negative" });
    }

    if (res.ranOutOfStock) {
        logs.push({ text: `⚠️ วัตถุดิบหมดสต็อกกลางคัน! เสียโอกาสขายให้ลูกค้าไปถึง ${res.demand - res.unitsSold} เล่ม`, class: "negative" });
    }

    return logs;
}

// ==========================================================================
// HOST CONTROLLER (ฝั่งจอกลางอาจารย์)
// ==========================================================================
function startHostLobby() {
    currentRoomPin = Math.floor(1000 + Math.random() * 9000).toString();

    document.getElementById("host-lobby-panel").classList.remove("hide");
    document.getElementById("host-round-panel").classList.add("hide");
    document.getElementById("host-results-panel").classList.add("hide");
    document.getElementById("host-gameover-panel").classList.add("hide");

    document.getElementById("host-pin-display").textContent = currentRoomPin;
    document.getElementById("host-live-pin").textContent = currentRoomPin;

    // Join URL for students
    const cleanUrl = window.location.origin + window.location.pathname;
    const joinUrl = `${cleanUrl}?pin=${currentRoomPin}`;
    document.getElementById("host-share-link").textContent = joinUrl;

    // Render QR Code
    const qrContainer = document.getElementById("host-qrcode");
    qrContainer.innerHTML = "";
    if (typeof QRCode !== "undefined") {
        try {
            new QRCode(qrContainer, {
                text: joinUrl,
                width: 170,
                height: 170,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.M
            });
        } catch (e) {
            console.warn("QRCode init error:", e);
        }
    }

    renderHostLobbyGrid();
    connectHostMqtt();
}

function copyHostJoinLink() {
    const text = document.getElementById("host-share-link").textContent;
    navigator.clipboard.writeText(text).then(() => {
        alert("📋 คัดลอกลิงก์เข้าร่วมห้องแข่งขันเรียบร้อยแล้ว!");
    }).catch(() => {
        prompt("คัดลอกลิงก์ด้านล่างนี้ได้เลยครับ:", text);
    });
}

function renderHostLobbyGrid() {
    const container = document.getElementById("host-lobby-grid");
    if (!container) return;
    container.innerHTML = "";

    let connectedCount = 0;
    gameRound.teams.forEach(team => {
        if (team.isConnected) connectedCount++;

        const card = document.createElement("div");
        card.className = `lobby-team-card ${team.isConnected ? "connected" : ""}`;
        card.innerHTML = `
            <h4 style="cursor: pointer;" title="คลิกเพื่อแก้ไขชื่อทีม" onclick="hostRenameTeam('${team.id}')">${team.name} ✏️</h4>
            <div class="lobby-team-status ${team.isConnected ? "connected" : "waiting"}">
                ${team.isConnected ? "🟢 เชื่อมต่อแล้ว" + (team.members ? `<br><small style="color:var(--text-muted);">สมาชิก: ${team.members}</small>` : "") : "⏳ รอเชื่อมต่อ..."}
            </div>
        `;
        container.appendChild(card);
    });

    const lbl = document.getElementById("host-connected-count");
    if (lbl) lbl.textContent = `เชื่อมต่อแล้ว: ${connectedCount} / 7 ทีม`;
}

function hostRenameTeam(teamId) {
    const t = gameRound.teams.find(x => x.id === teamId);
    if (!t) return;
    const newName = prompt(`แก้ไขชื่อทีม (${teamId}):`, t.name);
    if (newName && newName.trim()) {
        t.name = newName.trim();
        renderHostLobbyGrid();
        renderHostMonitorGrid();
    }
}

function connectHostMqtt() {
    if (mqttClient) {
        try { mqttClient.end(true); } catch (e) {}
    }

    if (typeof mqtt === "undefined") {
        console.warn("MQTT library not loaded. Running in local fallback.");
        return;
    }

    const brokerUrl = MQTT_BROKER_URLS[0];
    const clientId = `host_mokul_${currentRoomPin}_${Math.random().toString(16).substr(2, 6)}`;

    try {
        mqttClient = mqtt.connect(brokerUrl, {
            clientId: clientId,
            clean: true,
            connectTimeout: 7000,
            reconnectPeriod: 4000
        });

        mqttClient.on("connect", () => {
            console.log("Host MQTT Connected to", brokerUrl);
            mqttClient.subscribe(`mokul/${currentRoomPin}/join`);
            mqttClient.subscribe(`mokul/${currentRoomPin}/plan`);
        });

        mqttClient.on("message", (topic, message) => {
            try {
                const payload = JSON.parse(message.toString());
                handleHostIncomingMessage(topic, payload);
            } catch (err) {
                console.error("Host error parsing message:", err);
            }
        });

        mqttClient.on("error", (err) => {
            console.error("Host MQTT error:", err);
        });
    } catch (e) {
        console.error("Failed to connect host MQTT:", e);
    }
}

let hostCurrentPhase = "lobby";

function handleHostIncomingMessage(topic, data) {
    if (topic.endsWith("/join")) {
        // Student team joined or updated name or requested state
        const t = gameRound.teams.find(x => x.id === data.teamId);
        if (t) {
            t.isConnected = true;
            if (data.name && data.name.trim()) t.name = data.name.trim();
            if (data.members !== undefined) t.members = data.members.trim();
            renderHostLobbyGrid();
            renderHostMonitorGrid();

            // CRUCIAL FIX: If Host is already in round phase (e.g. Day 1), immediately re-send START_DAY to this team so they get Day 1 instantly!
            if (hostCurrentPhase === "round") {
                broadcastHostStartDay();
            }
        }
    } else if (topic.endsWith("/plan")) {
        // Student team submitted plan
        const t = gameRound.teams.find(x => x.id === data.teamId);
        if (t && data.plan) {
            t.isSubmitted = true;
            t.purchases = data.plan.buy || { paper: 0, cover: 0, binding: 0 };
            t.recipe = data.plan.recipe || { paper: 60 };
            t.pricePerUnit = Number(data.plan.pricePerUnit) || 89;
            t.marketingChannel = Number(data.plan.marketing) || 0;
            renderHostMonitorGrid();
        }
    }
}

function broadcastHostStartDay() {
    if (!mqttClient || !mqttClient.connected) return;
    const ev = dailyEvents[gameRound.day - 1] || dailyEvents[0];
    const payload = {
        action: "START_DAY",
        day: gameRound.day,
        event: ev,
        prices: gameRound.pricesToday,
        teamsState: gameRound.teams.map(t => ({
            id: t.id,
            name: t.name,
            cash: t.cash,
            reputation: t.reputation,
            villageFund: t.villageFund,
            inventory: t.inventory
        }))
    };
    // Publish with retain: true so any client that subscribes later immediately gets this Day!
    mqttClient.publish(`mokul/${currentRoomPin}/host`, JSON.stringify(payload), { retain: true, qos: 1 });
}

function hostStartDay() {
    hostCurrentPhase = "round";
    updatePricesForDay(gameRound.day);
    const ev = dailyEvents[gameRound.day - 1];

    document.getElementById("host-lobby-panel").classList.add("hide");
    document.getElementById("host-results-panel").classList.add("hide");
    document.getElementById("host-round-panel").classList.remove("hide");

    // Header info
    document.getElementById("host-day-tag").textContent = `📅 วันแข่งที่ ${gameRound.day} / 7`;
    const resyncDayEl = document.getElementById("host-resync-day");
    if (resyncDayEl) resyncDayEl.textContent = gameRound.day;
    document.getElementById("day-indicator").textContent = `📅 วันแข่งที่: ${gameRound.day} / 7`;

    // Event banner
    document.getElementById("host-event-icon").textContent = ev.icon;
    document.getElementById("host-event-title").textContent = ev.title;
    document.getElementById("host-event-desc").textContent = ev.desc;

    // Reset submitted states for the new round
    gameRound.teams.forEach(t => t.isSubmitted = false);
    renderHostMonitorGrid();

    // Broadcast round start with retain to all student mobile phones!
    broadcastHostStartDay();
}

function renderHostMonitorGrid() {
    const container = document.getElementById("host-monitor-grid");
    if (!container) return;
    container.innerHTML = "";

    let subCount = 0;
    gameRound.teams.forEach(team => {
        if (team.isSubmitted) subCount++;

        const card = document.createElement("div");
        card.className = `monitor-card ${team.isSubmitted ? "submitted" : ""}`;
        
        let buySummary = "";
        if (team.isSubmitted) {
            const bCost = (team.purchases.paper * gameRound.pricesToday.paper) +
                          (team.purchases.cover * gameRound.pricesToday.cover) +
                          (team.purchases.binding * gameRound.pricesToday.binding);
            buySummary = `ซื้อ ฿${Math.round(bCost)} | ขาย ฿${team.pricePerUnit}`;
        }

        card.innerHTML = `
            <div class="m-name">${team.name}</div>
            <div class="m-status ${team.isSubmitted ? "ready" : "waiting"}">
                ${team.isSubmitted ? `✅ ส่งแผนแล้ว` : `⏳ กำลังวางแผน...`}
            </div>
            ${buySummary ? `<div style="font-size: 0.82rem; color: var(--gold); margin-top: 4px;">${buySummary}</div>` : ""}
        `;
        container.appendChild(card);
    });

    const cnt = document.getElementById("host-submitted-count");
    if (cnt) cnt.textContent = subCount;
}

function hostSimulateDay() {
    const ev = dailyEvents[gameRound.day - 1];
    const prices = gameRound.pricesToday;

    // Simulate for all 7 teams
    const allResults = {};
    gameRound.teams.forEach(team => {
        // If team did not submit, provide reasonable AI default
        if (!team.isSubmitted) {
            team.purchases = { paper: 50, cover: 3, binding: 3 };
            team.recipe = { paper: 60 };
            team.pricePerUnit = 89;
            team.marketingChannel = 0;
        }

        const res = simulateDayForTeam(team, ev, prices);
        allResults[team.id] = {
            ...res,
            teamName: team.name,
            cash: team.cash,
            reputation: team.reputation,
            villageFund: team.villageFund,
            cumulativeProfit: team.cumulativeProfit,
            feedback: generateFeedbackLogs(team, res)
        };
    });

    // Sort leaderboard by score
    const sorted = [...gameRound.teams].sort((a, b) => getTeamScore(b) - getTeamScore(a));
    const leaderboardData = sorted.map((t, idx) => ({
        rank: idx + 1,
        teamId: t.id,
        name: t.name,
        netProfit: t.lastResult ? t.lastResult.netProfit : 0,
        cumulativeProfit: t.cumulativeProfit,
        cash: t.cash,
        totalUnitsSold: t.totalUnitsSold,
        villageFund: t.villageFund,
        reputation: t.reputation
    }));

    // Broadcast results to all student mobile phones!
    if (mqttClient && mqttClient.connected) {
        const payload = {
            action: "ROUND_RESULT",
            day: gameRound.day,
            results: allResults,
            leaderboard: leaderboardData
        };
        mqttClient.publish(`mokul/${currentRoomPin}/host`, JSON.stringify(payload));
    }

    // Render Host Results & Leaderboard
    document.getElementById("host-round-panel").classList.add("hide");
    document.getElementById("host-results-panel").classList.remove("hide");
    renderHostLeaderboard(sorted);

    // Default select top team for breakdown
    if (sorted[0]) {
        updateHostTeamDetailView(sorted[0].id);
    }
}

function renderHostLeaderboard(sortedTeams) {
    const tbody = document.getElementById("host-leaderboard-tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    sortedTeams.forEach((team, idx) => {
        const rank = idx + 1;
        const res = team.lastResult || {};
        const tr = document.createElement("tr");
        if (rank === 1) tr.className = "rank-1";
        else if (rank === 2) tr.className = "rank-2";
        else if (rank === 3) tr.className = "rank-3";

        let rankBadge = `<span class="rank-badge ${rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : 'normal'}">${rank}</span>`;

        tr.innerHTML = `
            <td>${rankBadge}</td>
            <td style="text-align: left; font-weight: 700; cursor: pointer; color: var(--gold);">
                ${team.name}
            </td>
            <td style="font-weight: 700; color: ${res.netProfit >= 0 ? 'var(--success)' : 'var(--danger)'};">
                ${res.netProfit >= 0 ? '+' : ''}฿${Math.round(res.netProfit || 0).toLocaleString()}
            </td>
            <td style="font-weight: 800; color: var(--gold);">฿${Math.round(team.cumulativeProfit).toLocaleString()}</td>
            <td>฿${Math.round(team.cash).toLocaleString()}</td>
            <td>${team.totalUnitsSold} เล่ม</td>
            <td style="color: var(--primary-light);">฿${Math.round(team.villageFund).toLocaleString()}</td>
            <td>${Math.round(team.reputation)}%</td>
        `;

        tr.onclick = () => updateHostTeamDetailView(team.id);
        tbody.appendChild(tr);
    });
}

function updateHostTeamDetailView(teamId) {
    const team = gameRound.teams.find(t => t.id === teamId);
    if (!team || !team.lastResult) return;
    const res = team.lastResult;

    document.getElementById("host-res-team-name").textContent = team.name;
    document.getElementById("host-res-demand").textContent = `${res.demand} คน`;
    document.getElementById("host-res-units").textContent = `${res.unitsSold} เล่ม`;
    document.getElementById("host-res-revenue").textContent = `+฿${res.revenue.toFixed(2)}`;
    document.getElementById("host-res-cost-purchases").textContent = `-฿${res.purchaseCost.toFixed(2)}`;
    document.getElementById("host-res-cost-marketing").textContent = `-฿${res.marketingCost.toFixed(2)}`;
    document.getElementById("host-res-village-fund").textContent = 
        res.villageFundDeduct > 0 ? `-฿${res.villageFundDeduct.toFixed(2)}` : "฿0.00";

    const elNet = document.getElementById("host-res-net-profit");
    elNet.textContent = (res.netProfit >= 0 ? "+" : "") + `฿${res.netProfit.toFixed(2)}`;
    elNet.style.color = res.netProfit >= 0 ? "var(--success)" : "var(--danger)";

    document.getElementById("host-res-stock-paper").textContent = `${team.inventory.paper} แผ่น`;
    document.getElementById("host-res-stock-cover").textContent = `${team.inventory.cover} ปก`;
    document.getElementById("host-res-stock-binding").textContent = `${team.inventory.binding} ชุด`;

    // Feedback logs
    const fbList = document.getElementById("host-customer-feedback");
    fbList.innerHTML = "";
    const logs = generateFeedbackLogs(team, res);
    logs.forEach(log => {
        const li = document.createElement("li");
        if (log.class) li.className = log.class;
        li.innerHTML = `<span>${log.text}</span>`;
        fbList.appendChild(li);
    });
}

function hostNextDay() {
    if (gameRound.day < 7) {
        gameRound.day++;
        hostStartDay();
    } else {
        hostEndGame();
    }
}

function hostEndGame() {
    document.getElementById("host-results-panel").classList.add("hide");
    document.getElementById("host-gameover-panel").classList.remove("hide");

    const sorted = [...gameRound.teams].sort((a, b) => getTeamScore(b) - getTeamScore(a));

    const p1 = sorted[0];
    const p2 = sorted[1];
    const p3 = sorted[2];

    document.getElementById("host-podium-1-name").textContent = p1 ? p1.name : "-";
    document.getElementById("host-podium-1-profit").textContent = p1 ? `กำไรสะสม ฿${Math.round(p1.cumulativeProfit).toLocaleString()}` : "";

    document.getElementById("host-podium-2-name").textContent = p2 ? p2.name : "-";
    document.getElementById("host-podium-2-profit").textContent = p2 ? `กำไรสะสม ฿${Math.round(p2.cumulativeProfit).toLocaleString()}` : "";

    document.getElementById("host-podium-3-name").textContent = p3 ? p3.name : "-";
    document.getElementById("host-podium-3-profit").textContent = p3 ? `กำไรสะสม ฿${Math.round(p3.cumulativeProfit).toLocaleString()}` : "";

    const endTbody = document.getElementById("host-end-table-tbody");
    endTbody.innerHTML = "";

    sorted.forEach((team, idx) => {
        const rank = idx + 1;
        const tr = document.createElement("tr");
        if (rank === 1) tr.className = "rank-1";
        else if (rank === 2) tr.className = "rank-2";
        else if (rank === 3) tr.className = "rank-3";

        let rankBadge = `${rank}`;
        if (rank === 1) rankBadge = `🥇 ที่ 1`;
        if (rank === 2) rankBadge = `🥈 ที่ 2`;
        if (rank === 3) rankBadge = `🥉 ที่ 3`;

        tr.innerHTML = `
            <td style="font-weight: 800;">${rankBadge}</td>
            <td style="text-align: left; font-weight: 700;">${team.name}</td>
            <td style="font-weight: 800; color: var(--gold);">฿${Math.round(team.cumulativeProfit).toLocaleString()}</td>
            <td>฿${Math.round(team.cash).toLocaleString()}</td>
            <td>${team.totalUnitsSold} เล่ม</td>
            <td style="color: var(--primary-light);">฿${Math.round(team.villageFund).toLocaleString()}</td>
            <td>${Math.round(team.reputation)}%</td>
        `;
        endTbody.appendChild(tr);
    });

    // Broadcast Game Over
    if (mqttClient && mqttClient.connected) {
        mqttClient.publish(`mokul/${currentRoomPin}/host`, JSON.stringify({
            action: "GAME_OVER",
            champion: p1 ? p1.name : "",
            leaderboard: sorted.map((t, i) => ({ rank: i + 1, name: t.name, profit: t.cumulativeProfit }))
        }));
    }
}

// ==========================================================================
// STUDENT MOBILE CONTROLLER (ฝั่งมือถือนักเรียน 7 ทีม)
// ==========================================================================
let studentLocalState = {
    day: 1,
    teamId: "team1",
    teamName: "",
    cash: 1500,
    reputation: 50,
    inventory: { paper: 300, cover: 25, binding: 30 },
    purchases: { paper: 0, cover: 0, binding: 0 },
    recipe: { paper: 60 },
    pricePerUnit: 89,
    marketing: 0,
    pricesToday: { paper: 0.40, cover: 16.0, binding: 7.0 }
};

function studentJoinRoom() {
    const pinInput = document.getElementById("student-input-pin");
    const teamSelect = document.getElementById("student-select-team");
    const teamNameInput = document.getElementById("student-input-teamname");
    const nameInput = document.getElementById("student-input-name");

    const pin = (pinInput.value || "").trim();
    if (pin.length !== 4) {
        alert("กรุณากรอกรหัสห้อง PIN 4 หลักให้ถูกต้องครับ");
        return;
    }

    currentRoomPin = pin;
    studentMyTeamId = teamSelect.value;
    
    // Team prefix, e.g. "ทีม 1"
    const teamNumStr = studentMyTeamId.replace("team", "ทีม ");
    const teamSeed = TEAMS_SEED.find(t => t.id === studentMyTeamId);
    const defaultName = teamSeed ? teamSeed.name : `${teamNumStr}`;

    const customName = (teamNameInput ? teamNameInput.value : "").trim();
    studentMyTeamName = customName ? `${teamNumStr}: ${customName}` : defaultName;
    const members = (nameInput ? nameInput.value : "").trim();

    // Show waiting panel
    document.getElementById("student-join-panel").classList.add("hide");
    document.getElementById("student-waiting-panel").classList.remove("hide");
    document.getElementById("student-wait-pin").textContent = currentRoomPin;
    document.getElementById("student-wait-team-name").textContent = `${studentMyTeamName} ${members ? `(${members})` : ""}`;

    // Populate marketing select
    const mktSelect = document.getElementById("student-marketing-select");
    mktSelect.innerHTML = "";
    MARKETING_CHANNELS.forEach(ch => {
        const opt = document.createElement("option");
        opt.value = ch.value;
        opt.textContent = ch.name;
        mktSelect.appendChild(opt);
    });

    connectStudentMqtt(members);
}

function studentRenameTeam() {
    const currentCustom = studentMyTeamName.includes(":") ? studentMyTeamName.split(":")[1].trim() : studentMyTeamName;
    const newCustom = prompt("กรุณากรอกชื่อทีม/ชื่อวิสาหกิจใหม่ที่ต้องการ:", currentCustom);
    if (newCustom && newCustom.trim()) {
        const teamNumStr = studentMyTeamId.replace("team", "ทีม ");
        studentMyTeamName = `${teamNumStr}: ${newCustom.trim()}`;
        const lbl = document.getElementById("student-active-team-label");
        if (lbl) lbl.textContent = studentMyTeamName;

        // Broadcast updated name to host
        if (mqttClient && mqttClient.connected) {
            mqttClient.publish(`mokul/${currentRoomPin}/join`, JSON.stringify({
                teamId: studentMyTeamId,
                name: studentMyTeamName
            }));
        }
        alert(`✅ เปลี่ยนชื่อทีมเป็น "${studentMyTeamName}" เรียบร้อยแล้ว!`);
    }
}

function connectStudentMqtt(members) {
    if (mqttClient) {
        try { mqttClient.end(true); } catch (e) {}
    }

    if (typeof mqtt === "undefined") {
        alert("ไม่สามารถโหลดระบบเครือข่ายได้ กรุณาตรวจสอบอินเทอร์เน็ต");
        return;
    }

    const brokerUrl = MQTT_BROKER_URLS[0];
    const clientId = `stu_${studentMyTeamId}_${Math.random().toString(16).substr(2, 6)}`;

    try {
        mqttClient = mqtt.connect(brokerUrl, {
            clientId: clientId,
            clean: true,
            connectTimeout: 7000,
            reconnectPeriod: 4000
        });

        mqttClient.on("connect", () => {
            console.log("Student MQTT Connected!");
            mqttClient.subscribe(`mokul/${currentRoomPin}/host`);

            // Send join announcement to host
            const joinMsg = {
                teamId: studentMyTeamId,
                name: studentMyTeamName,
                members: members
            };
            mqttClient.publish(`mokul/${currentRoomPin}/join`, JSON.stringify(joinMsg));
        });

        mqttClient.on("message", (topic, message) => {
            try {
                const payload = JSON.parse(message.toString());
                handleStudentIncomingMessage(payload);
            } catch (err) {
                console.error("Student error parsing message:", err);
            }
        });
    } catch (e) {
        console.error("Failed to connect student MQTT:", e);
    }
}

function handleStudentIncomingMessage(data) {
    if (data.action === "START_DAY") {
        studentLocalState.day = data.day;
        studentLocalState.pricesToday = data.prices || { paper: 0.40, cover: 16.0, binding: 7.0 };
        studentPlanSubmitted = false;

        // Find my team's state with complete safe fallbacks
        const myTeam = data.teamsState ? data.teamsState.find(t => t.id === studentMyTeamId) : null;
        if (myTeam) {
            if (myTeam.name) studentMyTeamName = myTeam.name;
            studentLocalState.cash = (typeof myTeam.cash === 'number') ? myTeam.cash : 1500;
            studentLocalState.reputation = (typeof myTeam.reputation === 'number') ? myTeam.reputation : 50;
            studentLocalState.inventory = myTeam.inventory || { paper: 300, cover: 25, binding: 30 };
        } else {
            studentLocalState.cash = studentLocalState.cash || 1500;
            studentLocalState.reputation = studentLocalState.reputation || 50;
            studentLocalState.inventory = studentLocalState.inventory || { paper: 300, cover: 25, binding: 30 };
        }

        // Show student planning screen
        document.getElementById("student-waiting-panel").classList.add("hide");
        document.getElementById("student-submitted-panel").classList.add("hide");
        document.getElementById("student-results-panel").classList.add("hide");
        document.getElementById("student-prep-panel").classList.remove("hide");

        // Update UI
        document.getElementById("student-day-indicator").textContent = `📅 วันที่ ${data.day || 1} / 7`;
        document.getElementById("student-active-team-label").textContent = studentMyTeamName;
        document.getElementById("student-val-cash").textContent = `฿${Math.round(studentLocalState.cash).toLocaleString()}`;
        document.getElementById("student-val-rep").textContent = `${Math.round(studentLocalState.reputation)}%`;
        
        const inv = studentLocalState.inventory || { paper: 300, cover: 25, binding: 30 };
        document.getElementById("student-val-stock-summary").textContent = 
            `กระดาษ ${inv.paper || 0} แผ่น, ปก ${inv.cover || 0} ชิ้น, ด้าย ${inv.binding || 0} ชุด`;

        // Event banner
        const ev = data.event || dailyEvents[(data.day || 1) - 1] || dailyEvents[0];
        document.getElementById("student-event-icon").textContent = ev.icon || "☀️";
        document.getElementById("student-event-title").textContent = ev.title || "เหตุการณ์ประจำวัน";
        document.getElementById("student-event-desc").textContent = ev.desc || "";

        // Reset buy inputs
        studentLocalState.purchases = { paper: 0, cover: 0, binding: 0 };
        document.getElementById("student-buy-paper").value = "0";
        document.getElementById("student-buy-cover").value = "0";
        document.getElementById("student-buy-binding").value = "0";

        // Material prices
        const pr = studentLocalState.pricesToday || { paper: 0.40, cover: 16.0, binding: 7.0 };
        document.getElementById("student-price-buy-paper").textContent = `฿${(pr.paper || 0.40).toFixed(2)} / แผ่น`;
        document.getElementById("student-price-buy-cover").textContent = `฿${(pr.cover || 16.0).toFixed(2)} / ปก`;
        document.getElementById("student-price-buy-binding").textContent = `฿${(pr.binding || 7.0).toFixed(2)} / ชุด`;

        updateStudentCalculators();
    } else if (data.action === "ROUND_RESULT") {
        // Teacher simulated round! Show results on student screen
        const myResult = data.results ? data.results[studentMyTeamId] : null;
        if (!myResult) return;

        // Find my rank
        let myRank = 1;
        if (data.leaderboard) {
            const row = data.leaderboard.find(x => x.teamId === studentMyTeamId);
            if (row) myRank = row.rank;
        }

        document.getElementById("student-prep-panel").classList.add("hide");
        document.getElementById("student-submitted-panel").classList.add("hide");
        document.getElementById("student-results-panel").classList.remove("hide");

        document.getElementById("student-res-rank-display").textContent = `ที่ ${myRank}`;
        document.getElementById("student-res-units").textContent = `${myResult.unitsSold} เล่ม`;
        document.getElementById("student-res-revenue").textContent = `+฿${myResult.revenue.toFixed(2)}`;
        document.getElementById("student-res-expenses").textContent = `-฿${(myResult.purchaseCost + myResult.marketingCost).toFixed(2)}`;
        
        const elNet = document.getElementById("student-res-net-profit");
        elNet.textContent = (myResult.netProfit >= 0 ? "+" : "") + `฿${myResult.netProfit.toFixed(2)}`;
        elNet.style.color = myResult.netProfit >= 0 ? "var(--success)" : "var(--danger)";

        document.getElementById("student-res-cumulative-profit").textContent = `฿${Math.round(myResult.cumulativeProfit).toLocaleString()}`;

        // Feedback logs
        const fbContainer = document.getElementById("student-customer-feedback");
        fbContainer.innerHTML = "";
        if (myResult.feedback && myResult.feedback.length > 0) {
            myResult.feedback.forEach(log => {
                const li = document.createElement("li");
                if (log.class) li.className = log.class;
                li.innerHTML = `<span>${log.text}</span>`;
                fbContainer.appendChild(li);
            });
        }
    }
}

function adjustStudentBuy(mat, delta) {
    const cur = studentLocalState.purchases[mat] || 0;
    const nextVal = Math.max(0, cur + delta);
    studentLocalState.purchases[mat] = nextVal;
    document.getElementById(`student-buy-${mat}`).value = nextVal;
    updateStudentCalculators();
}

function updateStudentCalculators() {
    const p = studentLocalState.purchases;
    const pr = studentLocalState.pricesToday;
    const totalCost = (p.paper * pr.paper) + (p.cover * pr.cover) + (p.binding * pr.binding);
    document.getElementById("student-total-purchase").textContent = `฿${totalCost.toFixed(2)}`;

    // Recipe & Unit Cost
    const recPaper = Number(document.getElementById("student-rec-paper").value) || 60;
    document.getElementById("student-lbl-rec-paper").textContent = recPaper;
    studentLocalState.recipe.paper = recPaper;

    const unitCost = calculateUnitCost(recPaper, pr);
    document.getElementById("student-calc-cost-paper").textContent = `฿${unitCost.paper.toFixed(2)}`;
    document.getElementById("student-calc-total-unit-cost").textContent = `฿${unitCost.total.toFixed(2)}`;

    // Pricing & Margin
    const price = Number(document.getElementById("student-price-per-unit").value) || 89;
    studentLocalState.pricePerUnit = price;
    const profitUnit = price - unitCost.total;
    const elProf = document.getElementById("student-calc-profit-unit");
    elProf.textContent = (profitUnit >= 0 ? "+" : "") + `฿${profitUnit.toFixed(2)}`;
    elProf.style.color = profitUnit >= 0 ? "var(--gold)" : "var(--danger)";

    const badge = document.getElementById("student-margin-badge");
    const margin = (profitUnit / price) * 100;
    if (profitUnit < 0) {
        badge.className = "margin-pill loss";
        badge.textContent = "ขาดทุน!";
    } else if (margin < 20) {
        badge.className = "margin-pill low";
        badge.textContent = `กำไรบาง (${margin.toFixed(0)}%)`;
    } else if (margin <= 50) {
        badge.className = "margin-pill good";
        badge.textContent = `กำไรดีมาก (${margin.toFixed(0)}%)`;
    } else {
        badge.className = "margin-pill great";
        badge.textContent = `ราคาสูง/พรีเมียม (${margin.toFixed(0)}%)`;
    }
}

function studentSubmitPlan() {
    const p = studentLocalState.purchases;
    const pr = studentLocalState.pricesToday;
    const totalCost = (p.paper * pr.paper) + (p.cover * pr.cover) + (p.binding * pr.binding);
    const mkt = Number(document.getElementById("student-marketing-select").value) || 0;

    if (totalCost + mkt > studentLocalState.cash) {
        alert(`เงินทุนหมุนเวียนไม่เพียงพอ! (ต้องการ ฿${(totalCost + mkt).toFixed(2)} แต่มีเงินสด ฿${studentLocalState.cash.toFixed(2)}) กรุณาลดการสั่งซื้อ`);
        return;
    }

    const planPayload = {
        buy: p,
        recipe: { paper: studentLocalState.recipe.paper },
        pricePerUnit: studentLocalState.pricePerUnit,
        marketing: mkt
    };

    // Send plan to host
    if (mqttClient) {
        mqttClient.publish(`mokul/${currentRoomPin}/plan`, JSON.stringify({
            teamId: studentMyTeamId,
            plan: planPayload
        }), { qos: 1 });
    }

    // Switch to confirmation screen
    document.getElementById("student-prep-panel").classList.add("hide");
    document.getElementById("student-submitted-panel").classList.remove("hide");

    const mktObj = MARKETING_CHANNELS.find(x => x.value === mkt);
    document.getElementById("student-submitted-summary").innerHTML = `
        <div style="font-weight: 700; color: var(--gold); margin-bottom: 0.4rem;">📋 สรุปแผนที่ส่งเข้าจอกลาง:</div>
        <div>- สั่งซื้อวัตถุดิบ: กระดาษ +${p.paper} แผ่น, ปก +${p.cover} ชิ้น, ด้าย +${p.binding} ชุด (รวม ฿${totalCost.toFixed(2)})</div>
        <div>- ความหนาสมุด: ${studentLocalState.recipe.paper} แผ่น / เล่ม</div>
        <div>- ตั้งราคาขาย: <strong>฿${studentLocalState.pricePerUnit} บาท/เล่ม</strong></div>
        <div>- ช่องทางโปรโมท: ${mktObj ? mktObj.name : "ศูนย์เรียนรู้"}</div>
    `;
}

function studentFetchCurrentState() {
    if (mqttClient && mqttClient.connected) {
        mqttClient.publish(`mokul/${currentRoomPin}/join`, JSON.stringify({
            teamId: studentMyTeamId,
            name: studentMyTeamName,
            action: "REQUEST_STATE"
        }));
    } else {
        alert("กำลังเชื่อมต่อระบบเครือข่าย กรุณารอสักครู่แล้วแตะใหม่ครับ");
    }
}

// ==========================================================================
// SINGLE DEVICE / OFFLINE CONTROLLER (โหมดเล่นเครื่องเดียวออฟไลน์)
// ==========================================================================
function getActiveTeam() {
    return gameRound.teams.find(t => t.id === gameRound.activeTeamId) || gameRound.teams[0];
}

function initSingleDay() {
    updatePricesForDay(gameRound.day);
    const ev = dailyEvents[gameRound.day - 1];

    document.getElementById("day-indicator").textContent = `📅 วันแข่งที่: ${gameRound.day} / 7`;
    const banner = document.getElementById("event-banner");
    banner.classList.remove("hide");
    document.getElementById("event-icon").textContent = ev.icon;
    document.getElementById("event-title").textContent = ev.title;
    document.getElementById("event-description").textContent = ev.desc;

    // Material prices
    document.getElementById("price-buy-paper").textContent = `฿${gameRound.pricesToday.paper.toFixed(2)} / แผ่น`;
    document.getElementById("price-buy-cover").textContent = `฿${gameRound.pricesToday.cover.toFixed(2)} / ปก`;
    document.getElementById("price-buy-binding").textContent = `฿${gameRound.pricesToday.binding.toFixed(2)} / ชุด`;

    // Populate marketing select
    const sel = document.getElementById("marketing-select");
    sel.innerHTML = "";
    MARKETING_CHANNELS.forEach(ch => {
        const opt = document.createElement("option");
        opt.value = ch.value;
        opt.textContent = ch.name;
        sel.appendChild(opt);
    });

    renderTeamChips();
    loadActiveTeamIntoForm();
}

function renderTeamChips() {
    const container = document.getElementById("team-chips-container");
    if (!container) return;
    container.innerHTML = "";

    let confirmedCount = 0;
    gameRound.teams.forEach(team => {
        if (team.isConfirmed) confirmedCount++;
        const chip = document.createElement("div");
        chip.className = `team-chip ${team.id === gameRound.activeTeamId ? "active" : ""} ${team.isConfirmed ? "confirmed" : ""}`;
        chip.innerHTML = `
            <span class="team-chip-icon">${team.isConfirmed ? "✅" : "📝"}</span>
            <span>${team.name}</span>
        `;
        chip.onclick = () => switchActiveTeam(team.id);
        container.appendChild(chip);
    });

    const readText = document.getElementById("readiness-text");
    if (readText) readText.textContent = `ทีมที่ยืนยันแผนแล้ว: ${confirmedCount} / 7 ทีม`;
}

function switchActiveTeam(teamId) {
    saveActiveTeamForm();
    gameRound.activeTeamId = teamId;
    renderTeamChips();
    loadActiveTeamIntoForm();

    // If currently on Results panel, also update the results breakdown view for this team!
    const resPanel = document.getElementById("panel-results");
    if (resPanel && !resPanel.classList.contains("hide")) {
        updateSingleActiveTeamResultView();
    }
}

function loadActiveTeamIntoForm() {
    const team = getActiveTeam();
    document.getElementById("active-team-display-name").textContent = team.name;
    document.getElementById("val-cash").textContent = `฿${Math.round(team.cash).toLocaleString()}`;
    document.getElementById("val-reputation").textContent = `${Math.round(team.reputation)}%`;
    document.getElementById("val-village-fund").textContent = `฿${Math.round(team.villageFund).toLocaleString()}`;

    const inv = team.inventory;
    document.getElementById("val-stock-summary").textContent = 
        `กระดาษ ${inv.paper} แผ่น, ปก ${inv.cover} ชิ้น, ด้าย ${inv.binding} ชุด`;

    document.getElementById("buy-paper").value = team.purchases.paper || 0;
    document.getElementById("buy-cover").value = team.purchases.cover || 0;
    document.getElementById("buy-binding").value = team.purchases.binding || 0;

    document.getElementById("rec-paper").value = team.recipe.paper || 60;
    document.getElementById("lbl-rec-paper").textContent = team.recipe.paper || 60;

    document.getElementById("price-per-unit").value = team.pricePerUnit || 89;
    document.getElementById("marketing-select").value = team.marketingChannel || 0;

    updateCostCalculators();
}

function saveActiveTeamForm() {
    const team = getActiveTeam();
    team.purchases.paper = Number(document.getElementById("buy-paper").value) || 0;
    team.purchases.cover = Number(document.getElementById("buy-cover").value) || 0;
    team.purchases.binding = Number(document.getElementById("buy-binding").value) || 0;
    team.recipe.paper = Number(document.getElementById("rec-paper").value) || 60;
    team.pricePerUnit = Number(document.getElementById("price-per-unit").value) || 89;
    team.marketingChannel = Number(document.getElementById("marketing-select").value) || 0;
}

function adjustBuy(mat, delta) {
    const input = document.getElementById(`buy-${mat}`);
    const nextVal = Math.max(0, (Number(input.value) || 0) + delta);
    input.value = nextVal;
    saveActiveTeamForm();
    updateCostCalculators();
}

function updateCostCalculators() {
    const team = getActiveTeam();
    saveActiveTeamForm();

    const pr = gameRound.pricesToday;
    const p = team.purchases;
    const totalCost = (p.paper * pr.paper) + (p.cover * pr.cover) + (p.binding * pr.binding);
    document.getElementById("total-purchase").textContent = `฿${totalCost.toFixed(2)}`;

    const unitCost = calculateUnitCost(team.recipe.paper, pr);
    document.getElementById("calc-cost-paper").textContent = `฿${unitCost.paper.toFixed(2)}`;
    document.getElementById("calc-cost-cover").textContent = `฿${unitCost.cover.toFixed(2)}`;
    document.getElementById("calc-cost-binding").textContent = `฿${unitCost.binding.toFixed(2)}`;
    document.getElementById("calc-cost-labor").textContent = `฿${unitCost.labor.toFixed(2)}`;
    document.getElementById("calc-total-unit-cost").textContent = `฿${unitCost.total.toFixed(2)}`;

    // Profit & break-even
    const profitUnit = team.pricePerUnit - unitCost.total;
    const elProf = document.getElementById("calc-profit-unit");
    elProf.textContent = (profitUnit >= 0 ? "+" : "") + `฿${profitUnit.toFixed(2)}`;
    elProf.style.color = profitUnit >= 0 ? "var(--gold)" : "var(--danger)";

    const margin = (profitUnit / team.pricePerUnit) * 100;
    const badge = document.getElementById("margin-badge");
    if (profitUnit < 0) {
        badge.className = "margin-pill loss";
        badge.textContent = "ขาดทุน!";
    } else if (margin < 20) {
        badge.className = "margin-pill low";
        badge.textContent = `กำไรบาง (${margin.toFixed(0)}%)`;
    } else if (margin <= 50) {
        badge.className = "margin-pill good";
        badge.textContent = `กำไรดีมาก (${margin.toFixed(0)}%)`;
    } else {
        badge.className = "margin-pill great";
        badge.textContent = `ราคาสูง/พรีเมียม (${margin.toFixed(0)}%)`;
    }

    const breakEven = profitUnit > 0 ? Math.ceil(team.marketingChannel / profitUnit) : "ไม่มี";
    document.getElementById("calc-breakeven").textContent = typeof breakEven === "number" ? `${breakEven} เล่ม` : breakEven;
}

function singleSimulateAll() {
    saveActiveTeamForm();
    const ev = dailyEvents[gameRound.day - 1];
    const prices = gameRound.pricesToday;

    gameRound.teams.forEach(team => {
        simulateDayForTeam(team, ev, prices);
    });

    const sorted = [...gameRound.teams].sort((a, b) => getTeamScore(b) - getTeamScore(a));

    document.getElementById("panel-prep").classList.add("hide");
    document.getElementById("panel-results").classList.remove("hide");

    if (sorted[0]) {
        gameRound.activeTeamId = sorted[0].id;
    }

    renderTeamChips();
    renderSingleLeaderboard(sorted);
    updateSingleActiveTeamResultView();
}

function renderSingleLeaderboard(sortedTeams) {
    const tbody = document.getElementById("leaderboard-tbody");
    tbody.innerHTML = "";

    sortedTeams.forEach((team, idx) => {
        const rank = idx + 1;
        const res = team.lastResult || {};
        const tr = document.createElement("tr");
        if (rank === 1) tr.className = "rank-1";
        else if (rank === 2) tr.className = "rank-2";
        else if (rank === 3) tr.className = "rank-3";

        let rankBadge = `<span class="rank-badge ${rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : 'normal'}">${rank}</span>`;

        tr.innerHTML = `
            <td>${rankBadge}</td>
            <td style="text-align: left; font-weight: 700; cursor: pointer; color: var(--gold);">
                ${team.name}
            </td>
            <td style="font-weight: 700; color: ${res.netProfit >= 0 ? 'var(--success)' : 'var(--danger)'};">
                ${res.netProfit >= 0 ? '+' : ''}฿${Math.round(res.netProfit || 0).toLocaleString()}
            </td>
            <td style="font-weight: 800; color: var(--gold);">฿${Math.round(team.cumulativeProfit).toLocaleString()}</td>
            <td>฿${Math.round(team.cash).toLocaleString()}</td>
            <td>${team.totalUnitsSold} เล่ม</td>
            <td style="color: var(--primary-light);">฿${Math.round(team.villageFund).toLocaleString()}</td>
            <td>${Math.round(team.reputation)}%</td>
        `;

        tr.onclick = () => {
            gameRound.activeTeamId = team.id;
            updateSingleActiveTeamResultView();
        };
        tbody.appendChild(tr);
    });
}

function updateSingleActiveTeamResultView() {
    const team = getActiveTeam();
    const res = team.lastResult;
    if (!res) return;

    document.getElementById("res-team-name-title").textContent = team.name;
    document.getElementById("res-total-demand").textContent = `${res.demand} คน`;
    document.getElementById("res-sales-qty").textContent = `${res.unitsSold} เล่ม`;
    document.getElementById("res-revenue").textContent = `+฿${res.revenue.toFixed(2)}`;
    document.getElementById("res-cost-purchases").textContent = `-฿${res.purchaseCost.toFixed(2)}`;
    document.getElementById("res-cost-marketing").textContent = `-฿${res.marketingCost.toFixed(2)}`;
    document.getElementById("res-village-fund-deduct").textContent = 
        res.villageFundDeduct > 0 ? `-฿${res.villageFundDeduct.toFixed(2)}` : "฿0.00";

    const elNet = document.getElementById("res-net-profit");
    elNet.textContent = (res.netProfit >= 0 ? "+" : "") + `฿${res.netProfit.toFixed(2)}`;
    elNet.style.color = res.netProfit >= 0 ? "var(--success)" : "var(--danger)";

    document.getElementById("res-stock-paper").textContent = `${team.inventory.paper} แผ่น`;
    document.getElementById("res-stock-cover").textContent = `${team.inventory.cover} ปก`;
    document.getElementById("res-stock-binding").textContent = `${team.inventory.binding} ชุด`;

    const fbList = document.getElementById("customer-feedback");
    fbList.innerHTML = "";
    const logs = generateFeedbackLogs(team, res);
    logs.forEach(log => {
        const li = document.createElement("li");
        if (log.class) li.className = log.class;
        li.innerHTML = `<span>${log.text}</span>`;
        fbList.appendChild(li);
    });
}

function singleNextDay() {
    if (gameRound.day < 7) {
        gameRound.day++;
        document.getElementById("panel-results").classList.add("hide");
        document.getElementById("panel-prep").classList.remove("hide");
        initSingleDay();
    } else {
        singleEndGame();
    }
}

function singleEndGame() {
    document.getElementById("panel-results").classList.add("hide");
    document.getElementById("panel-prep").classList.add("hide");
    document.getElementById("event-banner").classList.add("hide");
    document.getElementById("panel-gameover").classList.remove("hide");

    const sorted = [...gameRound.teams].sort((a, b) => getTeamScore(b) - getTeamScore(a));

    const p1 = sorted[0];
    const p2 = sorted[1];
    const p3 = sorted[2];

    document.getElementById("podium-1-name").textContent = p1 ? p1.name : "-";
    document.getElementById("podium-1-profit").textContent = p1 ? `กำไร ฿${Math.round(p1.cumulativeProfit).toLocaleString()}` : "";

    document.getElementById("podium-2-name").textContent = p2 ? p2.name : "-";
    document.getElementById("podium-2-profit").textContent = p2 ? `กำไร ฿${Math.round(p2.cumulativeProfit).toLocaleString()}` : "";

    document.getElementById("podium-3-name").textContent = p3 ? p3.name : "-";
    document.getElementById("podium-3-profit").textContent = p3 ? `กำไร ฿${Math.round(p3.cumulativeProfit).toLocaleString()}` : "";

    const endTbody = document.getElementById("end-table-tbody");
    endTbody.innerHTML = "";

    sorted.forEach((team, idx) => {
        const rank = idx + 1;
        const tr = document.createElement("tr");
        if (rank === 1) tr.className = "rank-1";
        else if (rank === 2) tr.className = "rank-2";
        else if (rank === 3) tr.className = "rank-3";

        let rankBadge = `${rank}`;
        if (rank === 1) rankBadge = `🥇 ที่ 1`;
        if (rank === 2) rankBadge = `🥈 ที่ 2`;
        if (rank === 3) rankBadge = `🥉 ที่ 3`;

        tr.innerHTML = `
            <td style="font-weight: 800;">${rankBadge}</td>
            <td style="text-align: left; font-weight: 700;">${team.name}</td>
            <td style="font-weight: 800; color: var(--gold);">฿${Math.round(team.cumulativeProfit).toLocaleString()}</td>
            <td>฿${Math.round(team.cash).toLocaleString()}</td>
            <td>${team.totalUnitsSold} เล่ม</td>
            <td style="color: var(--primary-light);">฿${Math.round(team.villageFund).toLocaleString()}</td>
            <td>${Math.round(team.reputation)}%</td>
        `;
        endTbody.appendChild(tr);
    });
}

// ==========================================
// Initialization & Event Listeners
// ==========================================
window.addEventListener("DOMContentLoaded", () => {
    initGameRound();

    // Check URL parameters (e.g. ?pin=8824 or ?mode=host)
    const urlParams = new URLSearchParams(window.location.search);
    const paramPin = urlParams.get("pin");
    const paramMode = urlParams.get("mode");

    if (paramPin) {
        enterStudentMode(paramPin);
    } else if (paramMode === "host") {
        enterHostMode();
    } else {
        switchModeView("select");
    }

    // Bind Host Buttons
    const btnHostStart = document.getElementById("btn-host-start-round");
    if (btnHostStart) btnHostStart.onclick = hostStartDay;

    const btnHostSim = document.getElementById("btn-host-simulate");
    if (btnHostSim) btnHostSim.onclick = hostSimulateDay;

    const btnHostNext = document.getElementById("btn-host-next-day");
    if (btnHostNext) btnHostNext.onclick = hostNextDay;

    const btnHostRestart = document.getElementById("btn-host-restart-game");
    if (btnHostRestart) btnHostRestart.onclick = enterHostMode;

    const btnHostResync = document.getElementById("btn-host-resync");
    if (btnHostResync) btnHostResync.onclick = () => {
        broadcastHostStartDay();
        alert(`🔄 ส่งข้อมูลวันที่ ${gameRound.day} ไปยังมือถือของทุกทีมเรียบร้อยแล้ว!`);
    };

    // Bind Student Buttons
    const btnStuJoin = document.getElementById("btn-student-join");
    if (btnStuJoin) btnStuJoin.onclick = studentJoinRoom;

    const btnStuSubmit = document.getElementById("btn-student-submit-plan");
    if (btnStuSubmit) btnStuSubmit.onclick = studentSubmitPlan;

    const btnStudentFetchState = document.getElementById("btn-student-fetch-state");
    if (btnStudentFetchState) btnStudentFetchState.onclick = studentFetchCurrentState;

    const recPaperSlider = document.getElementById("student-rec-paper");
    if (recPaperSlider) recPaperSlider.oninput = updateStudentCalculators;

    const priceUnitInput = document.getElementById("student-price-per-unit");
    if (priceUnitInput) priceUnitInput.oninput = updateStudentCalculators;

    const btnStudentRename = document.getElementById("btn-student-rename");
    if (btnStudentRename) btnStudentRename.onclick = studentRenameTeam;

    // Bind Single Mode Buttons
    const btnSimAll = document.getElementById("btn-simulate-all");
    if (btnSimAll) btnSimAll.onclick = singleSimulateAll;

    const btnNextDay = document.getElementById("btn-next-day");
    if (btnNextDay) btnNextDay.onclick = singleNextDay;

    const btnRestartSingle = document.getElementById("btn-restart-game");
    if (btnRestartSingle) btnRestartSingle.onclick = enterSingleMode;

    const recPaperSingle = document.getElementById("rec-paper");
    if (recPaperSingle) recPaperSingle.oninput = () => {
        document.getElementById("lbl-rec-paper").textContent = recPaperSingle.value;
        updateCostCalculators();
    };

    const priceUnitSingle = document.getElementById("price-per-unit");
    if (priceUnitSingle) priceUnitSingle.oninput = updateCostCalculators;

    const mktSelectSingle = document.getElementById("marketing-select");
    if (mktSelectSingle) mktSelectSingle.onchange = updateCostCalculators;

    const btnConfirmTeam = document.getElementById("btn-confirm-team");
    if (btnConfirmTeam) btnConfirmTeam.onclick = () => {
        const team = getActiveTeam();
        team.isConfirmed = true;
        renderTeamChips();
        alert(`✅ บันทึกแผนการผลิตของ ${team.name} เรียบร้อยแล้ว! สามารถสลับไปวางแผนให้ทีมถัดไปได้`);
    };

    const btnRename = document.getElementById("btn-rename-team");
    if (btnRename) btnRename.onclick = () => {
        const team = getActiveTeam();
        const newName = prompt(`กรุณากรอกชื่อใหม่ของทีม ${team.id}:`, team.name);
        if (newName && newName.trim()) {
            team.name = newName.trim();
            renderTeamChips();
            loadActiveTeamIntoForm();
        }
    };

    // Header navigation buttons
    const btnModeSwitch = document.getElementById("btn-mode-switch");
    if (btnModeSwitch) btnModeSwitch.onclick = () => switchModeView("select");

    const btnKnowledge = document.getElementById("btn-knowledge");
    if (btnKnowledge) btnKnowledge.onclick = () => {
        document.getElementById("modal-knowledge").classList.remove("hide");
    };

    const btnCloseModal = document.getElementById("btn-close-modal");
    if (btnCloseModal) btnCloseModal.onclick = () => {
        document.getElementById("modal-knowledge").classList.add("hide");
    };

    const btnRestartHeader = document.getElementById("btn-restart");
    if (btnRestartHeader) btnRestartHeader.onclick = () => {
        if (confirm("ต้องการรีเซ็ตการแข่งขันและกลับสู่หน้าหลักหรือไม่?")) {
            switchModeView("select");
        }
    };
});
