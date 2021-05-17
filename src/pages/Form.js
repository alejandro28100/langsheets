// @refresh reset
import React, { useEffect, Fragment, useReducer } from 'react'
import { useParams } from "react-router-dom"
import { Slate, Editable } from "slate-react"

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Toolbar from "../components/Slate/Toolbar";
import WorksheetTitle from "../components/WorksheetTitle";

import { Box, Icon, Tooltip, IconButton, ButtonGroup, Text, Grid, GridItem, MenuItem, Switch, Alert, AlertIcon, Button } from "@chakra-ui/react";

import { IoIosArrowBack, IoMdPrint } from "react-icons/io"
import { FaSave, FaChalkboardTeacher } from "react-icons/fa";
import Logo from '../components/Logo';

import { getWorksheet } from "../utils/localStorage";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useSlateRender from '../hooks/useSlateRender';
import useSlateEditor from '../hooks/useSlateEditor';

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
        <Fragment>
            <Navbar
                sm={
                    <Fragment>
                        <MenuItem as="a" href="/" icon={<Icon as={IoIosArrowBack} />}>Regresar</MenuItem>
                        <MenuItem onClick={sendToLocalStorage} icon={<Icon as={FaSave} />}>Guardar Actividad</MenuItem>
                        <MenuItem onClick={handlePrint} icon={<Icon as={IoMdPrint} />}>Imprimir Actividad</MenuItem>
                        <MenuItem as="a" target="_blank" referrerPolicy="no-referrer" href={`/worksheets/${id}/practice`} icon={<Icon as={FaChalkboardTeacher} />}>Visualizar Actividad</MenuItem>
                    </Fragment>
                }
                leftActions={
                    <Tooltip label="Regresar">
                        <IconButton size="lg" icon={<Icon as={IoIosArrowBack} />} variant="ghost" colorScheme="purple" as="a" href="/" />
                    </Tooltip>
                }

                rightActions={
                    <Fragment>
                        <ButtonGroup size="lg" variant="ghost" colorScheme="purple" spacing="2">
                            <Tooltip label="Guardar Actividad">
                                <IconButton onClick={sendToLocalStorage} icon={<Icon as={FaSave} />} />
                            </Tooltip>
                            <Tooltip label="Imprimir Actividad">
                                <IconButton onClick={handlePrint} icon={<Icon as={IoMdPrint} />} />
                            </Tooltip>

                            <Tooltip label="Visualizar Actividad">
                                <IconButton as="a" target="_blank" referrerPolicy="no-referrer" href={`/worksheets/${id}/practice`} icon={<Icon as={FaChalkboardTeacher} />} />
                            </Tooltip>
                        </ButtonGroup>
                    </Fragment>
                }
            />
            {state.loading ? (
                <p>Cargando...</p>
            ) : state.error ? (
                <Box>
                    <Alert status="error">
                        <AlertIcon />
                        {state.error}
                    </Alert>
                </Box>
            ) : (
                <Fragment>

                    <Grid templateColumns="repeat(12,1fr)" as="form" onSubmit={handleSubmit}>
                        <GridItem colSpan={[11, 11, 9]}>

                            <WorksheetTitle {...{ dispatch, sendToLocalStorage, title: state.worksheet.title }} />

                            <Slate
                                {...{
                                    editor,
                                    value: state.worksheet.content,
                                    onChange: newContent => dispatch({ type: "change-worksheet-prop", payload: { property: "content", value: newContent } })
                                }}
                            >
                                <Toolbar />
                                <Box background="gray.100" py={["5", "7"]} px={["5", "14"]}
                                    sx={{
                                        "@media print": {
                                            background: "white",
                                        }
                                    }}>
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
                                </Box>
                            </Slate>

                        </GridItem>
                        <GridItem colSpan={[1, 1, 3]} p={{ md: "5" }} flex="1" justifyContent="center" shadow="md"
                            sx={{
                                "@media print": {
                                    display: "none",
                                }
                            }}
                        >
                            <Box position="sticky" top="0.5" zIndex="docked">
                                <Sidebar {...{ dispatch, lang: state.worksheet.lang, isWritingMode: state.isWritingMode, isPublic: state.worksheet.isPublic }} />
                            </Box>
                        </GridItem>
                    </Grid>
                    <pre>
                        {JSON.stringify(state.worksheet.content, null, 2)}
                    </pre>
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
                </Fragment>
            )}
        </Fragment >
    )
}



export default Form
