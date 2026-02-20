// === CONFIGURATION ===
const MAX_TICKS = 20;
const UP_THRESHOLD = 80;
const DOWN_THRESHOLD = 20;

// === DATA STORAGE ===
let lastDigits75 = [];
let lastDigits10 = [];

// === UTILITY: UPDATE SIGNAL ELEMENT ===
function updateSignal(cardId, signalText) {
    const signalElement = document.getElementById(cardId);
    signalElement.classList.remove("buy", "sell", "neutral", "alert");
    signalElement.textContent = signalText;

    // Voice alert
    speakSignal(signalText);

    if (signalText === "BUY") {
        signalElement.classList.add("buy", "alert"); // green glow
    } else if (signalText === "SELL") {
        signalElement.classList.add("sell", "alert"); // red glow
    } else {
        signalElement.classList.add("neutral"); // gray
    }
}

// === SPEECH SYNTHESIS FUNCTION ===
function speakSignal(signalText) {
    if (signalText === "NO TRADE") return;

    let utterance = new SpeechSynthesisUtterance();
    utterance.lang = "en-US";

    if (signalText === "BUY") {
        utterance.text = "Buy up";
    } else if (signalText === "SELL") {
        utterance.text = "Buy down";
    }

    window.speechSynthesis.speak(utterance);
}

// === TREND CHECK FUNCTION ===
function checkTrend(ticks, signalId, probId) {
    if (ticks.length < MAX_TICKS) return;

    let upCount = 0;
    for (let i = 1; i < ticks.length; i++) {
        if (ticks[i] > ticks[i - 1]) upCount++;
    }

    let upPercent = (upCount / (ticks.length - 1)) * 100;

    if (upPercent >= UP_THRESHOLD) {
        updateSignal(signalId, "BUY");
    } else if (upPercent <= DOWN_THRESHOLD) {
        updateSignal(signalId, "SELL");
    } else {
        updateSignal(signalId, "NO TRADE");
    }

    document.getElementById(probId).textContent = Math.round(upPercent) + "%";
}

// === ADD TICK FUNCTIONS ===
function addTick75(tickValue) {
    lastDigits75.push(tickValue);
    if (lastDigits75.length > MAX_TICKS) lastDigits75.shift();
    checkTrend(lastDigits75, "signal75", "prob75");
}

function addTick10(tickValue) {
    lastDigits10.push(tickValue);
    if (lastDigits10.length > MAX_TICKS) lastDigits10.shift();
    checkTrend(lastDigits10, "signal10", "prob10");
}

// === LIVE FEED SETUP ===
const APP_ID = 128128;
let liveConnected = false;

try {
    const client = new DerivAPI({ appId: APP_ID, language: 'en' });

    client.subscribe({ ticks: 'R_75' }, (response) => {
        if (response.tick && response.tick.last !== undefined) {
            liveConnected = true;
            addTick75(response.tick.last);
        }
    });

    client.subscribe({ ticks: 'R_10' }, (response) => {
        if (response.tick && response.tick.last !== undefined) {
            liveConnected = true;
            addTick10(response.tick.last);
        }
    });
} catch (err) {
    console.error("Live connection failed, falling back to simulation:", err);
}

// === SIMULATION FALLBACK ===
setInterval(() => {
    if (!liveConnected) {
        let tick75 = Math.floor(Math.random() * 10);
        addTick75(tick75);

        let tick10 = Math.floor(Math.random() * 10);
        addTick10(tick10);
    }
}, 1000);
