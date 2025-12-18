exports.calculateOrderBonus = function (products) {
    const ITEM_FACTOR = 10;

    return products.reduce((sum, p) => {
        const qty = p.maxQuantity || 0;
        return sum + qty * ITEM_FACTOR;
    }, 0);
};
