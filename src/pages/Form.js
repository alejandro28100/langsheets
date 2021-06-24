// @refresh reset
import React, { useEffect, Fragment, useReducer } from 'react'
import { useHistory, useParams } from "react-router-dom"
import { Slate } from "slate-react"

import Navbar from "../components/Form/Navbar";
import WorksheetTitle from "../components/Form/WorksheetTitle";

import { Box, Spinner, Tooltip, Icon, IconButton, ButtonGroup, Text, Grid, GridItem, MenuItem, Flex, Menu, MenuButton, Button, MenuList, Divider, Switch, MenuGroup, useMediaQuery, Slide, MenuDivider, useToast, Skeleton, Progress, Popover, PopoverTrigger, PopoverContent } from "@chakra-ui/react";

import Editable from "../components/Slate/Editable";
import LanguagePicker from '../components/LanguagePicker';
import PrivateSwitch from "../components/PrivateSwitch";
import Logo from '../components/Logo';

import { FaArrowLeft, FaFileUpload, FaChalkboardTeacher, FaPrint, FaHome, FaChevronUp, FaCheckCircle } from "react-icons/fa";
import { HiDotsVertical } from 'react-icons/hi';
import { BsFullscreenExit, BsFullscreen } from "react-icons/bs";
import { MdKeyboardHide } from "react-icons/md";

import useSlateEditor from '../hooks/useSlateEditor';
import useSlateRender from '../hooks/useSlateRender';
import useDocumentTitle from "../hooks/useDocumentTitle";
import useIsFullscreen from "../hooks/useIsFullscreen";

import { Transforms } from 'slate';
import { isFullscreen, parseWorksheet, stringifyWorkshet } from '../utils';
import useSlateDecorate from '../hooks/useSlateDecorate';
import ActionsMenu from '../components/Form/ActionsMenu';
import Toolbar from '../components/Form/Toolbar';


const ACTIONS = {
    SAVING_WORKSHEET: 'saving-worksheet',
    SAVING_WORKSHEET_SUCCESS: 'saving-worksheet-success',
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
        case ACTIONS.SAVING_WORKSHEET_SUCCESS:
            return {
                ...state,
                savingWorksheet: false
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
    const history = useHistory();
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

            if (response.status === 404) {
                history.push(`/worksheets/404`);
                return;
            }

            if (response.ok) {
                dispatch({ type: ACTIONS.SET_WORKSHEET, payload: { worksheet: parseWorksheet(json) } })
                return;
            }

            toast({
                description: json.message,
                status: 'error',
                isClosable: true
            })

            // dispatch({ type: ACTIONS.ERROR, payload: { error: json } });

        }

        getWorksheet();

    }, [id, toast, history]);

    async function handlePublishActivity() {
        dispatch({ type: ACTIONS.SAVING_WORKSHEET });

        try {
            const response = await fetch(`/api/activities/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    property: "published",
                    value: !state.worksheet.published,
                })
            })
            const json = await response.json();
            dispatch({ type: ACTIONS.SAVING_WORKSHEET_SUCCESS });

            dispatch({ type: ACTIONS.CHANGE_WORKSHEET_PROP, payload: { property: "published", value: json.published } })

            toast({
                position: isDesktop ? 'top-right' : 'bottom',
                title: json.published
                    ? "La actividad fue publicada exitósamente"
                    : "La publicación de la actividad fue anulada exitósamente",
                status: "success",
                duration: 5000,
                isClosable: true
            })
        } catch (error) {
            // console.log(error);
            toast({
                position: isDesktop ? 'top-right' : 'bottom',
                title: "Error al guardar los cambios",
                status: "error",
                duration: 5000,
                isClosable: true
            })
        }
    }

    async function updateWorksheetProp({ property }) {
        dispatch({ type: ACTIONS.SAVING_WORKSHEET });
        let body = { property, value: state.worksheet[property], author: state.worksheet.author };

        if (property === "content") {
            body["value"] = JSON.stringify(state.worksheet[property]);
        }

        // console.log(`Updating ${property}: ${body.value}`);

        try {
            const response = await fetch(`/api/activities/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
            const json = await response.json();
            //Implement logic to update props
            console.log(json);
            dispatch({ type: ACTIONS.SAVING_WORKSHEET_SUCCESS });

        } catch (error) {

            toast({
                position: isDesktop ? 'top-right' : 'bottom',
                title: "Error al guardar los cambios",
                status: "error",
                duration: 5000,
                isClosable: true
            })
        }
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
        <Slate
            {...{
                editor,
                value: loading
                    ? [{ children: [{ text: 'Cargando...' }] }]
                    : error
                        ? [{ children: [{ text: '' }] }]
                        : worksheet.content,
                onChange: newContent => dispatch({ type: ACTIONS.CHANGE_WORKSHEET_PROP, payload: { property: 'content', value: newContent } }),
            }}
        >
            {isDesktop
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
                            {loading &&
                                <Progress size="sm" isIndeterminate
                                    sx={{
                                        "& > div": {
                                            background: "var(--chakra-colors-brand-300)"
                                        }
                                    }}
                                />
                            }

                            <Grid gridTemplateRows="auto auto auto" gridTemplateColumns="50px 1fr auto" h="full" bg="white">

                                <GridItem rowSpan="1" colSpan="1" display="grid" placeItems="center" >
                                    <Flex as="a" href="/dashboard" mx="4">
                                        <Icon as={FaArrowLeft} />
                                    </Flex>
                                </GridItem>

                                <GridItem rowSpan="1" display="flex" flexDirection="row" alignItems="center" pt="2">
                                    <Skeleton isLoaded={!loading} >
                                        <WorksheetTitle {...{ updateWorksheetProp, dispatch, title: worksheet ? worksheet.title : "" }} />
                                    </Skeleton>
                                    {
                                        !loading &&
                                        <Button ml="5" variant="ghost" size="sm" rightIcon={savingWorksheet ? <Spinner /> : <Icon color="green.500" as={FaCheckCircle} />}>{savingWorksheet ? "Guardando Actividad" : "Cambios guardados"}</Button>
                                    }
                                </GridItem>

                                <GridItem display="flex" alignItems="center" px="4" colStart={3} rowSpan={2}>
                                    <ButtonGroup>
                                        <Tooltip title="Al hacer una actividad pública tus alumnos podrán acceder a la actividad">
                                            <Button onClick={handlePublishActivity} colorScheme="brand">
                                                <Icon as={FaFileUpload} mr="2" />
                                                {worksheet?.published
                                                    ? "Anular Publicación"
                                                    : "Publicar Actividad"
                                                }
                                            </Button>
                                        </Tooltip>
                                    </ButtonGroup>
                                </GridItem>

                                <GridItem py="2" colStart={2} rowSpan="1" display="inline-flex" alignItems="center">
                                    <ActionsMenu {...{ handlePublishActivity, worksheet }} />
                                </GridItem>
                                <GridItem py="2" px="5" colSpan={3} width="full" borderTop="2px solid var(--chakra-colors-gray-100)">
                                    <ButtonGroup as={Flex} alignItems="center">
                                        <Toolbar />
                                    </ButtonGroup>
                                </GridItem>
                            </Grid>

                        </GridItem>


                        <GridItem rowSpan={1} colSpan={8} p="12" bg="gray.100"
                            sx={{
                                "@media print": {
                                    gridColumn: "span 12/span 12",
                                    gridRow: "span 2/span 2"
                                }
                            }}
                            onBlur={() => updateWorksheetProp({ property: 'content' })}
                        >
                            <Skeleton isLoaded={!loading}>
                                <Editable
                                    {...{
                                        decorate,
                                        renderElement,
                                        renderLeaf,
                                        readOnly: !isWritingMode,
                                        placeholder: "Escribe aquí..."
                                    }}
                                />
                            </Skeleton>
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
                                        <LanguagePicker {...{ updateWorksheetProp, dispatch, lang: worksheet.lang }} />
                                        <PrivateSwitch {...{ updateWorksheetProp, dispatch, isPrivate: worksheet.private }} />
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
                        {loading &&
                            <Progress size="sm" isIndeterminate
                                sx={{
                                    "& > div": {
                                        background: "var(--chakra-colors-brand-300)"
                                    }
                                }}
                            />
                        }
                        <Flex py="2" px="4" alignItems="center">

                            <Flex flexGrow="1" alignItems="center">
                                <Skeleton isLoaded={!loading} >
                                    <WorksheetTitle {...{ updateWorksheetProp, dispatch, title: worksheet ? worksheet.title : "" }} />
                                </Skeleton>
                                {
                                    !loading &&
                                    <Popover>
                                        <PopoverTrigger>
                                            <Button ml="5" variant="ghost" size="sm">
                                                {savingWorksheet
                                                    ? <Spinner />
                                                    : <Icon color="green.500" as={FaCheckCircle} />
                                                }
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent p="2" boxShadow="base">
                                            {
                                                savingWorksheet
                                                    ? "Guardando cambios"
                                                    : "Cambios guardados"
                                            }
                                        </PopoverContent>
                                    </Popover>

                                }
                            </Flex>

                            <Menu>
                                <MenuButton variant="ghost" colorScheme="brand" icon={<Icon as={HiDotsVertical} />} as={IconButton} />
                                <MenuList>
                                    <MenuGroup title="Actividad">
                                        <MenuItem onClick={handlePublishActivity} icon={<Icon color="brand.500" as={FaFileUpload} />} >
                                            {worksheet?.published
                                                ? "Anular Publicación"
                                                : "Publicar Actividad"
                                            }
                                        </MenuItem>
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
                            <Skeleton height="full" isLoaded={!loading}>
                                <Editable
                                    {...{
                                        decorate,
                                        renderElement,
                                        renderLeaf,
                                        readOnly: !isWritingMode,
                                        placeholder: "Escribe aquí..."
                                    }}
                                />
                            </Skeleton>
                        </Box>

                        {editor.selection && (
                            <Slide direction="bottom" in={editor.selection} style={{ zIndex: 50, boxShadow: "var(--chakra-shadows-dark-lg)", }}>

                                <Flex pr="30vw" w="100vw" color="#616161" bg="white" alignItems="center" height="50px">
                                    <Flex width="full" height="full" overflowX="auto" alignItems="center">
                                        <Toolbar />
                                    </Flex>

                                    <Flex height="full" position="fixed" bottom="0" right="0" alignItems="center">
                                        <Divider orientation="vertical" />
                                        <IconButton bg="white" borderRadius="none" height="full" onClick={handleHideKeyboard} variant="ghost" colorScheme="brand" icon={<Icon as={MdKeyboardHide} />} />
                                        <Divider orientation="vertical" />
                                        <IconButton variant="ghost" borderRadius="none" height="full" colorScheme="brand" icon={<Icon as={FaChevronUp} />} />
                                    </Flex>
                                </Flex>

                            </Slide>
                        )}

                        {!editor.selection && (
                            <Slide direction="bottom" in={!editor.selection} style={{ zIndex: 150 }}>

                                <Box color="white" display="flex" bg="#05043E" alignItems="center" width="100%" justifyContent="space-around">
                                    <Flex onClick={handlePrint} flexDir="column" alignItems="center" justifyContent="center" cursor="pointer" aria-label="button" py="2" _hover={{ color: "var(--chakra-colors-brand-300)" }} >
                                        <Icon w={6} h={6} as={FaPrint} />
                                        <Text fontSize="x-small">Imprimir</Text>
                                    </Flex>

                                    <Flex flexDir="column" alignItems="center" as="a" href="/dashboard" justifyContent="center" cursor="pointer" aria-label="button" py="2" _hover={{ color: "var(--chakra-colors-brand-300)" }} >
                                        <Icon w={6} h={6} as={FaHome} />
                                        <Text fontSize="x-small">Inicio</Text>
                                    </Flex>

                                    <Flex flexDir="column" alignItems="center" justifyContent="center" cursor="pointer" aria-label="button" py="2" _hover={{ color: "var(--chakra-colors-brand-300)" }}>
                                        <Icon w={6} h={6} as={FaChalkboardTeacher} />
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
            <Flex display="none" flexDirection="column" alignItems="flex-start" position="fixed" zIndex="banner" bottom="0.5" width="full"
                sx={{
                    "@media print": {
                        display: "flex",
                    }
                }}
            >
                <Icon as={Logo} />
                <Text fontSize="smaller"> {host}/worksheets/{id}/practice </Text>
            </Flex>
        </Slate >
    )
}



export default Form
