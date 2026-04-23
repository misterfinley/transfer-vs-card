export type PaymentInput = {
  amountUsd: number;
  transferPercentFee: number;
  transferFlatFeeUsd: number;
  cardPercentFee: number;
  cardFixedFeeUsd: number;
  transferFxMarkupPercent: number;
  cardFxMarkupPercent: number;
  baseFxRate: number;
};

export type ComparisonResult = {
  transferTotalCostUsd: number;
  cardTotalCostUsd: number;
  transferRecipientAmount: number;
  cardRecipientAmount: number;
  winner: "transfer" | "card" | "tie";
};

export function compareCosts(input: PaymentInput): ComparisonResult {
  const transferFee = input.amountUsd * input.transferPercentFee + input.transferFlatFeeUsd;
  const cardFee = input.amountUsd * input.cardPercentFee + input.cardFixedFeeUsd;

  const transferTotalCostUsd = input.amountUsd + transferFee;
  const cardTotalCostUsd = input.amountUsd + cardFee;

  const transferEffectiveRate = input.baseFxRate * (1 - input.transferFxMarkupPercent);
  const cardEffectiveRate = input.baseFxRate * (1 - input.cardFxMarkupPercent);

  const transferRecipientAmount = input.amountUsd * transferEffectiveRate;
  const cardRecipientAmount = input.amountUsd * cardEffectiveRate;

  const winner =
    transferTotalCostUsd < cardTotalCostUsd
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
