/**
 * Social bonus calculation:
 * - Score factor: 50€ per score point
 * - Age factor: 50€ per year older than targetYear
 *
 * @param {Array<{score:number, year:number}>} records
 * @param {number} targetYear the year for which you compute the bonus (e.g., 2025)
 * @returns {{total:number, breakdown:Array}}
 */
exports.calculateSocialBonus = function (records, targetYear) {
    const SCORE_FACTOR = 50;
    const AGE_FACTOR = 50;

    let total = 0;

    const breakdown = records.map(r => {
        const age = Math.max(0, targetYear - Number(r.year)); // older => positive
        const value = (Number(r.score) * SCORE_FACTOR) + (age * AGE_FACTOR);
        total += value;

        return {

            category: r.category,
            score: r.score,
            year: r.year,
            age,
            value
        };
    });

    return { total, breakdown };
};
