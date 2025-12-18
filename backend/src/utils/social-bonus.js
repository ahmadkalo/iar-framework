exports.calculateSocialBonus = function (records) {
    const SCORE_FACTOR = 50; // frei gewählt, aber begründet

    return records.reduce((sum, r) => {
        return sum + (r.score * SCORE_FACTOR);
    }, 0);
};
