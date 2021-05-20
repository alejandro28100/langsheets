// @refresh reset
import React, { useEffect, Fragment, useReducer } from 'react'
import { useParams } from "react-router-dom"
import { Slate, Editable } from "slate-react"

import Navbar from "../components/Form/Navbar";
// import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Toolbar from "../components/Slate/Toolbar";
import WorksheetTitle from "../components/Form/WorksheetTitle";

import { Box, Icon, Tooltip, IconButton, ButtonGroup, Text, Grid, GridItem, MenuItem, Alert, AlertIcon, Flex, Menu, MenuButton, Button, MenuList, Divider, Switch } from "@chakra-ui/react";

import { IoIosArrowBack, IoMdPrint } from "react-icons/io"
import { FaSave, FaChalkboardTeacher, FaArrowLeft, FaHeading, FaAlignCenter, FaAlignJustify, FaAlignRight, FaAlignLeft, FaBold, FaIceCream, FaItalic, FaUnderline, FaStrikethrough } from "react-icons/fa";
import Logo from '../components/Logo';

import { getWorksheet } from "../utils/localStorage";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useSlateRender from '../hooks/useSlateRender';
import useSlateEditor from '../hooks/useSlateEditor';
import ToolbarButton from '../components/Slate/ToolbarButton';
import { HiViewGrid, HiViewGridAdd } from 'react-icons/hi';
import { MissingWord as MissingWordIcon } from '../svgs';
import { AiOutlineProfile } from 'react-icons/ai';
import LanguagePicker from '../components/LanguagePicker';
import PublicSwitch from '../components/PublicSwitch';

const ACTIONS = {
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
            if (!action.payload.property) throw new Error("Prop 'property' is required but is not defined");

            //prevent user from updating content prop when being in preview mode
            if (action.payload.property === "content" && !state.isWritingMode) {
                console.log("Cannot update activity state in preview mode");
                return state;
            }

            const updatedWorksheet = { ...state.worksheet };
            updatedWorksheet[action.payload.property] = action.payload.value;
            // console.log(updatedWorksheet);
            return {
                ...state,
                worksheet: updatedWorksheet,
            }
        }
        case ACTIONS.SET_WORKSHEET:
            return {
                ...state,
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
}

const Form = () => {
    //Get the id of the worksheet from the url 
    const { id } = useParams();
    //Slate editor component
    const editor = useSlateEditor();
    //Slate editor render functions
    const [renderLeaf, renderElement] = useSlateRender();

    const [state, dispatch] = useReducer(reducer, initialValue);

    useEffect(() => {
        const { worksheet, error } = getWorksheet(id);
        if (error) return dispatch({ type: ACTIONS.ERROR, payload: { error } })
        dispatch({ type: ACTIONS.SET_WORKSHEET, payload: { worksheet } })
    }, [id])

    function sendToLocalStorage() {
        try {
            let updatedWorksheet = state.worksheet;
            //turn Slate JSON-like-content into a string to save storage
            updatedWorksheet.content = JSON.stringify(updatedWorksheet.content);

            //Update the worksheet from the worksheets value in localStorage
            const worksheets = JSON.parse(localStorage.getItem("worksheets"))
                .map(worksheet => {
                    if (worksheet.id === id) {
                        worksheet = updatedWorksheet;
                    }
                    return worksheet;
                });

            //save the worksheets updated in localStorage 
            localStorage.setItem("worksheets", JSON.stringify(worksheets));
            //update the state
            dispatch({ type: "set-worksheet", payload: { worksheet: getWorksheet(id).worksheet } })
            alert("Actividad Guardada");
        } catch (error) {
            alert(error);
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        sendToLocalStorage();
    }
    function handlePrint(e) {
        //set print preview scale to 100%
        document.body.style.zoom = "100%";

        //Deselect the button
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
    return (
        <Slate
            {...{
                editor,
                value: state.loading ? [{ children: [{ text: 'Cargando...' }] }] : state.error ? state.error : state.worksheet.content,
                onChange: newContent => dispatch({ type: "change-worksheet-prop", payload: { property: "content", value: newContent } })
            }}
        >

            <Grid h="100vh" templateColumns="repeat(12, 1fr)" templateRows="auto 1fr">
                <GridItem rowSpan={2} colSpan={1} bg="#05043E" py="10" position="sticky" top="0" zIndex="docked">
                    <Navbar {...{ handlePrint, id }} />
                </GridItem>

                <GridItem rowSpan={1} colSpan={11} >
                    {!state.loading
                        ? (
                            <Grid gridTemplateRows="auto auto auto" gridTemplateColumns="50px 1fr auto" h="full" bg="white">

                                <GridItem rowSpan="1" colSpan="1" display="grid" placeItems="center" >
                                    <Box as="a" href="/" mx="4">
                                        <Icon as={FaArrowLeft} />
                                    </Box>
                                </GridItem>

                                <GridItem rowSpan="1" display="flex" flexDirection="row" alignItems="center">
                                    <WorksheetTitle {...{ dispatch, sendToLocalStorage, title: state.worksheet.title }} />
                                </GridItem>

                                <GridItem display="flex" alignItems="center" px="4" colStart={3} rowSpan={2}>
                                    <ButtonGroup>
                                        <Button colorScheme="brand" variant="ghost">
                                            Guardar Borrador
                                            </Button>
                                        <Button colorScheme="brand">
                                            Publicar
                                            </Button>
                                    </ButtonGroup>
                                </GridItem>

                                <GridItem colStart={2} rowSpan="1" display="inline-flex" alignItems="center">
                                    <Menu>
                                        <MenuButton>
                                            Actividad
                                        </MenuButton>
                                    </Menu>
                                    <Menu>
                                        <MenuButton mx="4">
                                            Insertar
                                        </MenuButton>
                                    </Menu>
                                    <Menu>
                                        <MenuButton mx="4">
                                            Ver
                                        </MenuButton>
                                    </Menu>
                                </GridItem>

                                <GridItem py="2" px="5" colSpan={3} width="full">

                                    <ButtonGroup as={Flex} alignItems="center">

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

                                            <ToolbarButton type="mark" format="bold" label="Negrita" icon={<Icon as={FaBold} />} />
                                            <ToolbarButton type="mark" format="italic" label="Cursiva" icon={<Icon as={FaItalic} />} />
                                            <ToolbarButton type="mark" format="underline" label="Subrayado" icon={<Icon as={FaUnderline} />} />
                                            <ToolbarButton type="mark" format="strike" label="Tachado" icon={<Icon as={FaStrikethrough} />} />

                                            <ToolbarButton type="block" formatKey="textAlign" format="left" label="Alinear a la izquierda" icon={<Icon as={FaAlignLeft} />} />
                                            <ToolbarButton type="block" formatKey="textAlign" format="center" label="Alinear al centro" icon={<Icon as={FaAlignCenter} />} />
                                            <ToolbarButton type="block" formatKey="textAlign" format="right" label="Alinear a la derecha" icon={<Icon as={FaAlignRight} />} />
                                            <ToolbarButton type="block" formatKey="textAlign" format="justify" label="Justificar" icon={<Icon as={FaAlignJustify} />} />

                                        </Menu>

                                        <Menu>
                                            <MenuButton as={Button} size="sm" colorScheme="brand" variant="solid">
                                                <Icon w={5} h={5} mr="2" as={HiViewGridAdd} /> Insertar Ejercicio
                                                </MenuButton>
                                            <MenuList>
                                                <MenuItem icon={<Icon width="2em" as={MissingWordIcon} />}
                                                // onClick={e => createExercise({ type: "missing-word" })}
                                                >
                                                    Palabras faltantes
                                                    </MenuItem>
                                                <MenuItem icon={<Icon width="2em" as={AiOutlineProfile} />}
                                                // onClick={e => createExercise({ type: "word-order" })}
                                                >
                                                    Ordernar oraciones
                                                    </MenuItem>
                                            </MenuList>
                                        </Menu>
                                    </ButtonGroup>
                                </GridItem>
                            </Grid>
                        )
                        : null
                    }
                </GridItem>

                <GridItem rowSpan={1} colSpan={8} p="12" bg="gray.100">

                    <Box
                        background="white"
                        p="5"
                        as={Editable}
                        {...{
                            renderElement,
                            renderLeaf,
                            readOnly: !state.isWritingMode,
                            placeholder: "Escribe aquí...",
                            required: true,
                        }}
                    />

                </GridItem>

                <GridItem rowSpan={1} colSpan={3} >
                    <Divider />
                    <Box p="4">
                        <Text fontWeight="semibold" fontSize="lg">Detalles de la actividad</Text>
                        {
                            !state.loading &&
                            <Fragment>
                                <LanguagePicker {...{ dispatch, lang: state.worksheet.lang }} />
                                <PublicSwitch {...{ dispatch, isPublic: state.worksheet.isPublic }} />

                            </Fragment>
                        }
                    </Box>

                    <Divider />
                    <Box p="4">
                        <Text fontWeight="semibold" fontSize="lg">Ajustes</Text>
                        <Text my="2" >
                            Modo de edición: <Switch colorScheme="brand" ml="4" isChecked={state.isWritingMode} onChange={() => dispatch({ type: "toggle-writting-mode" })} />
                        </Text>
                    </Box>

                </GridItem>
            </Grid>


            {/* <pre>
                {state.worksheet && JSON.stringify(state.worksheet.content, null, 2)}
            </pre> */}
            <Box display="none" flexDirection="column" alignItems="flex-start" position="fixed" zIndex="banner" bottom="0.5" width="full"
                sx={{
                    "@media print": {
                        display: "flex",
                    }
                }}
            >
                <Logo size="sm" />
                <Text fontSize="smaller"> {host}/worksheets/{id}/practice </Text>
            </Box>
        </Slate>
    )
}



export default Form
