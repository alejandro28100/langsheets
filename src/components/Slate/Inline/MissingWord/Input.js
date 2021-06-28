import { Fragment, useContext } from "react";
import { Transforms } from "slate";
import { ReactEditor, useSlate } from "slate-react";

import { SocketContext } from "../../../../context/socket";

import { getExerciseBlockProps } from "../../../../utils/exerciseBlocks";

import { InputGroup, Input } from "@chakra-ui/input";
import { Text } from "@chakra-ui/layout";
import { Tooltip } from "@chakra-ui/tooltip";

import UserLabel from "./UserLabel";
import Mark from "./Mark";

function handleIsCorrect(userAnswer, correctAnswer) {
    //remove all the spaces around the words and compare them in a non sensitive case
    return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
}

const MissingWordInput = (props) => {

    const socket = useContext(SocketContext);
    const { text: correctAnswer, userAnswer = "", isCorrect = false, focused = undefined } = props.leaf;
    const editor = useSlate();
    const path = ReactEditor.findPath(editor, props.text);
    const { showAnswers, checkExercise } = getExerciseBlockProps(editor, path)

    const inputValue = showAnswers ? correctAnswer : userAnswer;

    function handleOnFocus(event) {
        if (focused) {
            event.preventDefault();
            event.target.blur();
            return;
        }
        Transforms.setNodes(editor, {
            focused: {
                username: socket.auth.username,
                userID: socket.id
            }
        }, {
            at: path
        })
    }
    function handleOnChange(e) {
        const value = e.target.value;
        //apply changes in at the leaf
        Transforms.setNodes(editor, {
            isAnswered: value.trim().length > 0,
            isCorrect: handleIsCorrect(value, correctAnswer),
            userAnswer: value
        }, {
            at: path
        });
    }

    function handleOnBlur() {
        if (focused) {
            Transforms.setNodes(editor, {
                focused: undefined
            }, {
                at: path
            })
        }
    }

    return (

        <InputGroup w="32" as="span" display="inline-block" position="relative">
            {focused && socket.id !== focused.userID
                ? (
                    <Fragment>
                        <Text as="span" w="3" h="3" bg="brand.500" position="absolute" transform="translateY(-50%) translateX(50%)" animation="pulse 2s infinite" boxShadow="0 0 0 #3c37cfb7" right="0" borderRadius="50%" zIndex="overlay" />
                        <Tooltip label={<UserLabel message={`${focused.username} esta escribiendo`} />}>
                            <Input cursor="not-allowed" variant="filled" transition="all ease 300ms" readOnly={checkExercise} value={inputValue} onFocus={handleOnFocus} onChange={handleOnChange} />
                        </Tooltip>
                    </Fragment>
                )
                : (
                    <Input variant="filled" readOnly={checkExercise} value={inputValue} onFocus={handleOnFocus} onBlur={handleOnBlur} onChange={handleOnChange} />
                )}
            <Mark {...{ type: isCorrect ? "correct" : "wrong", show: showAnswers ? false : checkExercise }} />
        </InputGroup >
    )

}

export default MissingWordInput;