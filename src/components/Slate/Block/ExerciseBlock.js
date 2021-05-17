import React, { Fragment } from "react";
import { useReadOnly, useSelected, useFocused, useSlate } from "slate-react";
import { Box, Collapse, Flex, Icon, IconButton, Popover, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Text } from "@chakra-ui/react";
import ToolbarButton from "../ToolbarButton";
import ScoringSection from "../../ScoringSection";
import { Range } from "slate";

import { toggleMark } from "../../../utils/slate";
import { shuffleArray } from "../../../utils/objects";

import { MissingWord as MissingWordIcon } from "../../../svgs";
import { IoMdHelpCircleOutline } from "react-icons/io";

const EXERCISES_TYPES = {
    'missing-word': "Palabras faltantes",
    'word-order': "Ordenar oraciones"
}

const EXERCISES_HELP_TEXT = {
    "word-order": <Fragment>
        <Text my="2">
            Cada oración tiene que ser dividida usando diagonales <Text as="kbd" bg="purple.100">/</Text>
        </Text>
        <Text my="2" color="purple.500" fontWeight="semibold">
            Ejemplo:
        </Text>
        <Text my="2">
            <em>
                Escribiendo la siguiente oración
            </em>
        </Text>
        <Text my="2" as="samp">
            Si quieres <Text as="span" color="purple.500" fontSize="x-large">/</Text> cambiar <Text as="span" color="purple.500" fontSize="x-large">/</Text>el mundo, cámbiate<Text as="span" color="purple.500" fontSize="x-large">/</Text> a ti mismo.
        </Text>
        <Text my="2">
            <em>
                Se creara el siguiente ejercicio :
            </em>
        </Text>
        <Flex flexWrap="wrap">
            {
                shuffleArray(["Si quieres", "cambiar", "el mundo, cámbiate", "a ti mismo."]).map((word, index) => (
                    <Text key={`${word}-${index}`} as="span" borderRadius="base" m="1" px="1" py="2" color="white" bg="purple.500">{word}</Text>
                ))
            }
        </Flex>

    </Fragment>
}

function handleCreateMissingWord(editor, node) {
    //Make sure there's text selected
    if (Range.isCollapsed(editor.selection)) {
        alert("Para crear una palabra faltante , seleciona primero la palabra")
        return
    }

    //Asign the property missingWord into the selected text in the editor
    toggleMark("missingWord", editor)
}

const Tools = (props) => {
    const editor = useSlate();
    // console.log(props);
    switch (props.exerciseType) {
        case 'missing-word':
            return (
                <Fragment>
                    <ToolbarButton colorScheme="purple" type="mark" customOnClick={() => handleCreateMissingWord(editor)} format="missingWord" label="Añadir Palabra faltante" icon={<Icon width="2.5em" as={MissingWordIcon} />} />
                </Fragment>
            )
        case 'word-order':
            return null
        default:
            return null;
    }
};


export const ExerciseBlock = (props) => {
    const editor = useSlate();
    const isReadOnly = useReadOnly();

    const isFocused = useFocused();
    const isSelected = useSelected();

    const isActive = isFocused && isSelected && Range.isCollapsed(editor.selection);

    if (isReadOnly) {
        return (
            <Fragment>
                <Box {...props.attributes} borderBottomRadius="base" py="4" px={isActive && "2"} bg={isActive && "purple.50"} >
                    {props.children}
                </Box>
                <ScoringSection {...props} />
            </Fragment>
        )
    }
    return (
        <Box {...props.attributes} borderLeft={(!isActive && !isReadOnly) && "var(--chakra-colors-purple-600) solid 3px"} pl={!isActive && "2"} transition="all ease 300ms" position="relative" >

            <Collapse in={isActive} animateOpacity contentEditable={false}>
                {!isReadOnly &&
                    (<Box borderTopRadius="base" w={["full", "full", "auto"]} bg="purple.500" px="4" py="2" color="white">
                        Actividad: <b> {EXERCISES_TYPES[props.element.exerciseType]} </b>

                        <Popover>
                            <PopoverTrigger>
                                <IconButton variant="ghost" colorScheme="white" icon={<Icon as={IoMdHelpCircleOutline} />} />
                            </PopoverTrigger>
                            <PopoverContent>
                                <PopoverCloseButton />
                                <PopoverHeader color="black">Ayuda</PopoverHeader>
                                <PopoverBody color="black">
                                    {EXERCISES_HELP_TEXT[props.element.exerciseType]}
                                </PopoverBody>
                            </PopoverContent>
                        </Popover>

                    </Box>)
                }
                <Box w="full" py="2" px="4" bg={isActive && "purple.50"}>
                    <Tools isActive={isActive} exerciseType={props.element.exerciseType} />
                </Box>
            </Collapse>
            <Box borderBottomRadius="base" py="4" px={isActive && "2"} bg={isActive && "purple.50"} >
                {props.children}
            </Box>
        </Box >
    )
}

export const ExerciseList = (props) => {
    return (
        <div {...props.attributes}>
            {props.children}
        </div>
    )
}

export default ExerciseBlock;