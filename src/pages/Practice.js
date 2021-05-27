// @refresh reset
import React, { Fragment, useEffect, useState } from 'react'
import { useParams } from "react-router-dom"

import { Slate, Editable } from "slate-react"

import { Container, Box, Text } from "@chakra-ui/react";
import Navbar from "../components/Navbar";


import useBodyBackground from '../hooks/useBodyBackground';
import useSlateRender from '../hooks/useSlateRender';
import useSlateEditor from '../hooks/useSlateEditor';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { parseWorksheet } from '../utils';

import { SocketContext, socket } from "../context/socket";
import { Transforms } from 'slate';

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

const Practice = () => {
    //Get the id of the worksheet from the url 
    const { id } = useParams();

    const editor = useSlateEditor();

    const [renderLeaf, renderElement] = useSlateRender();

    // Keep track of state for the value of the editor.
    const [worksheet, setWorksheet] = useState(defaultValue)
    // console.log(editor);
    function handleChangeProp({ propery, value }) {
        setWorksheet(prevValue => {
            return { ...prevValue, [propery]: value }
        })
    }

    socket.on('action', (value) => {
        const action = JSON.parse(value);
        console.log("Action received", action);
        switch (action.type) {
            case 'set-leaf-props':
                if (editor.children.length !== 0) {
                    Transforms.setNodes(editor, { ...action.props }, { at: action.path });
                }
                break;

            default:
                break;
        }
    });

    useEffect(() => {

        async function getWorksheet() {
            const response = await fetch(`/api/activities/${id}`);
            const json = await response.json();

            if (response.ok) {

                setWorksheet(
                    parseWorksheet(json)
                )

                return;
            }

        }
        getWorksheet();
    }, [id])

    //Set a custom background color
    useBodyBackground("var(--chakra-colors-gray-100)");
    useDocumentTitle(`LangSheets | ${worksheet.title}`);
    return (

        <Fragment>
            <Navbar />
            <Box >

                <Text textAlign="center" color="brand.600" width="full" mt="4" px="4" py="6" fontSize={["4xl", "4xl", "5xl"]} fontWeight="bold" >{worksheet.title}</Text>

                <Container maxWidth="container.lg" my="4" >
                    <SocketContext.Provider value={socket}>
                        <Slate
                            {...{
                                editor,
                                value: worksheet.content,
                                onChange: (newContent) => handleChangeProp({ propery: "content", value: newContent })
                            }}
                        >
                            <Box background="white" px={["8", "16"]} py="16" as={Editable} shadow="sm"
                                {...{ renderElement, renderLeaf, readOnly: true }}
                            />
                        </Slate>
                    </SocketContext.Provider>
                </Container>
            </Box >
        </Fragment>
    )
}



export default Practice
