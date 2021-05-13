import { ReactEditor, useSlate } from "slate-react"
import { Transforms } from "slate"
import { Box } from "@chakra-ui/layout";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import Icon from "@chakra-ui/icon";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useMediaQuery } from "@chakra-ui/media-query";

export const MissingWordInput = (props) => {
    const { text: correctAnswer, userAnswer = "", showAnswer = false, isChecked = false, isCorrect = false } = props.leaf;

    const editor = useSlate();

    function setLeafProps(properties) {
        const path = ReactEditor.findPath(editor, props.text);
        Transforms.setNodes(editor, properties, { at: path })
    }

    function handleOnChange(e) {
        const value = e.target.value;
        setLeafProps({
            isAnswered: value.trim().length > 0,
            isCorrect: handleIsCorrect(value),
            userAnswer: value
        });
    }

    function handleIsCorrect(userAnswer) {
        //remove all the spaces around the words and compare them in a non sensitive case
        return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
    }

    const inputValue = showAnswer ? correctAnswer : userAnswer;

    function renderMark() {
        //if the exercises is not checked or the answers are shown render nothing
        if (!isChecked || showAnswer) return null;
        //render correct mark
        if (isCorrect) {
            return <InputRightElement as="span" children={<Icon as={FaCheck} color="green.400" />} />
        }
        //render wrong mark
        return <InputRightElement as="span" children={<Icon as={FaTimes} color="red.400" />} />
    }
    return (
        <InputGroup w="32" as="span" display="inline-block">
            <Input variant="filled" readOnly={isChecked} value={inputValue} onChange={handleOnChange} />
            { renderMark()}
        </InputGroup>
    )

}

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
            background="purple.200"
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

