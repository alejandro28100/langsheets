import { ReactEditor, useSlate } from "slate-react"
import { Transforms } from "slate"
import { Box, Text } from "@chakra-ui/layout";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import Icon from "@chakra-ui/icon";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useMediaQuery } from "@chakra-ui/media-query";
import { getExerciseBlockProps } from "../../../utils/exerciseBlocks";
import { SocketContext } from "../../../context/socket";
import { Fragment, useContext } from "react";
import { Tooltip } from "@chakra-ui/tooltip";


const Mark = ({ isCorrect, checkExercise, showAnswers }) => {
    //if the exercises is not checked or the answers are shown, render nothing
    if (!checkExercise || showAnswers) return null;
    //render correct mark
    if (isCorrect) {
        return <InputRightElement as="span" children={<Icon as={FaCheck} color="green.400" />} />
    }
    //render wrong mark
    return <InputRightElement as="span" children={<Icon as={FaTimes} color="red.400" />} />
}

export const MissingWordInput = (props) => {

    const socket = useContext(SocketContext);

    const { text: correctAnswer, userAnswer = "", isCorrect = false, focused = undefined } = props.leaf;

    const editor = useSlate();
    const path = ReactEditor.findPath(editor, props.text);

    const { showAnswers, checkExercise } = getExerciseBlockProps(editor, path)

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
            isCorrect: handleIsCorrect(value),
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

    function handleIsCorrect(userAnswer) {
        //remove all the spaces around the words and compare them in a non sensitive case
        return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
    }

    const inputValue = showAnswers ? correctAnswer : userAnswer;

    return (
        <InputGroup w="32" as="span" display="inline-block" position="relative">
            {focused && socket.id !== focused.userID
                ? (
                    <Fragment>
                        <Text as="span" w="3" h="3" bg="brand.500" position="absolute" transform="translateY(-50%) translateX(50%)" animation="pulse 2s infinite" boxShadow="0 0 0 #3c37cfb7" right="0" borderRadius="50%" zIndex="overlay" />
                        <Tooltip label={<UserLabel username={focused.username} />}>
                            <Input cursor="not-allowed" variant="filled" transition="all ease 300ms" readOnly={checkExercise} value={inputValue} onFocus={handleOnFocus} onChange={handleOnChange} />
                        </Tooltip>
                    </Fragment>
                )
                : (
                    <Input variant="filled" readOnly={checkExercise} value={inputValue} onFocus={handleOnFocus} onBlur={handleOnBlur} onChange={handleOnChange} />
                )}
            <Mark {...{ isCorrect, checkExercise, showAnswers }} />
        </InputGroup >
    )

}


const UserLabel = props => {
    return (
        <Text as="span">
            {props.username} esta escribiendo <DotAnimation />
        </Text>
    )
}

const DotAnimation = props => (
    <Text as="span" id="wave" position="relative">
        <Text as="span" className="dot"></Text>
        <Text as="span" className="dot"></Text>
        <Text as="span" className="dot"></Text>
    </Text>
)

export const MissingWordEditable = props => {

    const [isPrinting] = useMediaQuery(["print"])

    //If printing preview is active duplicate the content of the element using the text property of leaf 
    //so the missing word space in the printing view is larger
    //In normal mode use the children property to render the text in the leaf
    const children = isPrinting
        ? props.leaf.text + props.leaf.text
        : props.children;

    return (
        <Box as="span"
            color={isPrinting ? "transparent" : ""}
            borderRadius="sm"
            px="1"
            background="brand.200"
            {...props.attributes}
            sx={{
                "@media print": {
                    background: "none",
                    borderBottom: "solid black 1px",
                    color: "transparent",
                }
            }}
        >
            {children}
        </Box>
    )
}

