export function compareCosts(input) {
    const transferFee = input.amountUsd * input.transferPercentFee + input.transferFlatFeeUsd;
    const cardFee = input.amountUsd * input.cardPercentFee + input.cardFixedFeeUsd;
    const transferTotalCostUsd = input.amountUsd + transferFee;
    const cardTotalCostUsd = input.amountUsd + cardFee;
    const transferEffectiveRate = input.baseFxRate * (1 - input.transferFxMarkupPercent);
    const cardEffectiveRate = input.baseFxRate * (1 - input.cardFxMarkupPercent);
    const transferRecipientAmount = input.amountUsd * transferEffectiveRate;
    const cardRecipientAmount = input.amountUsd * cardEffectiveRate;
    const winner = transferTotalCostUsd < cardTotalCostUsd
        ? "transfer"
        : cardTotalCostUsd < transferTotalCostUsd
            ? "card"
            : "tie";
    return {
        transferTotalCostUsd,
        cardTotalCostUsd,
        transferRecipientAmount,
        cardRecipientAmount,
        winner
    };
}
