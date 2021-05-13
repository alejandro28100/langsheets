import React, { Fragment } from "react";
import { useReadOnly, useSelected, useFocused, useSlate } from "slate-react";
import { Box, Collapse, Divider, Icon, IconButton, Popover, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Text, Tooltip } from "@chakra-ui/react";
import ToolbarButton from "../ToolbarButton";

import { toggleMark } from "../../../utils/slate";

import { MissingWord as MissingWordIcon } from "../../../svgs";
import { Range } from "slate";
import { IoMdHelpCircleOutline } from "react-icons/io";

const EXERCISES_TYPES = {
    'missing-word': "Palabras faltantes",
    'word-order': "Ordenar oraciones"
}

const EXERCISES_HELP_TEXT = {
    "word-order": <Fragment>
        <p>Ayuda</p>
        <hr />
        <p>
            Cada oración debe tener al menos <b> 3 </b> divisiones.
        </p>
        <br />
        <p>
            Para dividir una oración puedes utilizar una linea digonal ( <code>/</code>)
        </p>
        <br />
        <p>
            Si ninguna diagonal divide la oración esta será dividida por palabras.
        </p>
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

    const isReadOnly = useReadOnly();

    const isFocused = useFocused();
    const isSelected = useSelected();

    const isActive = isFocused && isSelected;

    return (
        <Box borderLeft={!isActive && "var(--chakra-colors-purple-600) solid 3px"} pl={!isActive && "2"} {...props.attributes} transition="all ease 300ms" position="relative">

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