import { Button, ButtonGroup } from '@chakra-ui/button';
import React, { Fragment, useState } from 'react'
import { Editor, Node, Transforms } from 'slate';
import { ReactEditor, useSlate } from 'slate-react';

const ScoringSection = (props) => {
    const editor = useSlate();

    function getScore() {
        let totalItemsCount = 0;
        let totalCorrectAnswersCount = 0
        for (const [node] of Editor.nodes(editor, { match: (node) => node.type === "word-order-exercise-paragraph", at: [] })) {
            totalCorrectAnswersCount += getAnswers(node.userAnswers);
            totalItemsCount += Node.string(node).split("/").length;
        }

        return [totalCorrectAnswersCount, totalItemsCount];
    }

    function getAnswers(userAnswers) {
        if (!userAnswers) return 0;
        let correctAnswersCount = 0;
        userAnswers.forEach(({ isCorrect }) => {
            if (isCorrect)
                correctAnswersCount++
        });
        return correctAnswersCount
    }

    // const [totalCorrectAnswers, totalItems] = getScore();
    return (
        <Fragment>
            <ButtonsSection {...props} />
        </Fragment>
    )
}


const ButtonsSection = (props) => {
    const editor = useSlate();

    const exerciseBlockPath = ReactEditor.findPath(editor, props.element);

    function handleCheckAnswers() {
        Transforms.setNodes(editor, { checkExercise: true }, { at: exerciseBlockPath });
    }

    function handleShowAnswers() {
        Transforms.setNodes(editor, { showAnswers: true }, { at: exerciseBlockPath });
    }

    return (
        <ButtonGroup display="flex" flexWrap="wrap" spacing={["0", "4"]} justifyContent="center" colorScheme="purple" size="sm">
            <Button my="2" variant="solid"
                onClick={handleCheckAnswers}
            >
                Calificar respuestas
            </Button>
            <Button my="2" variant="outline"
                onClick={handleShowAnswers}
            >
                Ver respuestas
            </Button>
        </ButtonGroup>
    )
}

export default ScoringSection
