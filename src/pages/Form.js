// @refresh reset
import React, { useEffect, Fragment, useReducer } from 'react'
import { useParams } from "react-router-dom"
import { Slate, Editable } from "slate-react"

import Navbar from "../components/Form/Navbar";
// import Navbar from "../components/Navbar";
// import Sidebar from "../components/Sidebar";
// import Toolbar from "../components/Slate/Toolbar";
import WorksheetTitle from "../components/Form/WorksheetTitle";

import { Box, Icon, Tooltip, IconButton, ButtonGroup, Text, Grid, GridItem, MenuItem, Alert, AlertIcon, Flex, Menu, MenuButton, Button, MenuList, Divider, Switch, AlertTitle, AlertDescription, MenuGroup, useMediaQuery, Slide, MenuDivider, useToast } from "@chakra-ui/react";

import LanguagePicker from '../components/LanguagePicker';
import PublicSwitch from '../components/PublicSwitch';
import Logo from '../components/Logo';

import { FaArrowLeft, FaFileUpload, FaHeading, FaAlignCenter, FaAlignJustify, FaAlignRight, FaAlignLeft, FaBold, FaItalic, FaUnderline, FaStrikethrough, FaChalkboardTeacher, FaPrint, FaHome, FaChevronUp } from "react-icons/fa";
import { HiDotsVertical, HiViewGridAdd } from 'react-icons/hi';
import { RiDraftFill } from "react-icons/ri";
import { BsFullscreenExit, BsFullscreen } from "react-icons/bs";
import { MdKeyboardHide } from "react-icons/md";
import { MissingWord as MissingWordIcon, WordOrderIcon } from '../svgs';

import { createExercise } from '../components/Slate/commands';
import useSlateEditor from '../hooks/useSlateEditor';
import useSlateRender from '../hooks/useSlateRender';
import useDocumentTitle from "../hooks/useDocumentTitle";
import useIsFullscreen from "../hooks/useIsFullscreen";

import ToolbarButton from '../components/Slate/ToolbarButton';
import { Transforms } from 'slate';
import { isFullscreen, parseWorksheet, stringifyWorkshet } from '../utils';
import useSlateDecorate from '../hooks/useSlateDecorate';


const ACTIONS = {
    SAVING_WORKSHEET: 'saving-worksheet',
    TOGGLE_WRITTING_MODE: "toggle-writting-mode",
    CHANGE_WORKSHEET_PROP: "change-worksheet-prop",
    SET_WORKSHEET: "set-worksheet",
    SUCESS: "sucess",
    ERROR: "error",
}


function reducer(state, action) {
    switch (action.type) {
        case ACTIONS.TOGGLE_WRITTING_MODE:
            return {
                ...state,
                isWritingMode: !state.isWritingMode
            }
        case ACTIONS.CHANGE_WORKSHEET_PROP: {
            if (!action.payload.property) throw new Error("'property' is required but got undefined");

            //prevent user from updating content prop when being in preview mode
            if (action.payload.property === "content" && !state.isWritingMode) {
                console.log("Cannot update activity state in preview mode");
                return state;
            }

            const updatedWorksheet = { ...state.worksheet };
            updatedWorksheet[action.payload.property] = action.payload.value;

            return {
                ...state,
                worksheet: updatedWorksheet,
            }
        }
        case ACTIONS.SAVING_WORKSHEET:
            return {
                ...state,
                savingWorksheet: true,
            }
        case ACTIONS.SET_WORKSHEET:
            return {
                ...state,
                savingWorksheet: false,
                loading: false,
                worksheet: action.payload.worksheet,
                error: undefined
            }
        case ACTIONS.ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload.error
            }
        default:
            console.warn("Action provided did not matched", action);
            return state;
    }
}

const initialValue = {
    isWritingMode: true,
    loading: true,
    error: "",
    worksheet: undefined,
    savingWorksheet: false
}

function handleOpenFullscreen() {

    if (isFullscreen()) return;

    let screen = document.documentElement;

    if (screen.requestFullscreen) {
        screen.requestFullscreen();
    } else if (screen.mozRequestFullScreen) { /*Firefox*/
        screen.mozRequestFullScreen();
    } else if (screen.webkitRequestFullscreen) { /* Safari */
        screen.webkitRequestFullscreen();
    } else if (screen.msRequestFullscreen) { /* IE11 */
        screen.msRequestFullscreen();
    }
}

function handleCloseFullscreen() {

    if (!isFullscreen()) return;

    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /*Firefox */
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
    }
}

const Form = () => {
    const toast = useToast();
    //Get the id of the worksheet from the url 
    const { id } = useParams();
    //Slate editor component
    const editor = useSlateEditor();

    //Slate editor render functions
    const [renderLeaf, renderElement] = useSlateRender();
    const decorate = useSlateDecorate(editor);

    const [state, dispatch] = useReducer(reducer, initialValue);
    const { worksheet, loading, error, isWritingMode, savingWorksheet } = state;

    const isFullscreen = useIsFullscreen();

    useEffect(() => {
        async function getWorksheet() {
            const response = await fetch(`/api/activities/${id}`);
            const json = await response.json();

            if (response.ok) {
                dispatch({ type: ACTIONS.SET_WORKSHEET, payload: { worksheet: parseWorksheet(json) } })
                return;
            }
            dispatch({ type: ACTIONS.ERROR, payload: { error: json } });
        }

        getWorksheet();

    }, [id])

    async function saveWorksheet() {
        dispatch({ type: ACTIONS.SAVING_WORKSHEET });

        const response = await fetch(`/api/activities/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(stringifyWorkshet(worksheet))
        })

        const json = await response.json();
        if (response.ok) {

            dispatch({ type: ACTIONS.SET_WORKSHEET, payload: { worksheet: parseWorksheet(json) } });
            toast({
                position: isDesktop ? 'top-right' : 'bottom',
                title: "Actividad Guardada",
                description: "La actividad fue guardada exitósamente",
                status: "success",
                duration: 5000,
                isClosable: true
            })
            return;
        }

        dispatch({ type: ACTIONS.ERROR, payload: { error: json } });
    }

    function handlePrint(e) {
        //set print preview scale to 100%
        document.body.style.zoom = "100%";

        //Deselect the button so the tooltip disappears
        e.target.blur();

        //Open the native print browser dialog
        //with a delay to prevent the button tooltip apearing on the printing preview 
        setTimeout(() => {
            window.print();
        }, 500)

    }

    const title = !!state?.worksheet?.title
        ? `LangSheets | ${state?.worksheet?.title}`
        : "LangSheets";
    useDocumentTitle(title);

    const host = window.location.host;

    const [isDesktop] = useMediaQuery("(min-width: 1024px)")


    function handleHideKeyboard() {
        Transforms.deselect(editor);
    }
    return (
        loading
            ? 'Cargando'
            : error
                ? (

                    <Alert status="error">
                        <AlertIcon />
                        <AlertTitle mr={2}>Algo salió mal!</AlertTitle>
                        <AlertDescription>{error.message}</AlertDescription>
                    </Alert>
                )
                : (
                    <Slate
                        {...{
                            editor,
                            value: loading ? [{ children: [{ text: 'Cargando...' }] }] : error ? error : worksheet.content,
                            onChange: newContent => dispatch({ type: ACTIONS.CHANGE_WORKSHEET_PROP, payload: { property: "content", value: newContent } })
                        }}
                    >

                        { isDesktop
                            ? (

                                <Grid h="100vh" templateColumns="repeat(12, 1fr)" templateRows="auto 1fr">

                                    <GridItem rowSpan={2} colSpan={1} bg="#05043E" py="10" position="sticky" top="0" zIndex="docked" sx={{
                                        "@media print": {
                                            display: "none",
                                        }
                                    }}>
                                        <Navbar {...{ handlePrint, id }} />
                                    </GridItem>

                                    <GridItem rowSpan={1} colSpan={11} sx={{
                                        "@media print": {
                                            display: "none",
                                        }
                                    }} >
                                        <Grid gridTemplateRows="auto auto auto" gridTemplateColumns="50px 1fr auto" h="full" bg="white">

                                            <GridItem rowSpan="1" colSpan="1" display="grid" placeItems="center" >
                                                <Box as="a" href="/" mx="4">
                                                    <Icon as={FaArrowLeft} />
                                                </Box>
                                            </GridItem>

                                            <GridItem rowSpan="1" display="flex" flexDirection="row" alignItems="center">
                                                <WorksheetTitle {...{ dispatch, title: worksheet.title }} />
                                            </GridItem>

                                            <GridItem display="flex" alignItems="center" px="4" colStart={3} rowSpan={2}>
                                                <ButtonGroup>
                                                    <Button isLoading={savingWorksheet} onClick={saveWorksheet} colorScheme="brand" variant="ghost">
                                                        <Icon as={RiDraftFill} mr="2" />
                                                        Guardar Cambios
                                                    </Button>
                                                    <Button colorScheme="brand">
                                                        <Icon as={FaFileUpload} mr="2" />
                                                        Publicar
                                                    </Button>
                                                </ButtonGroup>
                                            </GridItem>

                                            <GridItem py="2" colStart={2} rowSpan="1" display="inline-flex" alignItems="center">
                                                <Menu>
                                                    <MenuButton> Actividad </MenuButton>
                                                    <MenuList>
                                                        <MenuItem onClick={saveWorksheet} icon={<Icon as={RiDraftFill} />} >Guardar Cambios</MenuItem>
                                                        <MenuItem icon={<Icon as={FaFileUpload} />} >Publicar Actividad</MenuItem>
                                                        <MenuItem icon={<Icon as={FaPrint} />} onClick={handlePrint}>Imprimir Actividad</MenuItem>
                                                    </MenuList>
                                                </Menu>
                                                <Menu>
                                                    <MenuButton mx="4">
                                                        Insertar
                                                    </MenuButton>
                                                    <MenuList>
                                                        <MenuGroup title="Ejercicios">
                                                            <MenuItem icon={<Icon w={8} h={8} as={MissingWordIcon} />} onClick={e => createExercise(editor, { type: "missing-word" })}>Palabras Faltantes</MenuItem>
                                                            <MenuItem icon={<Icon w={8} h={8} as={WordOrderIcon} />} onClick={e => createExercise(editor, { type: "word-order" })}>Ordenar Oraciones</MenuItem>
                                                        </MenuGroup>
                                                    </MenuList>
                                                </Menu>
                                                <Menu>
                                                    <MenuButton mx="4">
                                                        Ver
                                                    </MenuButton>
                                                    <MenuList>
                                                        {
                                                            isFullscreen
                                                                ? <MenuItem icon={<Icon as={BsFullscreenExit} />} onClick={handleCloseFullscreen}>Vista normal</MenuItem>
                                                                : <MenuItem icon={<Icon as={BsFullscreen} />} onClick={handleOpenFullscreen}>Pantalla completa</MenuItem>
                                                        }
                                                    </MenuList>
                                                </Menu>
                                            </GridItem>
                                            <GridItem py="2" px="5" colSpan={3} width="full" borderTop="2px solid var(--chakra-colors-gray-100)" position="sticky" top="0">

                                                <ButtonGroup as={Flex} alignItems="center">

                                                    <Menu>
                                                        <Tooltip hasArrow label="Estilos de tipografía" fontSize="md">
                                                            <MenuButton
                                                                as={Button}
                                                                aria-label="Estilos de tipografía"
                                                                variant="ghost"
                                                                color="#616161"
                                                                size="sm"
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

                                                    <ToolbarButton type="mark" format="bold" label="Negrita" icon={<Icon as={FaBold} />} />
                                                    <ToolbarButton type="mark" format="italic" label="Cursiva" icon={<Icon as={FaItalic} />} />
                                                    <ToolbarButton type="mark" format="underline" label="Subrayado" icon={<Icon as={FaUnderline} />} />
                                                    <ToolbarButton type="mark" format="strike" label="Tachado" icon={<Icon as={FaStrikethrough} />} />

                                                    <ToolbarButton type="block" formatKey="textAlign" format="left" label="Alinear a la izquierda" icon={<Icon as={FaAlignLeft} />} />
                                                    <ToolbarButton type="block" formatKey="textAlign" format="center" label="Alinear al centro" icon={<Icon as={FaAlignCenter} />} />
                                                    <ToolbarButton type="block" formatKey="textAlign" format="right" label="Alinear a la derecha" icon={<Icon as={FaAlignRight} />} />
                                                    <ToolbarButton type="block" formatKey="textAlign" format="justify" label="Justificar" icon={<Icon as={FaAlignJustify} />} />

                                                    <Menu>
                                                        <MenuButton as={Button} size="sm" colorScheme="brand" variant="solid">
                                                            <Icon w={5} h={5} mr="2" as={HiViewGridAdd} /> Insertar Ejercicio
                                                        </MenuButton>
                                                        <MenuList>
                                                            <MenuItem icon={<Icon w={5} h={5} as={MissingWordIcon} />}
                                                                onClick={e => createExercise(editor, { type: "missing-word" })}
                                                            >
                                                                Palabras faltantes
                                                            </MenuItem>
                                                            <MenuItem icon={<Icon w={5} h={5} as={WordOrderIcon} />}
                                                                onClick={e => createExercise(editor, { type: "word-order" })}
                                                            >
                                                                Ordernar oraciones
                                                            </MenuItem>
                                                        </MenuList>
                                                    </Menu>
                                                </ButtonGroup>
                                            </GridItem>
                                        </Grid>
                                    </GridItem>

                                    <GridItem rowSpan={1} colSpan={8} p="12" bg="gray.100" sx={{
                                        "@media print": {
                                            gridColumn: "span 12/span 12",
                                            gridRow: "span 2/span 2"
                                        }
                                    }}>

                                        <Box
                                            background="white"
                                            p="5"
                                            as={Editable}
                                            {...{
                                                decorate,
                                                renderElement,
                                                renderLeaf,
                                                readOnly: !isWritingMode,
                                                placeholder: "Escribe aquí...",
                                                required: true,
                                            }}
                                        />

                                    </GridItem>

                                    <GridItem rowSpan={1} colSpan={3}
                                        sx={{
                                            "@media print": {
                                                display: "none",
                                            }
                                        }}>
                                        <Divider />
                                        <Box p="4">
                                            <Text fontWeight="semibold" fontSize="lg">Detalles de la actividad</Text>
                                            {
                                                !loading && !error &&
                                                <Fragment>
                                                    <LanguagePicker {...{ dispatch, lang: worksheet.lang }} />
                                                    <PublicSwitch {...{ dispatch, isPublic: worksheet.isPublic }} />

                                                </Fragment>
                                            }
                                        </Box>

                                        <Divider />
                                        <Box p="4">
                                            <Text fontWeight="semibold" fontSize="lg">Ajustes</Text>
                                            <Text my="2" >
                                                Modo de edición: <Switch colorScheme="brand" ml="4" isChecked={isWritingMode} onChange={() => dispatch({ type: "toggle-writting-mode" })} />
                                            </Text>
                                        </Box>

                                    </GridItem>
                                </Grid>
                            )
                            : (
                                <Flex flexDir="column" minH="100vh">
                                    <Flex py="2" px="4" alignItems="center">
                                        <Box flexGrow="1">
                                            <WorksheetTitle {...{ dispatch, title: worksheet.title }} />
                                        </Box>

                                        <Menu>
                                            <MenuButton variant="ghost" colorScheme="brand" icon={<Icon as={HiDotsVertical} />} as={IconButton} />
                                            <MenuList>
                                                <MenuGroup title="Actividad">
                                                    <MenuItem onClick={saveWorksheet} icon={<Icon color="brand.500" as={RiDraftFill} />} >Guardar Cambios</MenuItem>
                                                    <MenuItem icon={<Icon color="brand.500" as={FaFileUpload} />} >Publicar Actividad</MenuItem>
                                                </MenuGroup>
                                                <MenuDivider />
                                                <MenuGroup title="Ver">
                                                    {
                                                        isFullscreen
                                                            ? <MenuItem icon={<Icon as={BsFullscreenExit} />} onClick={handleCloseFullscreen}>Vista normal</MenuItem>
                                                            : <MenuItem icon={<Icon as={BsFullscreen} />} onClick={handleOpenFullscreen}>Pantalla completa</MenuItem>
                                                    }
                                                </MenuGroup>
                                            </MenuList>
                                        </Menu>

                                    </Flex>
                                    <Divider />
                                    <Box flexGrow="1" bg="gray.100" p="4" boxShadow="base">
                                        <Box
                                            background="white"
                                            p="5"
                                            as={Editable}
                                            {...{
                                                decorate,
                                                renderElement,
                                                renderLeaf,
                                                readOnly: !isWritingMode,
                                                placeholder: "Escribe aquí...",
                                                required: true,
                                            }}
                                        />
                                    </Box>

                                    {editor.selection && (
                                        <Slide direction="bottom" in={editor.selection} style={{ zIndex: 50, boxShadow: "var(--chakra-shadows-dark-lg)", }}>

                                            <Flex pr="20vw" w="100vw" color="#616161" bg="white" alignItems="center" height="50px">
                                                <Flex width="full" height="full" overflowX="auto">
                                                    <Menu>
                                                        <MenuButton borderRadius="none" height="full" flex="0 0 auto" display="flex" as={Button} variant="solid" colorScheme="brand">
                                                            <Icon w={5} h={5} mr="2" as={HiViewGridAdd} /> Insertar Ejercicio
                                                        </MenuButton>
                                                        <MenuList>
                                                            <MenuItem icon={<Icon w={5} h={5} as={MissingWordIcon} />}
                                                                onClick={e => createExercise(editor, { type: "missing-word" })}
                                                            >
                                                                Palabras faltantes
                                                            </MenuItem>
                                                            <MenuItem icon={<Icon w={5} h={5} as={WordOrderIcon} />}
                                                                onClick={e => createExercise(editor, { type: "word-order" })}
                                                            >
                                                                Ordernar oraciones
                                                            </MenuItem>
                                                        </MenuList>
                                                    </Menu>

                                                    <Menu>
                                                        <Tooltip hasArrow label="Estilos de tipografía" fontSize="md">
                                                            <MenuButton
                                                                as={IconButton}
                                                                aria-label="Estilos de tipografía"
                                                                variant="ghost"
                                                                color="#616161"
                                                                size="lg"
                                                                borderRadius="none"
                                                                icon={<Icon as={FaHeading} />}
                                                            />
                                                        </Tooltip>

                                                        <MenuList>
                                                            <ToolbarButton borderRadius="none" size="lg" variant="menuListItem" type="block" format="heading 4xl" label={<Text fontSize="3xl">Título 1</Text>} />
                                                            <ToolbarButton borderRadius="none" size="lg" variant="menuListItem" type="block" format="heading 3xl" label={<Text fontSize="2xl">Título 2</Text>} />
                                                            <ToolbarButton borderRadius="none" size="lg" variant="menuListItem" type="block" format="heading 2xl" label={<Text fontSize="xl">Subtítulo 1</Text>} />
                                                            <ToolbarButton borderRadius="none" size="lg" variant="menuListItem" type="block" format="heading xl" label={<Text fontSize="lg">Subtítulo 2</Text>} />
                                                            <ToolbarButton borderRadius="none" size="lg" variant="menuListItem" type="block" format="" label={<Text fontSize="lg">Texto normal</Text>} />
                                                        </MenuList>
                                                    </Menu>

                                                    <ToolbarButton borderRadius="none" size="lg" type="mark" format="bold" label="Negrita" icon={<Icon as={FaBold} />} />
                                                    <ToolbarButton borderRadius="none" size="lg" type="mark" format="italic" label="Cursiva" icon={<Icon as={FaItalic} />} />
                                                    <ToolbarButton borderRadius="none" size="lg" type="mark" format="underline" label="Subrayado" icon={<Icon as={FaUnderline} />} />
                                                    <ToolbarButton borderRadius="none" size="lg" type="mark" format="strike" label="Tachado" icon={<Icon as={FaStrikethrough} />} />

                                                    <ToolbarButton borderRadius="none" size="lg" type="block" formatKey="textAlign" format="left" label="Alinear a la izquierda" icon={<Icon as={FaAlignLeft} />} />
                                                    <ToolbarButton borderRadius="none" size="lg" type="block" formatKey="textAlign" format="center" label="Alinear al centro" icon={<Icon as={FaAlignCenter} />} />
                                                    <ToolbarButton borderRadius="none" size="lg" type="block" formatKey="textAlign" format="right" label="Alinear a la derecha" icon={<Icon as={FaAlignRight} />} />
                                                    <ToolbarButton borderRadius="none" size="lg" type="block" formatKey="textAlign" format="justify" label="Justificar" icon={<Icon as={FaAlignJustify} />} />


                                                </Flex>

                                                <Flex height="full" position="fixed" bottom="0" right="0" alignItems="center">
                                                    <Divider orientation="vertical" />
                                                    <IconButton onClick={handleHideKeyboard} variant="ghost" colorScheme="brand" icon={<Icon as={MdKeyboardHide} />} />
                                                    <Divider orientation="vertical" />
                                                    <IconButton variant="ghost" colorScheme="brand" icon={<Icon as={FaChevronUp} />} />
                                                </Flex>
                                            </Flex>

                                        </Slide>
                                    )}

                                    {!editor.selection && (
                                        <Slide direction="bottom" in={!editor.selection} style={{ zIndex: 150 }}>

                                            <Box color="white" display="flex" bg="#05043E" alignItems="center" width="100%" justifyContent="space-around">
                                                <Flex flexDir="column" alignItems="center" justifyContent="center" cursor="pointer" aria-label="button" py="2" _hover={{ color: "var(--chakra-colors-brand-300)" }} >
                                                    <Icon w={6} h={6} as={FaChalkboardTeacher} />
                                                    <Text fontSize="x-small">Imprimir</Text>
                                                </Flex>

                                                <Flex flexDir="column" alignItems="center" justifyContent="center" cursor="pointer" aria-label="button" py="2" _hover={{ color: "var(--chakra-colors-brand-300)" }} >
                                                    <Icon w={6} h={6} as={FaHome} />
                                                    <Text fontSize="x-small">Inicio</Text>
                                                </Flex>

                                                <Flex flexDir="column" alignItems="center" justifyContent="center" cursor="pointer" aria-label="button" py="2" _hover={{ color: "var(--chakra-colors-brand-300)" }}>
                                                    <Icon w={6} h={6} as={FaPrint} />
                                                    <Text fontSize="x-small">Previsualizar</Text>
                                                </Flex>
                                            </Box>
                                        </Slide>
                                    )}
                                </Flex>
                            )
                        }


                        {/* <pre>
                        {worksheet && JSON.stringify(worksheet.content, null, 2)}
                    </pre> */}
                        <Box display="none" flexDirection="column" alignItems="flex-start" position="fixed" zIndex="banner" bottom="0.5" width="full"
                            sx={{
                                "@media print": {
                                    display: "flex",
                                }
                            }}
                        >
                            <Icon as={Logo} />
                            <Text fontSize="smaller"> {host}/worksheets/{id}/practice </Text>
                        </Box>
                    </Slate >
                )
    )
}



export default Form
