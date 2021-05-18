import React, { useRef } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ReactEditor, useReadOnly, useSlate } from 'slate-react';

import { Flex } from '@chakra-ui/layout';
import { Text } from '@chakra-ui/layout';
import { Node, Transforms } from 'slate';
import { getDivisions, getExerciseBlockProps } from '../../../utils/exerciseBlocks';

const WordOrderExerciseParagraph = (props) => {
    const isReadOnly = useReadOnly();

    if (isReadOnly)
        return <WordOrderPractice {...props} />

    return <Editable {...props} />
}

const WordOrderPractice = props => {
    const editor = useSlate();
    const { element } = props;

    const path = ReactEditor.findPath(editor, element);
    const { showAnswers, checkExercise } = getExerciseBlockProps(editor, path)

    const textContent = Node.string(element);
    //save the shuffled words in a ref to prevent them from being shuffled on each render
    const userAnswersRef = useRef(getDivisions(textContent, { shuffle: true }));
    const { userAnswers = userAnswersRef.current } = element;

    const correctAnswers = getDivisions(textContent, { shuffle: false });

    function handleOnDragEnd(result) {
        // `destination` is `undefined` if the item was dropped outside the list
        // In this case, do nothing
        if (!result.destination) {
            return
        }

        const items = reorder(
            userAnswers,
            result.source.index,
            result.destination.index
        );

        const path = ReactEditor.findPath(editor, element);
        Transforms.setNodes(editor, { userAnswers: checkAnswers(items, correctAnswers) }, { at: path })
    }

    if (showAnswers) {
        return (
            <Flex flexWrap="wrap" alignItems="center" my="4" p="4" borderRadius="base" border="2px var(--chakra-colors-purple-600) solid">
                {
                    correctAnswers.map((word) => (
                        <WordComponent key={word.id} {...{ ...word, isCorrect: true, }} />
                    ))
                }
            </Flex>
        )
    }

    return (
        <DragDropContext onDragEnd={handleOnDragEnd} >
            <Droppable droppableId="droppable" direction="horizontal">
                {(provided, snapshot) => (
                    <Flex flexWrap="wrap" alignItems="center" my="4" p="4" borderRadius="base" border="2px var(--chakra-colors-purple-600) solid"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`${snapshot.isDraggingOver && 'draggingOver'}`}
                    >
                        {userAnswers.map((word, index) => (
                            <DraggableWordComponent key={word.id} {...{ ...word, index, checkExercise }} />
                        ))}
                        {provided.placeholder}
                    </Flex>
                )}
            </Droppable>
        </DragDropContext>
    )
}

const WordComponent = (props) => {
    return (
        <Text
            m="1" px="2"
            py="1"
            bg={props.isCorrect ? "green.500" : "yellow.300"}
            color={props.isCorrect ? "white" : "black"}
            borderRadius="base"
            as="span"
            fontWeight="medium"
            transition="all ease 300"
            cursor="default"
        >
            {props.word}
        </Text>
    )
}

const DraggableWordComponent = ({ id, word, index, checkExercise, isCorrect }) => {

    function getBg(snapshot) {

        if (snapshot.isDragging) {
            return "purple.600"
        }

        if (checkExercise) {
            if (isCorrect)
                return "green.300"

            return "yellow.300"
        }

        return "purple.500"
    }

    function getColor() {
        if (checkExercise && !isCorrect) {
            return "black"
        }
        return "white"
    }

    return (
        <Draggable key={id} draggableId={id} index={index}>
            {(provided, snapshot) => (
                <Text
                    userSelect="none"
                    m="1"
                    px="2"
                    py="1"
                    borderRadius="base"
                    as="span"
                    cursor="move"
                    fontWeight="medium"
                    color={getColor()}
                    transition="all ease 300"
                    bg={getBg(snapshot)}
                    style={provided.draggableProps.style}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    {word}
                </Text>
            )}
        </Draggable>
    )
}

const Editable = (props) => {
    const { attributes, children } = props;
    return (
        <div {...attributes}>
            {children}
        </div>
    )
}

function checkAnswers(userAnswers, correctAnswers) {

    return userAnswers.map((answer, index) => {
        return {
            ...answer,
            isCorrect: answer.word === correctAnswers[index].word
        };

    })
}



function reorder(list, startIndex, endIndex) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};




export default WordOrderExerciseParagraph
