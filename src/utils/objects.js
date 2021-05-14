export function shuffleArray(array) {
    if (!array.length || !array) throw new Error("Expected an array wit items and got", JSON.stringify(array));

    let result = [...array];
    let currentIndex = result.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = result[currentIndex];
        result[currentIndex] = result[randomIndex];
        result[randomIndex] = temporaryValue;
    }

    if (array[0] === result[0]) {
        return shuffleArray(result);
    }

    return result;
}