import { Button, ButtonGroup } from '@chakra-ui/button';
import React, { Fragment } from 'react'
import { Transforms } from 'slate';
import { ReactEditor, useSlate } from 'slate-react';

const ScoringSection = (props) => {

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
