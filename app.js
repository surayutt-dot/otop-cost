// ==========================================
// สมุดทำมือ ไทคูน (Handmade Craft Notebook Tycoon)
// ระบบจำลองธุรกิจ & ฝึกคิดราคาต้นทุน-กำไร "สมุดทำมือชุมชนบ้านโมกุล"
// ==========================================

// ข้อมูลจำเพาะของสมุดทำมือชุมชนบ้านโมกุล
const NOTEBOOK_CONFIG = {
    name: "สมุดทำมือชุมชนบ้านโมกุล",
    badge: "📖 งานหัตถกรรมคราฟต์ OTOP",
    unit: "เล่ม",
    defaultPrice: 89,
    idealPriceBase: 85,
    laborCost: 15, // ค่าแรงงานฝีมือเย็บกี่ชุมชน 15 บาท/เล่ม
    materials: {
        paper: {
            id: "paper",
            name: "กระดาษถนอมสายตา (แผ่น)",
            unit: "แผ่น",
            basePrice: 0.40, // 0.40 บาท/แผ่น
            defaultStock: 300,
            stepBuy: 50,
            defaultRecipe: 60, // 60 แผ่นต่อเล่ม
            minRec: 30,
            maxRec: 100,
            stepRec: 5
        },
        cover: {
            id: "cover",
            name: "ปกแข็งหุ้มผ้าทอพื้นเมืองบ้านโมกุล (ชุดปก)",
            unit: "ชุด",
            basePrice: 16, // 16 บาท/ชุด
            defaultStock: 25,
            stepBuy: 5,
            defaultRecipe: 1, // 1 ปกต่อเล่ม
            minRec: 1,
            maxRec: 1,
            stepRec: 1
        },
        binding: {
            id: "binding",
            name: "ด้ายเย็บกี่แว็กซ์ & กาวเข้าเล่ม & ปลอกสายคาด (ชุด)",
            unit: "ชุด",
            basePrice: 7, // 7 บาท/ชุด
            defaultStock: 30,
            stepBuy: 5,
            defaultRecipe: 1,
            minRec: 1,
            maxRec: 1,
            stepRec: 1
        }
    }
};

// เหตุการณ์ประจำวัน 7 วัน สำหรับธุรกิจสมุดทำมือ
const dailyEvents = [
    {
        title: "📖 เปิดตัวสมุดทำมือเอกลักษณ์ชุมชนวันแรก (วันฟ้าใส)",
        desc: "ชาวบ้านและช่างฝีมือร่วมแรงร่วมใจ อากาศแจ่มใส มีลูกค้าสัญจรและผู้มาศึกษาดูงานแวะชมงานหัตถศิลป์ เป็นวันที่ดีในการทดสอบความหนาของสมุดและตั้งราคาที่คุ้มค่า!",
        icon: "☀️",
        demandMod: 1.0,
        priceMod: 1.0
    },
    {
        title: "🌧️ ฝนตกหนัก บรรยากาศเงียบสงบเหมาะกับการเขียนบันทึก",
        desc: "ฝนตกตลอดทั้งวัน ลูกค้าเดินหน้าร้านลดลง 25% แต่คนหันมาสั่งซื้อผ่านแชทและสั่งเป็นของขวัญส่งทางพัสดุมากขึ้น การเลือกโปรโมทออนไลน์วันนี้จะได้ผลตอบรับดียิ่งขึ้น!",
        icon: "⛈️",
        demandMod: 0.75,
        priceMod: 1.05
    },
    {
        title: "📉 วิกฤตราคาเยื่อกระดาษในตลาดพุ่งสูงขึ้น",
        desc: "โรงงานกระดาษปรับราคาขึ้นเนื่องจากวัตถุดิบขาดแคลน ส่งผลให้ราคากระดาษวันนี้พุ่งขึ้น 40%! ควรคำนวณต้นทุนต่อเล่มใหม่และปรับราคาขายให้เหมาะสมเพื่อรักษาผลกำไร",
        icon: "⚠️",
        demandMod: 1.0,
        priceMod: 1.0,
        paperPriceMult: 1.4
    },
    {
        title: "🚌 คณะศึกษาดูงานและหน่วยงานราชการสั่งเป็นของที่ระลึก",
        desc: "มีคณะศึกษาดูงานและโรงเรียนในจังหวัดเข้ามาชมงาน ต้องการซื้อสมุดทำมือไปเป็นของขวัญของที่ระลึกจำนวนมาก ยอดความต้องการพุ่งขึ้น 75%! เตรียมสต็อกให้พร้อมรับมือ",
        icon: "🚌",
        demandMod: 1.75,
        priceMod: 1.15
    },
    {
        title: "⭐ สมุดทำมือได้รับรองมาตรฐาน OTOP 4 ดาว & มผช.",
        desc: "ความภาคภูมิใจของชุมชน! สมุดทำมือผ่านการรับรองมาตรฐานผลิตภัณฑ์ชุมชน ลูกค้าเชื่อมั่นในความประณีตและความทนทานของงานเย็บมือ ยินดีสนับสนุนในราคาพรีเมียม",
        icon: "🏆",
        demandMod: 1.35,
        priceMod: 1.25,
        repBonus: 8
    },
    {
        title: "🏭 สมุดโรงงานพิมพ์ลายราคาถูกเข้ามาตีตลาด",
        desc: "มีสมุดสำเร็จรูปจากโรงงานมาวางขายตัดราคาในอำเภอ หากเราเน้นจุดเด่นเรื่องงานคราฟต์เย็บมือที่กางได้ 180 องศา และลวดลายผ้าทอชุมชน ลูกค้าสายเขียนจะยังมั่นใจอุดหนุนเรา!",
        icon: "⚔️",
        demandMod: 0.85,
        priceMod: 0.9
    },
    {
        title: "🎪 มหกรรมงานสัปดาห์หนังสือและงานคราฟต์จังหวัดวันสุดท้าย",
        desc: "วันปิดงานมหกรรมสุดยิ่งใหญ่ ผู้คนหลั่งไหลมาหาซื้อสมุดบันทึกและของขวัญทำมือติดไม้ติดมือกลับบ้าน ยอดสั่งซื้อพุ่งสูงสุดในรอบสัปดาห์ มาทำยอดขายส่งท้ายให้งดงาม!",
        icon: "🎉",
        demandMod: 2.0,
        priceMod: 1.2
    }
];

// ช่องทางการโปรโมทและกระจายสินค้าสมุดทำมือ
const MARKETING_CHANNELS = [
    { value: 0, name: "วางจำหน่ายหน้าศูนย์เรียนรู้ชุมชน (฿0)", mod: 1.0, desc: "ไม่มีค่าใช้จ่าย อาศัยลูกค้าสัญจรปกติ" },
    { value: 120, name: "ฝากวางขายร้านกาแฟ & ร้านของฝากประจำจังหวัด (฿120)", mod: 1.35, desc: "เจาะกลุ่มคนรักกาแฟและนักท่องเที่ยว +35%" },
    { value: 350, name: "ออกบูธงานมหกรรม OTOP & เทศกาลงานคราฟต์ (฿350)", mod: 1.75, desc: "คนรักงานฝีมือระดับจังหวัด +75%" },
    { value: 600, name: "Live สด TikTok & เพจคนรักสมุดบันทึกออนไลน์ (฿600)", mod: 2.25, desc: "ไวรัลโซเชียล ยอดสั่งซื้อพุ่ง +125%" }
];

function getInitialState() {
    return {
        day: 1,
        cash: 1500, // เงินทุนหมุนเวียนเริ่มต้น 1,500 บาท
        reputation: 50, // ชื่อเสียง 50%
        villageFund: 0, // กองทุนพัฒนาหมู่บ้านสะสม
        inventory: {
            paper: NOTEBOOK_CONFIG.materials.paper.defaultStock,
            cover: NOTEBOOK_CONFIG.materials.cover.defaultStock,
            binding: NOTEBOOK_CONFIG.materials.binding.defaultStock
        },
        pricesToday: {
            paper: NOTEBOOK_CONFIG.materials.paper.basePrice,
            cover: NOTEBOOK_CONFIG.materials.cover.basePrice,
            binding: NOTEBOOK_CONFIG.materials.binding.basePrice
        },
        buyQty: {
            paper: 0,
            cover: 0,
            binding: 0
        },
        recipe: {
            paper: NOTEBOOK_CONFIG.materials.paper.defaultRecipe, // จำนวนแผ่นกระดาษ
            cover: 1,
            binding: 1
        },
        pricePerUnit: NOTEBOOK_CONFIG.defaultPrice,
        marketingCost: 0,
        cumulativeProfit: 0,
        totalUnitsSold: 0,
        totalLaborPaid: 0
    };
}

let state = getInitialState();

// ==========================================
// DOM Initialization & Event Listeners
// ==========================================
window.addEventListener("DOMContentLoaded", () => {
    buildMarketingOptions();
    setupEventListeners();
    initDay();
});

function setupEventListeners() {
    // Slider กระดาษต่อเล่ม
    const sliderPaper = document.getElementById("rec-paper");
    sliderPaper.addEventListener("input", (e) => {
        const val = parseInt(e.target.value);
        state.recipe.paper = val;
        document.getElementById("lbl-rec-paper").textContent = val;
        updateLiveCalculator();
    });

    // Price input
    const elPriceInput = document.getElementById("price-per-unit");
    elPriceInput.addEventListener("input", (e) => {
        const p = parseFloat(e.target.value) || 0;
        state.pricePerUnit = p;
        updateLiveCalculator();
    });

    // Marketing select
    const elMarketing = document.getElementById("marketing-select");
    elMarketing.addEventListener("change", (e) => {
        state.marketingCost = parseInt(e.target.value) || 0;
        updateLiveCalculator();
    });

    // Action buttons
    document.getElementById("btn-open-market").addEventListener("click", openMarket);
    document.getElementById("btn-next-day").addEventListener("click", nextDay);
    document.getElementById("btn-restart").addEventListener("click", restartGame);
    document.getElementById("btn-restart-game").addEventListener("click", restartGame);

    // Knowledge Modal toggle
    document.getElementById("btn-knowledge").addEventListener("click", () => {
        document.getElementById("modal-knowledge").classList.remove("hide");
    });
    document.getElementById("btn-close-modal").addEventListener("click", () => {
        document.getElementById("modal-knowledge").classList.add("hide");
    });
}

function buildMarketingOptions() {
    const sel = document.getElementById("marketing-select");
    sel.innerHTML = "";
    MARKETING_CHANNELS.forEach(m => {
        const opt = document.createElement("option");
        opt.value = m.value;
        opt.textContent = m.name;
        sel.appendChild(opt);
    });
}

// ==========================================
// Daily Cycle & Calculation Logic
// ==========================================
function initDay() {
    const event = dailyEvents[state.day - 1];

    // Reset daily buy quantities
    state.buyQty = { paper: 0, cover: 0, binding: 0 };
    document.getElementById("buy-paper").value = 0;
    document.getElementById("buy-cover").value = 0;
    document.getElementById("buy-binding").value = 0;

    // Apply reputation bonus if any
    if (event.repBonus) {
        state.reputation = Math.min(100, state.reputation + event.repBonus);
    }

    // Daily price fluctuation
    let pPaper = NOTEBOOK_CONFIG.materials.paper.basePrice;
    if (event.paperPriceMult) {
        pPaper *= event.paperPriceMult;
    } else {
        pPaper += (Math.random() * 0.08 - 0.04);
    }
    let pCover = NOTEBOOK_CONFIG.materials.cover.basePrice + (Math.random() * 2 - 1);
    let pBinding = NOTEBOOK_CONFIG.materials.binding.basePrice + (Math.random() * 1 - 0.5);

    state.pricesToday.paper = Math.max(0.25, Math.round(pPaper * 100) / 100);
    state.pricesToday.cover = Math.max(10, Math.round(pCover * 10) / 10);
    state.pricesToday.binding = Math.max(4, Math.round(pBinding * 10) / 10);

    // Update Banner
    const banner = document.getElementById("event-banner");
    banner.classList.remove("hide");
    document.getElementById("event-icon").textContent = event.icon;
    document.getElementById("event-title").textContent = event.title;
    document.getElementById("event-description").textContent = event.desc;

    // Purchase Section labels & prices
    document.getElementById("price-buy-paper").textContent = `฿${state.pricesToday.paper.toFixed(2)} / แผ่น`;
    document.getElementById("price-buy-cover").textContent = `฿${state.pricesToday.cover.toFixed(1)} / ปก`;
    document.getElementById("price-buy-binding").textContent = `฿${state.pricesToday.binding.toFixed(1)} / ชุด`;

    // Slider setup
    const sPaper = document.getElementById("rec-paper");
    sPaper.min = NOTEBOOK_CONFIG.materials.paper.minRec;
    sPaper.max = NOTEBOOK_CONFIG.materials.paper.maxRec;
    sPaper.step = NOTEBOOK_CONFIG.materials.paper.stepRec;
    sPaper.value = state.recipe.paper;
    document.getElementById("lbl-rec-paper").textContent = state.recipe.paper;

    // Price input setup
    document.getElementById("price-per-unit").value = state.pricePerUnit;

    updateTopIndicators();
    updateLiveCalculator();
    updatePurchaseTotal();
}

function updateTopIndicators() {
    document.getElementById("day-indicator").textContent = `วันที่: ${state.day} / 7`;
    document.getElementById("val-cash").textContent = `฿${Math.round(state.cash).toLocaleString()}`;
    document.getElementById("val-reputation").textContent = `${Math.round(state.reputation)}%`;
    document.getElementById("val-village-fund").textContent = `฿${Math.round(state.villageFund).toLocaleString()}`;
    document.getElementById("val-stock-summary").textContent = 
        `กระดาษ: ${state.inventory.paper} แผ่น | ปก: ${state.inventory.cover} ชุด | ด้าย/กาว: ${state.inventory.binding} ชุด`;
}

// Purchase buttons handler
window.adjustBuy = function(matKey, amount) {
    const nextVal = state.buyQty[matKey] + amount;
    if (nextVal >= 0) {
        const costDiff = amount * state.pricesToday[matKey];
        const newTotal = getPurchaseCost() + costDiff;
        if (newTotal <= state.cash) {
            state.buyQty[matKey] = nextVal;
            document.getElementById(`buy-${matKey}`).value = nextVal;
            updatePurchaseTotal();
        } else {
            alert("⚠️ เงินทุนหมุนเวียนไม่เพียงพอสำหรับการสั่งซื้อจำนวนนี้!");
        }
    }
};

function getPurchaseCost() {
    return (state.buyQty.paper * state.pricesToday.paper) +
           (state.buyQty.cover * state.pricesToday.cover) +
           (state.buyQty.binding * state.pricesToday.binding);
}

function updatePurchaseTotal() {
    const total = getPurchaseCost();
    document.getElementById("total-purchase").textContent = `฿${total.toFixed(2)}`;
}

// ==========================================
// Live Cost & Profit Analytics Widget
// ==========================================
function updateLiveCalculator() {
    const costPaper = state.recipe.paper * state.pricesToday.paper;
    const costCover = state.recipe.cover * state.pricesToday.cover;
    const costBinding = state.recipe.binding * state.pricesToday.binding;
    const costLabor = NOTEBOOK_CONFIG.laborCost;

    const totalUnitCost = costPaper + costCover + costBinding + costLabor;
    const sellingPrice = state.pricePerUnit || 0;
    const profitPerUnit = sellingPrice - totalUnitCost;
    const marginPct = sellingPrice > 0 ? (profitPerUnit / sellingPrice) * 100 : 0;

    const fixedCostToday = state.marketingCost;
    let breakEvenUnits = 0;
    if (profitPerUnit > 0) {
        breakEvenUnits = Math.ceil(fixedCostToday / profitPerUnit);
    }

    // Render Widget DOM
    document.getElementById("calc-cost-paper").textContent = `฿${costPaper.toFixed(2)}`;
    document.getElementById("calc-cost-cover").textContent = `฿${costCover.toFixed(2)}`;
    document.getElementById("calc-cost-binding").textContent = `฿${costBinding.toFixed(2)}`;
    document.getElementById("calc-cost-labor").textContent = `฿${costLabor.toFixed(2)}`;
    document.getElementById("calc-total-unit-cost").textContent = `฿${totalUnitCost.toFixed(2)}`;

    const elProfitUnit = document.getElementById("calc-profit-unit");
    elProfitUnit.textContent = (profitPerUnit >= 0 ? "+" : "") + `฿${profitPerUnit.toFixed(2)}`;
    elProfitUnit.style.color = profitPerUnit >= 0 ? "var(--success)" : "var(--danger)";

    const badge = document.getElementById("margin-badge");
    badge.className = "margin-pill";
    if (profitPerUnit <= 0) {
        badge.classList.add("loss");
        badge.textContent = `ขาดทุน (${marginPct.toFixed(1)}%)`;
    } else if (marginPct < 15) {
        badge.classList.add("low");
        badge.textContent = `กำไรบางมาก (${marginPct.toFixed(1)}%)`;
    } else if (marginPct <= 45) {
        badge.classList.add("good");
        badge.textContent = `กำไรเหมาะสม (${marginPct.toFixed(1)}%)`;
    } else {
        badge.classList.add("great");
        badge.textContent = `กำไรสูงมาก (${marginPct.toFixed(1)}%)`;
    }

    document.getElementById("calc-breakeven").textContent = 
        profitPerUnit > 0 ? `${breakEvenUnits} เล่ม` : "ไม่คุ้มทุน (ขาดทุนต่อหน่วย)";
}

// ==========================================
// Simulation Process
// ==========================================
function openMarket() {
    const purchaseCost = getPurchaseCost();
    const totalDeduction = purchaseCost + state.marketingCost;

    if (totalDeduction > state.cash) {
        alert("⚠️ เงินทุนไม่พอสำหรับค่าสั่งซื้อวัตถุดิบและค่างบการตลาดรวมกัน!");
        return;
    }

    // Deduct cash and add materials to stock
    state.cash -= totalDeduction;
    state.inventory.paper += state.buyQty.paper;
    state.inventory.cover += state.buyQty.cover;
    state.inventory.binding += state.buyQty.binding;

    processDailyMarket();
}

function processDailyMarket() {
    const event = dailyEvents[state.day - 1];

    // 1. Calculate Base Demand
    let baseDemand = 16 + Math.floor(Math.random() * 15); // 16-30 customers base
    
    // Reputation factor (0.5 to 1.5)
    const repMod = 0.5 + (state.reputation / 100);
    baseDemand *= repMod;

    // Marketing factor
    let marketingFactor = 1.0;
    const channel = MARKETING_CHANNELS.find(m => m.value === state.marketingCost);
    if (channel) marketingFactor = channel.mod;
    baseDemand *= marketingFactor;

    // Daily Event factor
    baseDemand *= event.demandMod;

    // 2. Price & Quality Evaluation
    // Quality based on number of paper sheets (60 is baseline standard)
    const paperRatio = state.recipe.paper / 60;
    const qualityScore = Math.min(1.5, Math.max(0.6, paperRatio));

    // Ideal price calculation
    const idealPrice = NOTEBOOK_CONFIG.idealPriceBase * (0.65 + qualityScore * 0.35) * event.priceMod;
    const priceRatio = state.pricePerUnit / idealPrice;

    let priceAcceptanceRatio = 1.0;
    if (priceRatio > 1.45) {
        priceAcceptanceRatio = 0.18; // ราคาแพงเกินไป
    } else if (priceRatio > 1.15) {
        priceAcceptanceRatio = 0.6; // ค่อนข้างสูง
    } else if (priceRatio < 0.8) {
        priceAcceptanceRatio = 1.4; // คุ้มค่ามาก
    } else {
        priceAcceptanceRatio = 1.05; // ราคาเหมาะสม
    }

    let finalDemand = Math.round(baseDemand * priceAcceptanceRatio);
    if (finalDemand < 1) finalDemand = 1;

    // 3. Fulfill orders according to inventory
    let unitsSold = 0;
    let ranOutOfPaper = false;
    let ranOutOfCover = false;
    let ranOutOfBinding = false;

    for (let i = 0; i < finalDemand; i++) {
        if (state.inventory.paper < state.recipe.paper) {
            ranOutOfPaper = true;
            break;
        }
        if (state.inventory.cover < state.recipe.cover) {
            ranOutOfCover = true;
            break;
        }
        if (state.inventory.binding < state.recipe.binding) {
            ranOutOfBinding = true;
            break;
        }

        state.inventory.paper -= state.recipe.paper;
        state.inventory.cover -= state.recipe.cover;
        state.inventory.binding -= state.recipe.binding;
        unitsSold++;
    }

    // 4. Financial Calculations
    const revenue = unitsSold * state.pricePerUnit;
    const purchaseCost = getPurchaseCost();
    const laborPaid = unitsSold * NOTEBOOK_CONFIG.laborCost; // กระจายสู่กลุ่มแม่บ้าน/ช่างเย็บเล่ม
    const operationalCost = purchaseCost + state.marketingCost;
    const netProfit = revenue - operationalCost;

    // จัดสรร 10% สมทบกองทุนพัฒนาหมู่บ้าน
    let villageFundContribution = 0;
    if (netProfit > 0) {
        villageFundContribution = netProfit * 0.1;
        state.villageFund += villageFundContribution;
    }

    state.cash += (revenue - villageFundContribution);
    state.cumulativeProfit += netProfit;
    state.totalUnitsSold += unitsSold;
    state.totalLaborPaid += laborPaid;

    // 5. Customer Reviews & Reputation
    let feedbackLogs = [];
    let repChange = 0;

    if (unitsSold > 0) {
        if (state.recipe.paper >= 80) {
            repChange += 5;
            feedbackLogs.push({ text: `🌟 สมุดหนาจุใจ กระดาษถนอมสายตาเขียนลื่น ไม่ซึม หมึกไม่ทะลุ ลูกค้าประทับใจมาก!`, class: "positive" });
        } else if (state.recipe.paper < 45) {
            repChange -= 5;
            feedbackLogs.push({ text: `😞 สมุดบางไปหน่อยเมื่อเทียบกับงานปกสวยๆ ลูกค้าอยากให้เพิ่มจำนวนหน้า`, class: "negative" });
        } else {
            repChange += 2;
            feedbackLogs.push({ text: `📖 สมุดทำมือประณีต เย็บกี่แน่นหนา กางเขียนได้ 180 องศา ลูกค้าชื่นชอบ`, class: "" });
        }

        if (priceRatio > 1.2) {
            repChange -= 3;
            feedbackLogs.push({ text: `💸 ราคาเล่มละ ฿${state.pricePerUnit} ค่อนข้างสูงไปนิดเมื่อเทียบกับสมุดทั่วไป`, class: "negative" });
        } else if (priceRatio <= 0.82) {
            repChange += 3;
            feedbackLogs.push({ text: `❤️ ราคาเป็นมิตรคุ้มค่างานแฮนด์เมดมาก เหมาะเป็นของขวัญของฝาก`, class: "positive" });
        }

        feedbackLogs.push({ text: `🤝 วันนี้จ่ายค่าแรงงานฝีมือเย็บเล่มสู่สมาชิกกลุ่มชุมชน รวม ฿${laborPaid.toFixed(2)} บาท`, class: "positive" });
    }

    if (ranOutOfPaper || ranOutOfCover || ranOutOfBinding) {
        repChange -= 7;
        let missing = [];
        if (ranOutOfPaper) missing.push("กระดาษ");
        if (ranOutOfCover) missing.push("ปกผ้าทอ");
        if (ranOutOfBinding) missing.push("ด้าย/กาวเข้าเล่ม");
        
        feedbackLogs.push({
            text: `⚠️ วัตถุดิบหมดสต็อกระหว่างวัน (${missing.join(", ")}) พลาดโอกาสจำหน่ายไปถึง ${finalDemand - unitsSold} เล่ม!`,
            class: "negative"
        });
    }

    state.reputation = Math.min(100, Math.max(0, state.reputation + repChange));

    // Update Result Panel UI
    document.getElementById("res-total-demand").textContent = `${finalDemand} คน`;
    document.getElementById("res-sales-qty").textContent = `${unitsSold} เล่ม`;
    document.getElementById("res-revenue").textContent = `+฿${revenue.toFixed(2)}`;
    document.getElementById("res-cost-purchases").textContent = `-฿${purchaseCost.toFixed(2)}`;
    document.getElementById("res-cost-marketing").textContent = `-฿${state.marketingCost.toFixed(2)}`;
    document.getElementById("res-village-fund-deduct").textContent = 
        villageFundContribution > 0 ? `-฿${villageFundContribution.toFixed(2)}` : "฿0.00";
    
    const elNet = document.getElementById("res-net-profit");
    elNet.textContent = (netProfit >= 0 ? "+" : "") + `฿${netProfit.toFixed(2)}`;
    elNet.style.color = netProfit >= 0 ? "var(--success)" : "var(--danger)";

    // Feedback List
    const feedbackList = document.getElementById("customer-feedback");
    feedbackList.innerHTML = "";
    if (feedbackLogs.length === 0) {
        feedbackList.innerHTML = `<li>ไม่มีลูกค้าแวะมาชมสมุดในวันนี้เลย ลองปรับราคาหรือโปรโมทผ่านช่องทางออนไลน์ดูนะครับ</li>`;
    } else {
        feedbackLogs.forEach(log => {
            const li = document.createElement("li");
            if (log.class) li.className = log.class;
            li.innerHTML = `<span>${log.text}</span>`;
            feedbackList.appendChild(li);
        });
    }

    // Stocks Left
    document.getElementById("res-stock-paper").textContent = `${state.inventory.paper} แผ่น`;
    document.getElementById("res-stock-cover").textContent = `${state.inventory.cover} ชุด`;
    document.getElementById("res-stock-binding").textContent = `${state.inventory.binding} ชุด`;

    // Show Results Panel
    document.getElementById("panel-prep").classList.add("hide");
    document.getElementById("panel-results").classList.remove("hide");
    updateTopIndicators();
}

function nextDay() {
    if (state.day < 7) {
        state.day++;
        document.getElementById("panel-results").classList.add("hide");
        document.getElementById("panel-prep").classList.remove("hide");
        initDay();
    } else {
        endGame();
    }
}

function endGame() {
    document.getElementById("panel-results").classList.add("hide");
    document.getElementById("panel-prep").classList.add("hide");
    document.getElementById("event-banner").classList.add("hide");
    document.getElementById("panel-gameover").classList.remove("hide");

    const finalWealth = state.cash + state.villageFund;
    let grade = "F";
    let statusTitle = "";
    let commentary = "";

    if (finalWealth >= 3200 && state.reputation >= 70) {
        grade = "A+";
        statusTitle = "🏆 ปราชญ์ผู้สร้างสรรค์งานสมุดทำมือดีเด่นระดับชาติ!";
        commentary = "ท่านบริหารต้นทุน กำไร และคัดสรรจำนวนกระดาษได้อย่างสมบูรณ์แบบ สามารถสร้างมูลค่าเพิ่มให้งานหัตถกรรมชุมชนและสร้างรายได้ให้ชาวบ้านอย่างยั่งยืน!";
    } else if (finalWealth >= 2500 && state.reputation >= 60) {
        grade = "A";
        statusTitle = "🌟 ช่างฝีมือและผู้จัดการวิสาหกิจชุมชนยอดเยี่ยม!";
        commentary = "การเงินมั่งคั่ง ควบคุมต้นทุนกระดาษและปกได้ดีเยี่ยม สมุดทำมือบ้านโมกุลมีชื่อเสียงเป็นที่ต้องการของตลาด";
    } else if (finalWealth >= 1800) {
        grade = "B";
        statusTitle = "👍 ผู้นำกลุ่มหัตถกรรมเข้มแข็ง";
        commentary = "บริหารจัดการได้ดี สมุดมีกำไรสม่ำเสมอและสมาชิกกลุ่มได้รับค่าแรงเย็บเล่มต่อเนื่อง หากทำตลาดออนไลน์เชิงรุกจะเติบโตได้อีกไกล";
    } else if (finalWealth >= 1400) {
        grade = "C";
        statusTitle = "⚖️ ประคองกลุ่มหัตถกรรมรอดพ้นความเสี่ยง";
        commentary = "รักษาสภาพคล่องไว้ได้ แต่กำไรยังบาง ควรหมั่นตรวจสอบการตั้งราคาขายและระวังกระดาษขาดสต็อก";
    } else if (finalWealth >= 1000) {
        grade = "D";
        statusTitle = "⚠️ สภาพคล่องตึงตัว ต้องปรับแผนด่วน";
        commentary = "เกือบขาดทุนสะสม แนะนำให้คำนวณจุดคุ้มทุนทุกครั้งก่อนเปิดรอบการผลิต และตั้งราคาให้ครอบคลุมค่าแรงฝีมือ";
    } else {
        grade = "F";
        statusTitle = "❌ กลุ่มวิสาหกิจประสบปัญหาขาดทุนสะสม";
        commentary = "เงินทุนติดลบ แนะนำให้ทบทวนสูตรคิดต้นทุนต่อเล่มและการเลือกช่องทางการตลาดใหม่นะครับ";
    }

    document.getElementById("end-grade").textContent = grade;
    document.getElementById("end-status-title").textContent = statusTitle;
    document.getElementById("end-commentary").textContent = commentary;

    document.getElementById("end-cash").textContent = `฿${Math.round(state.cash).toLocaleString()}`;
    document.getElementById("end-profit").textContent = `฿${Math.round(state.cumulativeProfit).toLocaleString()}`;
    document.getElementById("end-village-fund").textContent = `฿${Math.round(state.villageFund).toLocaleString()}`;
    document.getElementById("end-labor-paid").textContent = `฿${Math.round(state.totalLaborPaid).toLocaleString()}`;
    document.getElementById("end-reputation").textContent = `${Math.round(state.reputation)}%`;
    document.getElementById("end-units-sold").textContent = `${state.totalUnitsSold} เล่ม`;
}

function restartGame() {
    state = getInitialState();

    document.getElementById("panel-prep").classList.remove("hide");
    document.getElementById("panel-results").classList.add("hide");
    document.getElementById("panel-gameover").classList.add("hide");

    initDay();
}
