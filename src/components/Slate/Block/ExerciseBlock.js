import React, { Fragment } from "react";
import { useReadOnly, useSelected, useFocused, useSlate } from "slate-react";
import { Box, Collapse, Divider, Flex, Icon, IconButton, Input, Popover, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Text } from "@chakra-ui/react";
import ToolbarButton from "../ToolbarButton";
import ScoringSection from "../../ScoringSection";
import { Editor, Range } from "slate";

import { toggleMark } from "../../../utils/slate";
import { shuffleArray } from "../../../utils/objects";

import { MissingWord as MissingWordIcon } from "../../../svgs";
import { IoMdHelpCircleOutline } from "react-icons/io";

const EXERCISES_TYPES = {
    'missing-word': "Palabras faltantes",
    'word-order': "Ordenar oraciones"
}

const EXERCISES_HELP_TEXT = {
    "missing-word": <Fragment>
        <Text my="2">
            Cada oración puede contener una o múltiple palabras faltantes.
        </Text>
        <Text my="2">
            Para añadir una palabra faltante seleccione la palabra(s) y presione el boton de añadir palabra faltante. <Icon color="brand.500" w="2.5em" as={MissingWordIcon} />
        </Text>

        <Text my="2">
            Cada palabra faltante lucirá con un fondo de color púrpura.
        </Text>

        <Text my="2" color="brand.500" fontWeight="semibold">
            Ejemplo:
    </Text>
        <Text my="2">
            <em>
                Escribiendo la siguiente oración
        </em>
        </Text>
        <Text my="2" as="samp">
            Si quieres cambiar el <Text px="2" as="span" bg="brand.200" borderRadius="base" >mundo</Text>, cámbiate a ti mismo.
    </Text>
        <Text my="2">
            <em>
                Se creara el siguiente ejercicio :
        </em>
        </Text>
        <Flex alignItems="center" flexWrap="wrap">
            Si quieres cambiar el <Input w="24" bg="gray.100" />, cámbiate a ti mismo.
    </Flex>

    </Fragment>,
    "word-order": <Fragment>
        <Text my="2">
            Cada oración tiene que ser dividida usando diagonales <Text as="kbd" bg="brand.100">/</Text>
        </Text>
        <Text my="2" color="brand.500" fontWeight="semibold">
            Ejemplo:
        </Text>
        <Text my="2">
            <em>
                Escribiendo la siguiente oración
            </em>
        </Text>
        <Text my="2" as="samp">
            Si quieres <Text as="span" color="brand.500" fontSize="x-large">/</Text> cambiar <Text as="span" color="brand.500" fontSize="x-large">/</Text>el mundo, cámbiate<Text as="span" color="brand.500" fontSize="x-large">/</Text> a ti mismo.
        </Text>
        <Text my="2">
            <em>
                Se creara el siguiente ejercicio :
            </em>
        </Text>
        <Flex flexWrap="wrap">
            {
                shuffleArray(["Si quieres", "cambiar", "el mundo, cámbiate", "a ti mismo."]).map((word, index) => (
                    <Text key={`${word}-${index}`} as="span" borderRadius="base" m="1" px="1" py="2" color="white" bg="brand.500">{word}</Text>
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
    switch (props.exerciseType) {
        case 'missing-word':
            return (
                <Box w="full">
                    <ToolbarButton m="2" colorScheme="brand" type="mark" customOnClick={() => handleCreateMissingWord(editor)} format="missingWord" label="Añadir Palabra faltante" icon={<Icon width="2.5em" as={MissingWordIcon} />} />
                    <Divider borderBottomWidth="2px" opacity="1" />
                </Box>
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

    function isActive() {
        if (isFocused && isSelected) {
            if (editor.selection) {
                if (Range.isExpanded(editor.selection)) {
                    const [element] = Editor.fragment(editor, editor.selection);
                    if (element.exerciseType === "missing-word") {
                        return true;
                    }
                    return false;
                } else {
                    return true;
                }
            }
            return true;
        }
        return false;
    }

    if (isReadOnly) {
        return (
            <Fragment>
                <Box {...props.attributes} borderBottomRadius="base" py="4" >
                    {props.children}
                </Box>
                <ScoringSection {...props} />
            </Fragment>
        )
    }
    return (
        <Box borderRadius="5px" border={`${isActive() ? "var(--chakra-colors-brand-100)" : "transparent"} 1px solid`} {...props.attributes} transition="all ease 300ms" position="relative"  >

            <Collapse in={isActive()} animateOpacity contentEditable={false}>
                {!isReadOnly &&
                    (<Box borderTopRadius="base" w={["full", "full", "auto"]} bg="brand.400" px="4" py="2" color="white">
                        Actividad: <b> {EXERCISES_TYPES[props.element.exerciseType]} </b>

                        {
                            !!EXERCISES_HELP_TEXT[props.element.exerciseType] &&
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
                        }


                    </Box>)
                }
                <Tools isActive={isActive()} exerciseType={props.element.exerciseType} />
            </Collapse>
            <Box borderBottomRadius="base" py="4" px={isActive() && "2"}  >
                {props.children}
            </Box>
        </Box >
    )
}

export const ExerciseList = (props) => {
    return (
        <Box {...props.attributes}>
            {props.children}
        </Box>
    )
}

export default ExerciseBlock;