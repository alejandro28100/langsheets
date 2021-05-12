import { Input } from '@chakra-ui/input';
import { Box, Text } from '@chakra-ui/layout';
import React from 'react'
import { Node } from 'slate';
import { ReactEditor, useReadOnly, useSlate } from 'slate-react';

const DefaultElement = (props) => {
    const { attributes, element, children } = props;

    const editor = useSlate();
    const isReadOnly = useReadOnly();

    if (isReadOnly) {
        const path = ReactEditor.findPath(editor, element);
        const parent = Node.parent(editor, path);

        if (parent.type === "exercise-list-items") {
            const ExerciseBlock = Node.parent(editor, ReactEditor.findPath(editor, parent));
            switch (ExerciseBlock.exerciseType) {
                case 'word-order':
                    return <WordOrderParagraph {...props} />;
                default:
                    return <Paragraph {...props} />
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


function getDivisions(string) {
    let divisions;

    const withDiagonal = string.split("/");

    if (withDiagonal.length <= 1) {
        return divisions = string.split(" ");
    }
    divisions = withDiagonal;

    return divisions;
}

const WordOrderParagraph = props => {
    const { element } = props;
    const textContent = Node.string(element);

    const divisions = getDivisions(textContent);

    return (
        <Box as="p" my="6">
            <Box my="2">
                {divisions.map(word => {
                    return <WordComponent word={word} />
                })}
            </Box>
            <Box color="gray.400" border="solid var(--chakra-colors-purple-400) 2px" borderRadius="base" p="3">
                Arrastra las palabras aquí
            </Box>
        </Box>
    )
};

const WordComponent = props => {
    return (
        <Text as="span" px="2" py="1" borderRadius="base" bg="purple.600" color="white" fontWeight="medium" mx="2">
            {props.word}
        </Text>
    );
};

export default DefaultElement
