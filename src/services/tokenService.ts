const tokenPricing: Record<string, number> = {
    "gpt-4": 0.2, // Стоимость одного токена в кредитах
    "gemini-flash": 0.1,
};
  
export const calculateTokenCost = (model: string, tokens: number): number => {
    const pricePerToken = tokenPricing[model];
    if (!pricePerToken) {
      throw new Error("Model not supported");
    }
    return Math.ceil(tokens * pricePerToken); // Округление до ближайшего большего значения
};
  