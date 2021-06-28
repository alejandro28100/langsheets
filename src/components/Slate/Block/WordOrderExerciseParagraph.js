import React, { useContext, useRef } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ReactEditor, useReadOnly, useSlate } from 'slate-react';
import { Node, Transforms } from 'slate';

import { Flex, Text } from '@chakra-ui/layout';
import { Tooltip } from "@chakra-ui/react";
import UserLabel from '../Inline/MissingWord/UserLabel';

import { getDivisions, getExerciseBlockProps } from '../../../utils/exerciseBlocks';
import { SocketContext } from '../../../context/socket';

const WordOrderExerciseParagraph = (props) => {
    const isReadOnly = useReadOnly();

    if (isReadOnly)
        return <WordOrderPractice {...props} />

    return <Editable {...props} />
}

const WordOrderPractice = props => {

    const socket = useContext(SocketContext);

    const editor = useSlate();
    console.log(props);
    const { element } = props;
    const { focused = undefined } = element;

    const path = ReactEditor.findPath(editor, element);

    const { showAnswers, checkExercise } = getExerciseBlockProps(editor, path)

    const textContent = Node.string(element);
    //save the shuffled words in a ref to prevent them from being shuffled on each render
    const userAnswersRef = useRef(getDivisions(textContent, { shuffle: true }));
    const { userAnswers = userAnswersRef.current } = element;

    const correctAnswers = getDivisions(textContent, { shuffle: false });

    function handleOnDragEnd(result) {

        if (focused) {
            Transforms.setNodes(editor, { focused: undefined }, { at: path });
        }

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

        Transforms.setNodes(editor, { userAnswers: checkAnswers(items, correctAnswers) }, { at: path })
    }

    if (showAnswers) {
        return (
            <Flex flexWrap="wrap" alignItems="center" my="4" p="4" borderRadius="base" border="2px var(--chakra-colors-brand-600) solid">
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
                {(provided, snapshot) => {
                    if (snapshot.isDraggingOver && !focused) {
                        Transforms.setNodes(editor, {
                            focused: {
                                username: socket.auth.username,
                                userID: socket.id
                            }
                        }, {
                            at: path
                        })
                    };
                    return (
                        focused && focused.userID !== socket.id ? (
                            <Tooltip label={<UserLabel message={`${focused.username} esta contestando este ejercicio`} />}>
                                <Flex position="relative" flexWrap="wrap" alignItems="center" p="4" my="4" borderRadius="base" border="2px var(--chakra-colors-brand-600) solid"
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`${snapshot.isDraggingOver && 'draggingOver'}`}
                                >
                                    <Text as="span" w="3" h="3" bg="brand.500" position="absolute" transform="translateY(-50%) translateX(50%)" animation="pulse 2s infinite" boxShadow="0 0 0 #3c37cfb7" top="0" right="0" borderRadius="50%" zIndex="overlay" />
                                    {userAnswers.map((word, index) => (
                                        <DraggableWordComponent key={word.id} {...{ ...word, index, focused, checkExercise }} />
                                    ))}
                                    {provided.placeholder}
                                </Flex>
                            </Tooltip>
                        ) : (
                            <Flex position="relative" flexWrap="wrap" alignItems="center" my="4" p="4" borderRadius="base" border="2px var(--chakra-colors-brand-600) solid"
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`${snapshot.isDraggingOver && 'draggingOver'}`}
                            >
                                {userAnswers.map((word, index) => (
                                    <DraggableWordComponent key={word.id} {...{ ...word, index, checkExercise }} />
                                ))}
                                {provided.placeholder}
                            </Flex>
                        )
                    )
                }}
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

const DraggableWordComponent = ({ id, word, index, checkExercise, focused, isCorrect }) => {

    function getBg(snapshot) {

        if (snapshot.isDragging) {
            return "brand.300"
        }

        if (checkExercise) {
            if (isCorrect)
                return "green.300"

            return "yellow.300"
        }

        return "brand.500"
    }

    function getColor() {
        if (checkExercise && !isCorrect) {
            return "black"
        }
        return "white"
    }

    return (
        <Draggable isDragDisabled={!!focused} key={id} draggableId={id} index={index}>
            {(provided, snapshot) => (
                <Text
                    userSelect="none"
                    m="1"
                    px="2"
                    py="1"
                    borderRadius="base"
                    as="span"
                    cursor={!!focused ? "not-allowed" : "move"}
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
