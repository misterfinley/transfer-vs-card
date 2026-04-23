import assert from "node:assert/strict";
import test from "node:test";
import { compareCosts } from "../src/calc.ts";
test("compareCosts returns transfer as winner for lower total fee", () => {
    const result = compareCosts({
        amountUsd: 1000,
        transferPercentFee: 0.005,
        transferFlatFeeUsd: 1,
        cardPercentFee: 0.03,
        cardFixedFeeUsd: 0.3,
        transferFxMarkupPercent: 0.005,
        cardFxMarkupPercent: 0.02,
        baseFxRate: 0.9
    });
    assert.equal(result.winner, "transfer");
    assert.equal(Number(result.transferTotalCostUsd.toFixed(2)), 1006);
    assert.equal(Number(result.cardTotalCostUsd.toFixed(2)), 1030.3);
});
test("compareCosts returns tie for equal cost", () => {
    const result = compareCosts({
        amountUsd: 100,
        transferPercentFee: 0,
        transferFlatFeeUsd: 0,
        cardPercentFee: 0,
        cardFixedFeeUsd: 0,
        transferFxMarkupPercent: 0,
        cardFxMarkupPercent: 0,
        baseFxRate: 1
    });
    assert.equal(result.winner, "tie");
    assert.equal(result.transferRecipientAmount, 100);
    assert.equal(result.cardRecipientAmount, 100);
});
