import { Fragment } from "react";
import { Editor, Node, Operation, Path, Point, Transforms } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import { Icon, Text, Box, Menu, MenuButton, MenuList, ButtonGroup, Button, Tooltip, useMediaQuery, MenuItem, IconButton } from "@chakra-ui/react";
import ToolbarButton from "./ToolbarButton";

import { HiViewGridAdd } from "react-icons/hi";
import { FaHeading, FaFont, FaBold, FaItalic, FaStrikethrough, FaUnderline, FaAlignJustify, FaAlignLeft, FaAlignCenter, FaAlignRight } from "react-icons/fa"
import { MissingWord as MissingWordIcon } from "../../svgs";

function Toolbar() {
    //get the editor reference from the slate context using the hook
    const editor = useSlate();

    const [isTabletOrLower] = useMediaQuery(["(max-width:900px)"]);

    function createExercise({ type }) {
        switch (type) {
            case 'missing-word': {
                const newNode = {
                    type: 'exercise-block',
                    exerciseType: "missing-word",
                    children: [
                        {
                            type: 'exercise-list-items',
                            children: [
                                {
                                    type: 'paragraph',
                                    children: [
                                        {
                                            text: ''
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
                if (editor.selection) {
                    const [node] = Node.fragment(editor, editor.selection);
                    //Prevent the user from creating embeded exercise-block s
                    if (node.type === "exercise-block") {
                        alert("No es posible crear un ejercicio dentro de otro ejercicio, selecciona una linea de texto vacía fuera del cuadro de ejercicio");
                        return;
                    }
                }
                Transforms.insertNodes(editor, newNode, { select: true });
                ReactEditor.focus(editor);
            }
                break;
            default:
                break;
        }

    }

    return (
        <Box className="toolbar" background="white" position="sticky" top="0.5" zIndex="docked" py="2" px="6" border="1px" borderColor="whitesmoke" shadow="sm"
            sx={{
                "@media print": {
                    display: "none",
                }
            }}
        >
            <ButtonGroup alignItems="center" variant="ghost" colorScheme="blue" spacing="2">
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
                    : (<Fragment>
                        <ToolbarButton type="block" formatKey="textAlign" format="left" label="Alinear a la izquierda" icon={<Icon as={FaAlignLeft} />} />
                        <ToolbarButton type="block" formatKey="textAlign" format="center" label="Alinear al centro" icon={<Icon as={FaAlignCenter} />} />
                        <ToolbarButton type="block" formatKey="textAlign" format="right" label="Alinear a la derecha" icon={<Icon as={FaAlignRight} />} />
                        <ToolbarButton type="block" formatKey="textAlign" format="justify" label="Justificar" icon={<Icon as={FaAlignJustify} />} />
                    </Fragment>)
                }

                <Menu>
                    <Tooltip hasArrow label="Insertar Ejercicio" fontSize="md">
                        {isTabletOrLower
                            ? (
                                <MenuButton variant="solid" as={Button} >
                                    <Icon as={HiViewGridAdd} />
                                </MenuButton>
                            )
                            : (<MenuButton as={Button} size="sm" variant="solid"> <Icon mr="2" as={HiViewGridAdd} /> Insertar Ejercicio </MenuButton>)
                        }
                    </Tooltip>
                    <MenuList>
                        <MenuItem icon={<Icon width="2em" as={MissingWordIcon} />} onClick={e => createExercise({ type: "missing-word" })}>
                            Palabra faltante
                        </MenuItem>
                    </MenuList>
                </Menu>
            </ButtonGroup>
        </Box >
    )
}

export default Toolbar;