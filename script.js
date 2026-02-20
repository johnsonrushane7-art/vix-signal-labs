// -----------------------------
// VIX PRO SIGNAL LAB script.js
// -----------------------------

const app_id = "cmeoUB84RSARWQ2"; // your Deriv API password

// Connect to Deriv WebSocket
const ws = new WebSocket(`wss://ws.derivws.com/websockets/v3?app_id=${app_id}`);

ws.onopen = function () {
    console.log("Connected to Deriv");

    // Subscribe to live ticks for VIX 75 and VIX 10
    ws.send(JSON.stringify({ ticks: "R_75", subscribe: 1 }));
    ws.send(JSON.stringify({ ticks: "R_10", subscribe: 1 }));
};

let last75 = 0;
let last10 = 0;

// Handle incoming tick data
ws.onmessage = function(msg) {
    const data = JSON.parse(msg.data);

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

// Function to calculate probability and update signals
function updateDashboard(market, price) {
    // Simple probability: higher price = higher probability
    // You can customize this logic
    let probability = Math.floor(Math.random() * 100); // placeholder random probability
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

    document.getElementById("trend" + market).innerText = price; // show live price as trend
    document.getElementById("support" + market).innerText = "Auto"; // placeholder
    document.getElementById("win" + market).innerText = "N/A"; // placeholder
    document.getElementById("cool" + market).innerText = "0"; // placeholder
}
