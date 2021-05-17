import { nanoid } from "nanoid";
import { Node } from "slate";
import { shuffleArray } from "./objects";


export function getExerciseBlockProps(editor, path) {
    if (!editor || !path) throw new Error('Slate editor and path are required');
    let showAnswers;
    let checkExercise;
    for (const [node] of Node.ancestors(editor, path)) {
        if (node.type === "exercise-block") {
            showAnswers = node.showAnswers;
            checkExercise = node.checkExercise;
        }
    }

    return {
        showAnswers,
        checkExercise
    }
}


//Word order exercise functions

//turns a string into an array of words
export function getDivisions(string, config) {
    let words = string.split("/");

    let withIDs = words.map(word => ({ word, id: nanoid(), isCorrect: false }));

    return config.shuffle ? shuffleArray(withIDs) : withIDs;

}