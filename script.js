// -----------------------------
// VIX PRO SIGNAL LAB - LIVE SCRIPT
// -----------------------------

const app_id = "cmeoUB84RSARWQ2"; // Your Deriv API password

// Connect to Deriv WebSocket
const ws = new WebSocket(`wss://ws.derivws.com/websockets/v3?app_id=${app_id}`);

// When connection opens
ws.onopen = function () {
    console.log("Connected to Deriv");

    // Subscribe to live ticks for VIX 75
    ws.send(JSON.stringify({ ticks: "R_75", subscribe: 1 }));

    // Subscribe to live ticks for VIX 10
    ws.send(JSON.stringify({ ticks: "R_10", subscribe: 1 }));
};

// Track last tick values
let last75 = 0;
let last10 = 0;

// Handle incoming tick messages
ws.onmessage = function(msg) {
    const data = JSON.parse(msg.data);

    // Check for live tick
    if (data.tick) {
        const symbol = data.tick.symbol;
        const price = data.tick.quote;

        if (symbol === "R_75") {
            last75 = price;
            updateDashboard("75", last75);
        }

        if (symbol === "R_10") {
            last10 = price;
            updateDashboard("10", last10);
        }
    }
};

// Update dashboard elements
function updateDashboard(market, price) {
    // Temporary simple probability logic (later can be improved)
    let probability = Math.floor(Math.random() * 100); // placeholder
    let signal = "NO TRADE";
    let signalClass = "neutral";

    if (probability >= 60) {
        signal = "RISE";
        signalClass = "rise alert";
    }

    // Update HTML elements
    document.getElementById("prob" + market).innerText = probability + "%";
    document.getElementById("signal" + market).innerText = signal;
    document.getElementById("signal" + market).className = signalClass;

    document.getElementById("trend" + market).innerText = price; // live price as trend
    document.getElementById("support" + market).innerText = "Auto"; // placeholder
    document.getElementById("win" + market).innerText = "N/A"; // placeholder
    document.getElementById("cool" + market).innerText = "0"; // placeholder
}
