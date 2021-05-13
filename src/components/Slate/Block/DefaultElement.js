import { Box, Text } from '@chakra-ui/layout';
import React, { useState } from 'react'
import { Node } from 'slate';
import { ReactEditor, useReadOnly, useSlate } from 'slate-react';

import { nanoid } from "nanoid";
import { Flex } from '@chakra-ui/layout';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const DefaultElement = (props) => {
    const { attributes, element, children } = props;

    const editor = useSlate();
    const isReadOnly = useReadOnly();

    if (isReadOnly) {
        const path = ReactEditor.findPath(editor, element);
        const parent = Node.parent(editor, path);

        //If node has no text return an empty paragraph
        if (!Node.string(element)) {
            return <Paragraph {...props} />
        }


        if (parent.type === "exercise-list-items") {
            const ExerciseBlock = Node.parent(editor, ReactEditor.findPath(editor, parent));

            if (ExerciseBlock.exerciseType === 'word-order') {
                return <WordOrderParagraph {...props} />;
            }
        }
    }
    return <Paragraph {...props} />
}

const Paragraph = ({ attributes, element, children }) => {
    const { textAlign } = element;
    return (
        <Text textAlign={textAlign} {...attributes}>
            {children}
        </Text>
    )
}

function shuffleArray(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function getDivisions(string, config) {
    let words;
    const withDiagonal = string.split("/");
    words = withDiagonal;
    if (withDiagonal.length <= 1) {
        words = string.split(" ");
    }
    let withIDs = words.map(word => ({ word, id: nanoid(), isCorrect: undefined }));

    return config.shuffle ? shuffleArray(withIDs) : withIDs;

}

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const WordOrderParagraph = props => {
    const { element } = props;
    const textContent = Node.string(element);

    const correctAnswers = (getDivisions(textContent, { shuffle: false }));
    const [words, setWords] = useState(getDivisions(textContent, { shuffle: true }));

    // console.log(correctAnswers, words);

    function handleOnDragEnd(result) {
        // `destination` is `undefined` if the item was dropped outside the list
        // In this case, do nothing
        if (!result.destination) {
            return
        }

        const items = reorder(
            words,
            result.source.index,
            result.destination.index
        );

        setWords(items);
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
                        {words.map(({ word, id }, index) => (
                            <WordComponent key={id} {...{ word, id, index }} />
                        ))}
                        {provided.placeholder}
                    </Flex>
                )}
            </Droppable>
        </DragDropContext>
    )
};

const WordComponent = ({ id, word, index }) => (
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
                color="white"
                transition="all ease 300"
                bg={snapshot.isDragging ? 'purple.600' : 'purple.500'}
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

export default DefaultElement
