import React from "react";
import { useReadOnly, useSelected, useFocused, useSlate } from "slate-react";
import { Box, Collapse, Divider, Icon, Text } from "@chakra-ui/react";
import ToolbarButton from "../ToolbarButton";

import { toggleMark } from "../../../utils/slate";

import { MissingWord as MissingWordIcon } from "../../../svgs";
import { Range } from "slate";

const EXERCISES_TYPES = {
    'missing-word': "Palabras faltantes",

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

const FooterTools = (props) => {
    const editor = useSlate();
    // console.log(props);
    switch (props.exerciseType) {
        case 'missing-word':
            return <ToolbarButton colorScheme="blue" type="mark" customOnClick={() => handleCreateMissingWord(editor)} format="missingWord" label="Añadir Palabra faltante" icon={<Icon width="2.5em" as={MissingWordIcon} />} />
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
        <Box {...props.attributes} transition="all ease 300ms" position="relative">

            <Collapse in={isActive} animateOpacity contentEditable={false}>
                {!isReadOnly &&
                    (<Text w={["full", "full", "auto"]} bg="blue.400" px="4" py="2" color="white">
                        Actividad: <b> {EXERCISES_TYPES[props.element.exerciseType]} </b>
                    </Text>)
                }
                <Box w="full" py="2">
                    <FooterTools isActive={isActive} exerciseType={props.element.exerciseType} />
                </Box>
                <Divider size="lg" />
            </Collapse>
            <Box pt="4" pb="14" >
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