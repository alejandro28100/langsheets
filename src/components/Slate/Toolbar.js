import { Fragment, cloneElement, useState, Children } from "react";
import { Range } from "slate";
import { useSlate } from "slate-react";
import { Tooltip } from "@chakra-ui/tooltip";
import { Button } from "@chakra-ui/button";
import { ButtonGroup } from "@chakra-ui/button";
import { Menu, MenuButton } from "@chakra-ui/menu";
import { Text, Box } from "@chakra-ui/layout";
import ToolbarButton from "./ToolbarButton";
import Icon from "@chakra-ui/icon";

import { FaHeading, FaFont, FaBold, FaItalic, FaStrikethrough, FaUnderline, FaAlignJustify, FaAlignLeft, FaAlignCenter, FaAlignRight } from "react-icons/fa"
import { ReactComponent as MissingWord } from "../../missingWord.svg";
import { toggleMark } from "../../utils/slate";
import { MenuList } from "@chakra-ui/menu";
import { useMediaQuery } from "@chakra-ui/media-query";

function ToogleButtonGroup({ children, value, setValue }) {
    //create a clone element of each child with the value and setValue properties
    return Children.map(children, (child) => cloneElement(child, { value, setValue }))
}


function Toolbar() {
    //get the editor reference from the slate context using the hook
    const editor = useSlate();

    const [isTabletOrLower] = useMediaQuery(["(max-width:900px)"]);

    function handleCreateMissingWord() {
        //Make sure there's text selected
        if (Range.isCollapsed(editor.selection)) {
            alert("Para crear una palabra faltante , seleciona primero la palabra")
            return
        }

        //Asign the property missingWord into the selected text in the editor 
        toggleMark("missingWord", editor)
    }

    const [alignment, setAlignment] = useState("left");

    function handleSetAlignment(format) {
        setAlignment(format)
    }

    return (
        <Box className="toolbar" background="white" position="sticky" top="0.5" zIndex="sticky" py="2" px="6" border="1px" borderColor="whitesmoke" shadow="sm">
            <ButtonGroup variant="ghost" colorScheme="blue" spacing="2">
                <Menu>

                    <Tooltip hasArrow label="Estilos de tipografía" fontSize="md">
                        <MenuButton
                            as={Button}
                            aria-label="Estilos de tipografía"
                            variant="ghost"
                        >
                            <Icon as={FaHeading} />

                        </MenuButton>
                    </Tooltip>

                    <MenuList>
                        <ToolbarButton variant="menuListItem" type="block" format="heading 4xl" label={<Text fontSize="3xl">Título 1</Text>} />
                        <ToolbarButton variant="menuListItem" type="block" format="heading 3xl" label={<Text fontSize="2xl">Título 2</Text>} />
                        <ToolbarButton variant="menuListItem" type="block" format="heading 2xl" label={<Text fontSize="xl">Subtítulo 1</Text>} />
                        <ToolbarButton variant="menuListItem" type="block" format="heading xl" label={<Text fontSize="lg">Subtítulo 2</Text>} />
                        <ToolbarButton variant="menuListItem" type="block" format="" label={<Text fontSize="md">Texto normal</Text>} />
                    </MenuList>
                </Menu>

                {
                    isTabletOrLower
                        ? (
                            < Menu >

                                <Tooltip hasArrow label="Estilos de texto" fontSize="md">
                                    <MenuButton
                                        as={Button}
                                        aria-label="Estilos de texto"
                                        variant="ghost"
                                    >
                                        <Icon as={FaFont} />
                                    </MenuButton>
                                </Tooltip>

                                <MenuList>
                                    <ToolbarButton type="mark" format="bold" variant="menuListItem" label="Negrita" icon={<Icon as={FaBold} />} />
                                    <ToolbarButton type="mark" format="italic" variant="menuListItem" label="Cursiva" icon={<Icon as={FaItalic} />} />
                                    <ToolbarButton type="mark" format="underline" variant="menuListItem" label="Subrayado" icon={<Icon as={FaUnderline} />} />
                                    <ToolbarButton type="mark" format="strike" variant="menuListItem" label="Tachado" icon={<Icon as={FaStrikethrough} />} />
                                </MenuList>
                            </Menu>)
                        : (
                            <Fragment>

                                <ToolbarButton type="mark" format="bold" label="Negrita" icon={<Icon as={FaBold} />} />
                                <ToolbarButton type="mark" format="italic" label="Cursiva" icon={<Icon as={FaItalic} />} />
                                <ToolbarButton type="mark" format="underline" label="Subrayado" icon={<Icon as={FaUnderline} />} />
                                <ToolbarButton type="mark" format="strike" label="Tachado" icon={<Icon as={FaStrikethrough} />} />

                            </Fragment>)
                }

                {isTabletOrLower
                    ? (< Menu >

                        <Tooltip hasArrow label="Estilos de alineación" fontSize="md">
                            <MenuButton
                                as={Button}
                                aria-label="Estilos de alineación"
                                variant="ghost"
                            >
                                <Icon as={FaAlignJustify} />
                            </MenuButton>
                        </Tooltip>

                        <MenuList>
                            <ToolbarButton variant="menuListItem" type="block" formatKey="textAlign" format="left" label="Alinear a la izquierda" icon={<Icon as={FaAlignLeft} />} />
                            <ToolbarButton variant="menuListItem" type="block" formatKey="textAlign" format="center" label="Alinear al centro" icon={<Icon as={FaAlignCenter} />} />
                            <ToolbarButton variant="menuListItem" type="block" formatKey="textAlign" format="right" label="Alinear a la derecha" icon={<Icon as={FaAlignRight} />} />
                            <ToolbarButton variant="menuListItem" type="block" formatKey="textAlign" format="justify" label="Justificar" icon={<Icon as={FaAlignJustify} />} />
                        </MenuList>
                    </Menu>)
                    : (<ToogleButtonGroup value={alignment} setValue={handleSetAlignment}>
                        <ToolbarButton type="block" formatKey="textAlign" format="left" label="Alinear a la izquierda" icon={<Icon as={FaAlignLeft} />} />
                        <ToolbarButton type="block" formatKey="textAlign" format="center" label="Alinear al centro" icon={<Icon as={FaAlignCenter} />} />
                        <ToolbarButton type="block" formatKey="textAlign" format="right" label="Alinear a la derecha" icon={<Icon as={FaAlignRight} />} />
                        <ToolbarButton type="block" formatKey="textAlign" format="justify" label="Justificar" icon={<Icon as={FaAlignJustify} />} />
                    </ToogleButtonGroup>)
                }

                <ToolbarButton type="mark" customOnClick={handleCreateMissingWord} format="missingWord" label="Palabra faltante" icon={<Icon width="2em" as={MissingWord} />} />

            </ButtonGroup>
        </Box>
    )
}

export default Toolbar;