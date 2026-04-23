import { compareCosts } from "./calc.js";
const MOCK_CONFIG = {
    transferPercentFee: 0.0075,
    transferFlatFeeUsd: 1,
    cardPercentFee: 0.029,
    cardFixedFeeUsd: 0.3,
    transferFxMarkupPercent: 0.005,
    cardFxMarkupPercent: 0.02,
    baseFxRate: 0.92
};
async function loadConfig() {
    const forceMock = new URLSearchParams(window.location.search).get("mock") === "1";
    if (forceMock) {
        return { config: MOCK_CONFIG, mode: "mock" };
    }
    try {
        const response = await fetch("https://open.er-api.com/v6/latest/USD", { cache: "no-store" });
        if (!response.ok) {
            throw new Error(`Rate API returned ${response.status}`);
        }
        const data = (await response.json());
        const eurRate = data.rates?.EUR;
        if (!eurRate) {
            throw new Error("EUR rate missing");
        }
        return {
            config: {
                ...MOCK_CONFIG,
                baseFxRate: eurRate
            },
            mode: "live"
        };
    }
    catch {
        return { config: MOCK_CONFIG, mode: "mock" };
    }
}
function toCurrency(value) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2
    }).format(value);
}
function toRecipient(value) {
    return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 2
    }).format(value);
}
function render(input, mode) {
    const result = compareCosts(input);
    const modeBadge = document.getElementById("mode-badge");
    const transferCost = document.getElementById("transfer-cost");
    const cardCost = document.getElementById("card-cost");
    const transferGets = document.getElementById("transfer-gets");
    const cardGets = document.getElementById("card-gets");
    const winner = document.getElementById("winner");
    if (!modeBadge || !transferCost || !cardCost || !transferGets || !cardGets || !winner) {
        return;
    }
    modeBadge.textContent = mode === "live" ? "Live FX" : "Mock mode";
    transferCost.textContent = toCurrency(result.transferTotalCostUsd);
    cardCost.textContent = toCurrency(result.cardTotalCostUsd);
    transferGets.textContent = toRecipient(result.transferRecipientAmount);
    cardGets.textContent = toRecipient(result.cardRecipientAmount);
    winner.textContent =
        result.winner === "tie"
            ? "Both methods cost the same."
            : `${result.winner === "transfer" ? "Bank transfer" : "Card"} is cheaper for this amount.`;
}
async function start() {
    const amountInput = document.getElementById("amount");
    const refreshButton = document.getElementById("refresh");
    if (!amountInput || !refreshButton) {
        return;
    }
    const safeAmountInput = amountInput;
    async function refresh() {
        const amountUsd = Number(safeAmountInput.value) || 0;
        const { config, mode } = await loadConfig();
        render({
            amountUsd,
            ...config
        }, mode);
    }
    safeAmountInput.addEventListener("input", () => {
        void refresh();
    });
    refreshButton.addEventListener("click", () => {
        void refresh();
    });
    await refresh();
}
void start();
