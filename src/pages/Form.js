// @refresh reset
import React, { useEffect, useState, Fragment } from 'react'
import { useParams } from "react-router-dom"
import { Slate, Editable } from "slate-react"

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Toolbar from "../components/Slate/Toolbar";
import WorksheetTitle from "../components/WorksheetTitle";

import { Box, Icon, Tooltip, IconButton, ButtonGroup, Text, Grid, GridItem, MenuItem } from "@chakra-ui/react";


import { IoIosArrowBack, IoMdPrint } from "react-icons/io"
import { FaSave, FaChalkboardTeacher } from "react-icons/fa";
import Logo from '../components/Logo';

import { getWorksheet } from "../utils/localStorage";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useSlateRender from '../hooks/useSlateRender';
import useSlateEditor from '../hooks/useSlateEditor';



const defaultValue = {
    "title": "",
    "content": [
        {
            "type": "paragraph",
            "children": [
                {
                    "text": ""
                }
            ]
        }
    ]
}

const Form = () => {
    //Get the id of the worksheet from the url 
    const { id } = useParams();
    //Slate editor component
    const editor = useSlateEditor();
    //Slate editor render functions
    const [renderLeaf, renderElement] = useSlateRender({ readOnly: false });

    const [worksheet, setWorksheet] = useState(defaultValue);

    useEffect(() => {
        setWorksheet(getWorksheet(id));
    }, [id])

    function sendToLocalStorage() {
        try {
            let updatedWorksheet = { ...worksheet };
            //turn Slate JSON-like-content into a string to save storage
            updatedWorksheet.content = JSON.stringify(updatedWorksheet.content);

            //Update the worksheet from the worksheets value in localStorage API
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
            setWorksheet(getWorksheet(id));
            alert("Actividad Guardada");
        } catch (error) {
            alert(error);
        }
    }

    function handleChangeProp({ propery, value }) {
        setWorksheet(prevValue => {
            return { ...prevValue, [propery]: value }
        })
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

    const title = !!worksheet.title
        ? `LangSheets | ${worksheet.title}`
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
                        <MenuItem as="a" target="_blank" referrerPolicy="no-referrer" href={`${host}/worksheets/${id}/practice`} icon={<Icon as={FaChalkboardTeacher} />}>Visualizar Actividad</MenuItem>
                    </Fragment>
                }
                leftActions={
                    <Tooltip label="Regresar">
                        <IconButton size="lg" icon={<Icon as={IoIosArrowBack} />} variant="ghost" colorScheme="blue" as="a" href="/" />
                    </Tooltip>
                }

                rightActions={
                    <Fragment>
                        <ButtonGroup size="lg" variant="ghost" colorScheme="blue" spacing="2">
                            <Tooltip label="Guardar Actividad">
                                <IconButton onClick={sendToLocalStorage} icon={<Icon as={FaSave} />} />
                            </Tooltip>
                            <Tooltip label="Imprimir Actividad">
                                <IconButton onClick={handlePrint} icon={<Icon as={IoMdPrint} />} />
                            </Tooltip>

                            <Tooltip label="Visualizar Actividad">
                                <IconButton as="a" target="_blank" referrerPolicy="no-referrer" href={`${host}/worksheets/${id}/practice`} icon={<Icon as={FaChalkboardTeacher} />} />
                            </Tooltip>
                        </ButtonGroup>
                    </Fragment>
                }
            />

            <Grid templateColumns="repeat(12,1fr)" as="form" onSubmit={handleSubmit}>
                <GridItem colSpan={[11, 11, 9]}>

                    <WorksheetTitle {...{ handleChangeProp, sendToLocalStorage, title: worksheet.title }} />

                    <Text my="4" fontSize="xl" textAlign="center"
                        sx={{
                            "@media print": {
                                display: "none",
                            }
                        }}
                    >Contenido de la actividad</Text>

                    <Slate
                        {...{
                            editor,
                            value: worksheet.content,
                            onChange: (newContent) => handleChangeProp({ propery: "content", value: newContent })
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
                        <Sidebar {...{ handleChangeProp, lang: worksheet.lang, isPublic: worksheet.isPublic }} />
                    </Box>

                </GridItem>
            </Grid>

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

        </Fragment >
    )
}



export default Form
