// ==========================================
// วิสาหกิจชุมชน ไทคูน (Community Product Tycoon Simulator)
// ระบบจำลองธุรกิจและฝึกคิดราคาต้นทุน-กำไร ผลิตภัณฑ์ชุมชนบ้านโมกุล
// ==========================================

// สินค้าชุมชนที่มีให้เลือกฝึก
const PRODUCTS = {
    banana: {
        id: "banana",
        name: "กล้วยเบรกแตกอบเนยสมุนไพร",
        badge: "🍌 แปรรูปเกษตร OTOP",
        unit: "ซอง",
        defaultPrice: 35,
        idealPriceBase: 32,
        laborCost: 4, // ค่าแรงชุมชนต่อชิ้น
        materials: {
            mat1: { id: "mat1", name: "กล้วยน้ำว้าแก่คัดพิเศษ", unit: "กก.", basePrice: 16, defaultStock: 30, stepBuy: 5, defaultRecipe: 0.4, minRec: 0.2, maxRec: 0.8, stepRec: 0.1 },
            mat2: { id: "mat2", name: "เนยแท้ & สมุนไพรอบกรอบ", unit: "แพ็ค", basePrice: 22, defaultStock: 20, stepBuy: 2, defaultRecipe: 0.2, minRec: 0.1, maxRec: 0.5, stepRec: 0.05 },
            mat3: { id: "mat3", name: "ซองฟอยล์ซิปล็อค & ฉลาก OTOP", unit: "ใบ", basePrice: 4, defaultStock: 35, stepBuy: 10, defaultRecipe: 1, minRec: 1, maxRec: 1, stepRec: 1 }
        }
    },
    chili: {
        id: "chili",
        name: "น้ำพริกสมุนไพรปลาย่างโบราณ",
        badge: "🌶️ สูตรโบราณบ้านโมกุล",
        unit: "กระปุก",
        defaultPrice: 45,
        idealPriceBase: 42,
        laborCost: 6,
        materials: {
            mat1: { id: "mat1", name: "เนื้อปลาช่อนย่าง & สมุนไพรสด", unit: "กก.", basePrice: 38, defaultStock: 20, stepBuy: 2, defaultRecipe: 0.3, minRec: 0.15, maxRec: 0.6, stepRec: 0.05 },
            mat2: { id: "mat2", name: "พริกคั่ว & เครื่องแกงสูตรโบราณ", unit: "แพ็ค", basePrice: 24, defaultStock: 20, stepBuy: 2, defaultRecipe: 0.2, minRec: 0.1, maxRec: 0.4, stepRec: 0.05 },
            mat3: { id: "mat3", name: "กระปุกสุญญากาศ & สติกเกอร์ฝา", unit: "กระปุก", basePrice: 5.5, defaultStock: 30, stepBuy: 10, defaultRecipe: 1, minRec: 1, maxRec: 1, stepRec: 1 }
        }
    },
    soap: {
        id: "soap",
        name: "สบู่สมุนไพรขมิ้นชันน้ำผึ้งป่า",
        badge: "🧼 ของใช้สมุนไพรชุมชน",
        unit: "ก้อน",
        defaultPrice: 59,
        idealPriceBase: 55,
        laborCost: 7,
        materials: {
            mat1: { id: "mat1", name: "กลีเซอรีนเบสธรรมชาติพรีเมียม", unit: "กก.", basePrice: 35, defaultStock: 20, stepBuy: 2, defaultRecipe: 0.25, minRec: 0.1, maxRec: 0.5, stepRec: 0.05 },
            mat2: { id: "mat2", name: "ขมิ้นชันสกัด & น้ำผึ้งป่าแท้", unit: "ขวด", basePrice: 28, defaultStock: 15, stepBuy: 2, defaultRecipe: 0.15, minRec: 0.1, maxRec: 0.4, stepRec: 0.05 },
            mat3: { id: "mat3", name: "กล่องกระดาษคราฟท์รักษ์โลก & ซีล", unit: "กล่อง", basePrice: 5, defaultStock: 30, stepBuy: 10, defaultRecipe: 1, minRec: 1, maxRec: 1, stepRec: 1 }
        }
    }
};

// เหตุการณ์ประจำวัน 7 วัน
const dailyEvents = [
    {
        title: "🌿 เปิดตัวกลุ่มวิสาหกิจชุมชนวันแรก (วันฟ้าใส)",
        desc: "ชาวบ้านร่วมแรงร่วมใจ อากาศแจ่มใส มีลูกค้าสัญจรและผู้มาติดต่อราชการแวะอุดหนุนอย่างต่อเนื่อง เป็นวันที่ดีในการทดสอบสูตรและตั้งราคาที่เป็นมิตร!",
        icon: "☀️",
        demandMod: 1.0,
        priceMod: 1.0
    },
    {
        title: "🌧️ ฤดูมรสุมเข้า พายุฝนตกหนักในพื้นที่",
        desc: "ฝนตกตลอดทั้งวัน ลูกค้าเดินหน้าร้านลดลง 25% แต่คนหันมาสั่งซื้อผ่านแชทและส่งพัสดุมากขึ้น การเลือกโปรโมทออนไลน์วันนี้จะได้ผลตอบรับดียิ่งขึ้น!",
        icon: "⛈️",
        demandMod: 0.75,
        priceMod: 1.05
    },
    {
        title: "📉 วิกฤตราคาผลผลิตการเกษตรผันผวน",
        desc: "ผลผลิตวัตถุดิบหลักขาดตลาดชั่วคราว ส่งผลให้ราคาวัตถุดิบหลักวันนี้พุ่งขึ้น 40%! ควรคำนวณต้นทุนต่อหน่วยใหม่และปรับราคาขายให้เหมาะสมเพื่อรักษาผลกำไร",
        icon: "⚠️",
        demandMod: 1.0,
        priceMod: 1.0,
        mat1PriceMult: 1.4
    },
    {
        title: "🚌 คณะศึกษาดูงานและรถทัวร์แวะศูนย์เรียนรู้",
        desc: "มีคณะศึกษาดูงานวิสาหกิจชุมชนและรถทัวร์ท่องเที่ยวแวะเข้ามาชมงาน ยอดความต้องการซื้อของฝากพุ่งสูงขึ้น 75%! เตรียมสต็อกสินค้าให้พร้อมรับมือ",
        icon: "🚌",
        demandMod: 1.75,
        priceMod: 1.15
    },
    {
        title: "⭐ สินค้าผ่านการคัดสรรมาตรฐาน OTOP ติดดาว",
        desc: "ความภาคภูมิใจของชุมชน! สินค้าได้รับรองมาตรฐานระดับจังหวัด ส่งผลให้ชื่อเสียงกลุ่มพุ่งขึ้น ลูกค้ามีความเชื่อมั่นสูงและยอมรับราคาพรีเมียมได้ดีขึ้น",
        icon: "🏆",
        demandMod: 1.35,
        priceMod: 1.25,
        repBonus: 8
    },
    {
        title: "🏭 มีสินค้าโรงงานภายนอกมาขายตัดราคา",
        desc: "มีสินค้าสำเร็จรูปราคาถูกจากภายนอกมาวางจำหน่ายแข่งขัน หากเราเน้นคุณภาพของแท้จากธรรมชาติและตั้งราคาที่สมเหตุสมผล ลูกค้าขาประจำจะไม่ทิ้งเรา!",
        icon: "⚔️",
        demandMod: 0.85,
        priceMod: 0.9
    },
    {
        title: "🎪 มหกรรมงานของดีประจำจังหวัดวันสุดท้าย",
        desc: "วันปิดงานเทศกาลของดี ผู้คนหลั่งไหลมาซื้อของฝากติดไม้ติดมือกลับบ้านอย่างล้นหลาม ความต้องการสินค้าเพิ่มขึ้นเท่าตัว มาทำยอดขายส่งท้ายให้งดงาม!",
        icon: "🎉",
        demandMod: 2.0,
        priceMod: 1.2
    }
];

// ช่องทางการตลาดชุมชน
const MARKETING_CHANNELS = [
    { value: 0, name: "วางขายหน้าศูนย์เรียนรู้ชุมชน (฿0)", mod: 1.0, desc: "ไม่มีค่าใช้จ่าย อาศัยลูกค้าสัญจรปกติ" },
    { value: 100, name: "ฝากวางขายร้านของฝากประจำอำเภอ/ปั๊มน้ำมัน (฿100)", mod: 1.35, desc: "เพิ่มลูกค้ากลุ่มเดินทาง +35%" },
    { value: 300, name: "ออกบูธงานมหกรรม OTOP & กาชาดจังหวัด (฿300)", mod: 1.75, desc: "เข้าถึงลูกค้าระดับจังหวัด +75%" },
    { value: 500, name: "Live สดขายผ่าน TikTok & Facebook ชุมชน (฿500)", mod: 2.25, desc: "กระแสโซเชียล ยอดสั่งซื้อพุ่ง +125%" }
];

// สถานะการเล่น
let currentProductKey = "banana";

function getInitialState(prodKey) {
    const prod = PRODUCTS[prodKey];
    return {
        productKey: prodKey,
        day: 1,
        cash: 1200, // เงินทุนหมุนเวียนเริ่มต้น 1,200 บาท
        reputation: 50, // ชื่อเสียง 50%
        villageFund: 0, // กองทุนพัฒนาหมู่บ้านสะสม
        inventory: {
            mat1: prod.materials.mat1.defaultStock,
            mat2: prod.materials.mat2.defaultStock,
            mat3: prod.materials.mat3.defaultStock
        },
        pricesToday: {
            mat1: prod.materials.mat1.basePrice,
            mat2: prod.materials.mat2.basePrice,
            mat3: prod.materials.mat3.basePrice
        },
        buyQty: {
            mat1: 0,
            mat2: 0,
            mat3: 0
        },
        recipe: {
            mat1: prod.materials.mat1.defaultRecipe,
            mat2: prod.materials.mat2.defaultRecipe,
            mat3: prod.materials.mat3.defaultRecipe
        },
        pricePerUnit: prod.defaultPrice,
        marketingCost: 0,
        cumulativeProfit: 0,
        totalUnitsSold: 0,
        totalLaborPaid: 0
    };
}

let state = getInitialState(currentProductKey);

// ==========================================
// DOM Initialization & Event Listeners
// ==========================================
window.addEventListener("DOMContentLoaded", () => {
    buildMarketingOptions();
    setupEventListeners();
    initDay();
});

function setupEventListeners() {
    // Product Switchers
    document.querySelectorAll(".product-chip").forEach(chip => {
        chip.addEventListener("click", () => {
            const chosen = chip.getAttribute("data-product");
            if (chosen !== currentProductKey) {
                if (state.day > 1 && !confirm("หากเปลี่ยนผลิตภัณฑ์ ระบบจะเริ่มรอบการคำนวณใหม่ ยืนยันหรือไม่?")) {
                    return;
                }
                switchProduct(chosen);
            }
        });
    });

    // Sliders input
    const sliderMat1 = document.getElementById("rec-mat1");
    const sliderMat2 = document.getElementById("rec-mat2");

    sliderMat1.addEventListener("input", (e) => {
        const val = parseFloat(e.target.value);
        state.recipe.mat1 = val;
        document.getElementById("lbl-rec-mat1").textContent = val.toFixed(2);
        updateLiveCalculator();
    });

    sliderMat2.addEventListener("input", (e) => {
        const val = parseFloat(e.target.value);
        state.recipe.mat2 = val;
        document.getElementById("lbl-rec-mat2").textContent = val.toFixed(2);
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
    document.getElementById("btn-restart").addEventListener("click", () => restartGame(false));
    document.getElementById("btn-restart-game").addEventListener("click", () => restartGame(false));

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

function switchProduct(key) {
    currentProductKey = key;
    document.querySelectorAll(".product-chip").forEach(c => {
        c.classList.toggle("active", c.getAttribute("data-product") === key);
    });
    state = getInitialState(key);
    initDay();
}

// ==========================================
// Daily Cycle & Calculation Logic
// ==========================================

function initDay() {
    const prod = PRODUCTS[currentProductKey];
    const event = dailyEvents[state.day - 1];

    // Reset daily buy quantities
    state.buyQty = { mat1: 0, mat2: 0, mat3: 0 };
    document.getElementById("buy-mat1").value = 0;
    document.getElementById("buy-mat2").value = 0;
    document.getElementById("buy-mat3").value = 0;

    // Apply daily event reputation bonus if any
    if (event.repBonus) {
        state.reputation = Math.min(100, state.reputation + event.repBonus);
    }

    // Fluctuate daily prices
    let p1 = prod.materials.mat1.basePrice;
    if (event.mat1PriceMult) {
        p1 *= event.mat1PriceMult;
    } else {
        p1 += (Math.random() * 4 - 2); // +/- 2 baht
    }
    let p2 = prod.materials.mat2.basePrice + (Math.random() * 3 - 1.5);
    let p3 = prod.materials.mat3.basePrice;

    state.pricesToday.mat1 = Math.max(5, Math.round(p1 * 10) / 10);
    state.pricesToday.mat2 = Math.max(5, Math.round(p2 * 10) / 10);
    state.pricesToday.mat3 = Math.max(1, Math.round(p3 * 10) / 10);

    // Update Banner
    const banner = document.getElementById("event-banner");
    banner.classList.remove("hide");
    document.getElementById("event-icon").textContent = event.icon;
    document.getElementById("event-title").textContent = event.title;
    document.getElementById("event-description").textContent = event.desc;

    // Update Product Labels in UI
    document.getElementById("active-product-title").textContent = `${prod.name} (${prod.badge})`;
    document.getElementById("unit-badge").textContent = `ราคาขายต่อ${prod.unit} (บาท)`;
    document.getElementById("unit-label").textContent = prod.unit;

    // Set Slider Attributes
    const s1 = document.getElementById("rec-mat1");
    s1.min = prod.materials.mat1.minRec;
    s1.max = prod.materials.mat1.maxRec;
    s1.step = prod.materials.mat1.stepRec;
    s1.value = state.recipe.mat1;
    document.getElementById("lbl-rec-mat1").textContent = state.recipe.mat1.toFixed(2);
    document.getElementById("name-rec-mat1").textContent = `${prod.materials.mat1.name} (${prod.materials.mat1.unit})`;

    const s2 = document.getElementById("rec-mat2");
    s2.min = prod.materials.mat2.minRec;
    s2.max = prod.materials.mat2.maxRec;
    s2.step = prod.materials.mat2.stepRec;
    s2.value = state.recipe.mat2;
    document.getElementById("lbl-rec-mat2").textContent = state.recipe.mat2.toFixed(2);
    document.getElementById("name-rec-mat2").textContent = `${prod.materials.mat2.name} (${prod.materials.mat2.unit})`;

    document.getElementById("name-rec-mat3").textContent = `${prod.materials.mat3.name} (${prod.materials.mat3.unit})`;
    document.getElementById("lbl-rec-mat3").textContent = state.recipe.mat3;

    // Purchase Section labels & prices
    document.getElementById("label-buy-mat1").textContent = `${prod.materials.mat1.name} (${prod.materials.mat1.unit})`;
    document.getElementById("price-buy-mat1").textContent = `฿${state.pricesToday.mat1.toFixed(1)} / ${prod.materials.mat1.unit}`;

    document.getElementById("label-buy-mat2").textContent = `${prod.materials.mat2.name} (${prod.materials.mat2.unit})`;
    document.getElementById("price-buy-mat2").textContent = `฿${state.pricesToday.mat2.toFixed(1)} / ${prod.materials.mat2.unit}`;

    document.getElementById("label-buy-mat3").textContent = `${prod.materials.mat3.name} (${prod.materials.mat3.unit})`;
    document.getElementById("price-buy-mat3").textContent = `฿${state.pricesToday.mat3.toFixed(1)} / ${prod.materials.mat3.unit}`;

    // Price input setup
    document.getElementById("price-per-unit").value = state.pricePerUnit;

    // Top Bar Indicators
    updateTopIndicators();
    updateLiveCalculator();
    updatePurchaseTotal();
}

function updateTopIndicators() {
    const prod = PRODUCTS[currentProductKey];
    document.getElementById("day-indicator").textContent = `วันที่: ${state.day} / 7`;
    document.getElementById("val-cash").textContent = `฿${Math.round(state.cash).toLocaleString()}`;
    document.getElementById("val-reputation").textContent = `${Math.round(state.reputation)}%`;
    document.getElementById("val-village-fund").textContent = `฿${Math.round(state.villageFund).toLocaleString()}`;
    document.getElementById("val-stock-summary").textContent = 
        `${prod.materials.mat1.id}: ${state.inventory.mat1.toFixed(1)} | ${prod.materials.mat2.id}: ${state.inventory.mat2.toFixed(1)} | แพ็ก: ${state.inventory.mat3}`;
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
    return (state.buyQty.mat1 * state.pricesToday.mat1) +
           (state.buyQty.mat2 * state.pricesToday.mat2) +
           (state.buyQty.mat3 * state.pricesToday.mat3);
}

function updatePurchaseTotal() {
    const total = getPurchaseCost();
    document.getElementById("total-purchase").textContent = `฿${total.toFixed(2)}`;
}

// ==========================================
// Live Cost & Profit Analytics Widget
// ==========================================
function updateLiveCalculator() {
    const prod = PRODUCTS[currentProductKey];

    const costMat1 = state.recipe.mat1 * state.pricesToday.mat1;
    const costMat2 = state.recipe.mat2 * state.pricesToday.mat2;
    const costMat3 = state.recipe.mat3 * state.pricesToday.mat3;
    const costLabor = prod.laborCost;

    const totalUnitCost = costMat1 + costMat2 + costMat3 + costLabor;
    const sellingPrice = state.pricePerUnit || 0;
    const profitPerUnit = sellingPrice - totalUnitCost;
    const marginPct = sellingPrice > 0 ? (profitPerUnit / sellingPrice) * 100 : 0;

    // Calculate Break-Even Units for today's fixed costs
    const fixedCostToday = state.marketingCost;
    let breakEvenUnits = 0;
    if (profitPerUnit > 0) {
        breakEvenUnits = Math.ceil(fixedCostToday / profitPerUnit);
    }

    // Render Widget DOM
    document.getElementById("calc-cost-mat1").textContent = `฿${costMat1.toFixed(2)}`;
    document.getElementById("calc-cost-mat2").textContent = `฿${costMat2.toFixed(2)}`;
    document.getElementById("calc-cost-mat3").textContent = `฿${costMat3.toFixed(2)}`;
    document.getElementById("calc-cost-labor").textContent = `฿${costLabor.toFixed(2)}`;
    document.getElementById("calc-total-unit-cost").textContent = `฿${totalUnitCost.toFixed(2)}`;

    const elProfitUnit = document.getElementById("calc-profit-unit");
    elProfitUnit.textContent = (profitPerUnit >= 0 ? "+" : "") + `฿${profitPerUnit.toFixed(2)}`;
    elProfitUnit.style.color = profitPerUnit >= 0 ? "var(--success)" : "var(--danger)";

    // Margin status badge
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
        profitPerUnit > 0 ? `${breakEvenUnits} ${prod.unit}` : "ไม่คุ้มทุน (ขาดทุนต่อหน่วย)";
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
    state.inventory.mat1 += state.buyQty.mat1;
    state.inventory.mat2 += state.buyQty.mat2;
    state.inventory.mat3 += state.buyQty.mat3;

    processDailyMarket();
}

function processDailyMarket() {
    const prod = PRODUCTS[currentProductKey];
    const event = dailyEvents[state.day - 1];

    // 1. Calculate Base Demand
    let baseDemand = 18 + Math.floor(Math.random() * 16); // 18-34 customers base
    
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
    // Quality based on recipe proportion
    const recRatio1 = state.recipe.mat1 / prod.materials.mat1.defaultRecipe;
    const recRatio2 = state.recipe.mat2 / prod.materials.mat2.defaultRecipe;
    const qualityScore = (recRatio1 * 0.6) + (recRatio2 * 0.4); // 1.0 is standard

    // Ideal price calculation
    const idealPrice = prod.idealPriceBase * (0.6 + qualityScore * 0.4) * event.priceMod;
    const priceRatio = state.pricePerUnit / idealPrice;

    let priceAcceptanceRatio = 1.0;
    if (priceRatio > 1.5) {
        priceAcceptanceRatio = 0.15; // แพงเกินไปมาก ลูกค้าถอยหนี
    } else if (priceRatio > 1.2) {
        priceAcceptanceRatio = 0.55; // แพงไปหน่อย
    } else if (priceRatio < 0.75) {
        priceAcceptanceRatio = 1.45; // ราคาคุ้มค่ามาก แย่งกันซื้อ
    } else {
        priceAcceptanceRatio = 1.05; // ราคาเหมาะสมกับคุณภาพ
    }

    let finalDemand = Math.round(baseDemand * priceAcceptanceRatio);
    if (finalDemand < 1) finalDemand = 1;

    // 3. Fulfill orders according to inventory
    let unitsSold = 0;
    let ranOutOfMat1 = false;
    let ranOutOfMat2 = false;
    let ranOutOfMat3 = false;

    for (let i = 0; i < finalDemand; i++) {
        if (state.inventory.mat1 < state.recipe.mat1) {
            ranOutOfMat1 = true;
            break;
        }
        if (state.inventory.mat2 < state.recipe.mat2) {
            ranOutOfMat2 = true;
            break;
        }
        if (state.inventory.mat3 < state.recipe.mat3) {
            ranOutOfMat3 = true;
            break;
        }

        state.inventory.mat1 -= state.recipe.mat1;
        state.inventory.mat2 -= state.recipe.mat2;
        state.inventory.mat3 -= state.recipe.mat3;
        unitsSold++;
    }

    // 4. Financial Calculations
    const revenue = unitsSold * state.pricePerUnit;
    const purchaseCost = getPurchaseCost();
    const laborPaid = unitsSold * prod.laborCost; // จ่ายค่าแรงชาวบ้าน
    const operationalCost = purchaseCost + state.marketingCost;
    
    // กำไรจากการดำเนินงานวันนี้
    const netProfit = revenue - operationalCost;

    // จัดสรรกำไร 10% สู่กองทุนพัฒนาหมู่บ้าน (ถ้ามีกำไร)
    let villageFundContribution = 0;
    if (netProfit > 0) {
        villageFundContribution = netProfit * 0.1;
        state.villageFund += villageFundContribution;
    }

    state.cash += (revenue - villageFundContribution);
    state.cumulativeProfit += netProfit;
    state.totalUnitsSold += unitsSold;
    state.totalLaborPaid += laborPaid;

    // 5. Customer Reviews & Reputation Impact
    let feedbackLogs = [];
    let repChange = 0;

    if (unitsSold > 0) {
        if (qualityScore >= 1.25) {
            repChange += 5;
            feedbackLogs.push({ text: `🌟 รสชาติและคุณภาพยอดเยี่ยมมาก! อุดมด้วยวัตถุดิบชุมชนแท้ ลูกค้าบอกต่อปากต่อปาก`, class: "positive" });
        } else if (qualityScore < 0.75) {
            repChange -= 6;
            feedbackLogs.push({ text: `😞 คุณภาพและเครื่องปรุงจืดจางไปหน่อย รู้สึกไม่คุ้มค่าเท่าที่ควร`, class: "negative" });
        } else {
            repChange += 2;
            feedbackLogs.push({ text: `👍 คุณภาพมาตรฐาน สะอาด ถูกสุขอนามัย อุดหนุนสินค้าชุมชน`, class: "" });
        }

        if (priceRatio > 1.2) {
            repChange -= 3;
            feedbackLogs.push({ text: `💸 ราคาขายค่อนข้างสูงไปนิดเมื่อเทียบกับสินค้าทั่วไปในละแวกนี้`, class: "negative" });
        } else if (priceRatio <= 0.8) {
            repChange += 3;
            feedbackLogs.push({ text: `❤️ ราคาเป็นมิตรกับชาวบ้านและนักท่องเที่ยว ซื้อกลับไปเป็นของฝากเพียบ!`, class: "positive" });
        }

        feedbackLogs.push({ text: `🤝 วันนี้กระจายรายได้ค่าแรงงานสู่สมาชิกกลุ่มแม่บ้านชุมชน รวม ฿${laborPaid.toFixed(2)} บาท`, class: "positive" });
    }

    // Out of stock feedback
    if (ranOutOfMat1 || ranOutOfMat2 || ranOutOfMat3) {
        repChange -= 7;
        let missing = [];
        if (ranOutOfMat1) missing.push(prod.materials.mat1.name);
        if (ranOutOfMat2) missing.push(prod.materials.mat2.name);
        if (ranOutOfMat3) missing.push(prod.materials.mat3.name);
        
        feedbackLogs.push({
            text: `⚠️ สินค้าหมดสต็อกระหว่างวัน (${missing.join(", ")}) พลาดโอกาสขายให้ลูกค้าไปถึง ${finalDemand - unitsSold} คน!`,
            class: "negative"
        });
    }

    state.reputation = Math.min(100, Math.max(0, state.reputation + repChange));

    // Update Result Panel UI
    document.getElementById("res-total-demand").textContent = `${finalDemand} คน`;
    document.getElementById("res-sales-qty").textContent = `${unitsSold} ${prod.unit}`;
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
        feedbackList.innerHTML = `<li>ไม่มีลูกค้าเข้ามาซื้อในวันนี้เลย ลองพิจารณาปรับราคาขายหรือลงโฆษณาเพิ่มดูนะครับ</li>`;
    } else {
        feedbackLogs.forEach(log => {
            const li = document.createElement("li");
            if (log.class) li.className = log.class;
            li.innerHTML = `<span>${log.text}</span>`;
            feedbackList.appendChild(li);
        });
    }

    // Stocks Left
    document.getElementById("res-stock-mat1").textContent = `${state.inventory.mat1.toFixed(1)} ${prod.materials.mat1.unit}`;
    document.getElementById("res-stock-mat2").textContent = `${state.inventory.mat2.toFixed(1)} ${prod.materials.mat2.unit}`;
    document.getElementById("res-stock-mat3").textContent = `${state.inventory.mat3} ${prod.materials.mat3.unit}`;
    document.getElementById("res-label-stock-mat1").textContent = prod.materials.mat1.name;
    document.getElementById("res-label-stock-mat2").textContent = prod.materials.mat2.name;
    document.getElementById("res-label-stock-mat3").textContent = prod.materials.mat3.name;

    // Show Results Panel
    document.getElementById("panel-prep").classList.add("hide");
    document.getElementById("panel-results").classList.remove("hide");
    updateTopIndicators();
}

// ==========================================
// Next Day & End Game
// ==========================================
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

    // Evaluation Metric
    // Score based on cash + cumulative profit + village fund + reputation
    const finalWealth = state.cash + state.villageFund;
    let grade = "F";
    let statusTitle = "";
    let commentary = "";

    if (finalWealth >= 2800 && state.reputation >= 70) {
        grade = "A+";
        statusTitle = "🏆 ปราชญ์ผู้ประกอบการวิสาหกิจชุมชนดีเด่นระดับชาติ!";
        commentary = "ท่านบริหารต้นทุน กำไร และส่วนผสมวัตถุดิบได้อย่างไร้ที่ติ สามารถสร้างรายได้หมุนเวียนและสร้างกองทุนพัฒนาชุมชนได้อย่างยั่งยืน เป็นแบบอย่างยอดเยี่ยม!";
    } else if (finalWealth >= 2200 && state.reputation >= 60) {
        grade = "A";
        statusTitle = "🌟 ผู้จัดการวิสาหกิจชุมชนยอดเยี่ยม!";
        commentary = "การเงินมั่งคั่ง ควบคุมต้นทุนได้ดีเยี่ยม และสร้างความพึงพอใจให้ลูกค้าอย่างสูง สินค้าชุมชนเป็นที่รู้จักกว้างขวาง";
    } else if (finalWealth >= 1600) {
        grade = "B";
        statusTitle = "👍 ผู้นำกลุ่มชุมชนเข้มแข็ง";
        commentary = "บริหารจัดการได้ดี ธุรกิจมีกำไรต่อเนื่องและสมาชิกกลุ่มได้รับค่าแรงสม่ำเสมอ หากพัฒนาการตลาดเชิงรุกอีกนิดจะก้าวสู่ระดับแนวหน้า";
    } else if (finalWealth >= 1200) {
        grade = "C";
        statusTitle = "⚖️ ประคองกลุ่มวิสาหกิจรอดพ้นความเสี่ยง";
        commentary = "รักษาสภาพคล่องไว้ได้ แต่กำไรยังบาง ควรหมั่นตรวจสอบการตั้งราคาขายและระวังวัตถุดิบขาดสต็อก";
    } else if (finalWealth >= 800) {
        grade = "D";
        statusTitle = "⚠️ สภาพคล่องตึงตัว ต้องปรับแผนด่วน";
        commentary = "เกือบขาดทุนสะสม แนะนำให้คำนวณจุดคุ้มทุนทุกครั้งก่อนเปิดรอบการผลิต และคุมงบการตลาดไม่ให้บานปลาย";
    } else {
        grade = "F";
        statusTitle = "❌ กลุ่มวิสาหกิจประสบปัญหาขาดทุนสะสม";
        commentary = "เงินทุนติดลบหรือสินค้าไม่สามารถสร้างกำไรได้ แนะนำให้ทบทวนสูตรคิดต้นทุนต่อหน่วยและการตั้งราคาขายใหม่นะครับ";
    }

    document.getElementById("end-grade").textContent = grade;
    document.getElementById("end-status-title").textContent = statusTitle;
    document.getElementById("end-commentary").textContent = commentary;

    document.getElementById("end-cash").textContent = `฿${Math.round(state.cash).toLocaleString()}`;
    document.getElementById("end-profit").textContent = `฿${Math.round(state.cumulativeProfit).toLocaleString()}`;
    document.getElementById("end-village-fund").textContent = `฿${Math.round(state.villageFund).toLocaleString()}`;
    document.getElementById("end-labor-paid").textContent = `฿${Math.round(state.totalLaborPaid).toLocaleString()}`;
    document.getElementById("end-reputation").textContent = `${Math.round(state.reputation)}%`;
    document.getElementById("end-units-sold").textContent = `${state.totalUnitsSold} ${PRODUCTS[currentProductKey].unit}`;
}

function restartGame(isFullReset) {
    if (isFullReset) {
        currentProductKey = "banana";
    }
    state = getInitialState(currentProductKey);

    document.getElementById("panel-prep").classList.remove("hide");
    document.getElementById("panel-results").classList.add("hide");
    document.getElementById("panel-gameover").classList.add("hide");

    initDay();
}
