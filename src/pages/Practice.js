// @refresh reset
import React, { Fragment, useEffect, useState } from 'react'
import { useParams } from "react-router-dom"

import { Slate, Editable } from "slate-react"

import { Container, Box, Text } from "@chakra-ui/react";
import Navbar from "../components/Navbar";

import { getWorksheet } from "../utils/localStorage";

import useBodyBackground from '../hooks/useBodyBackground';
import useSlateRender from '../hooks/useSlateRender';
import useSlateEditor from '../hooks/useSlateEditor';
import useDocumentTitle from '../hooks/useDocumentTitle';

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
    // console.log(editor.children);
    const [renderLeaf, renderElement] = useSlateRender();

    // Keep track of state for the value of the editor.
    const [worksheet, setWorksheet] = useState(defaultValue)

    function handleChangeProp({ propery, value }) {
        setWorksheet(prevValue => {
            return { ...prevValue, [propery]: value }
        })
    }

    useEffect(() => {
        setWorksheet(getWorksheet(id).worksheet);
    }, [id])


    //Set a custom background color
    useBodyBackground("var(--chakra-colors-gray-100)");
    useDocumentTitle(`LangSheets | ${worksheet.title}`);
    return (

        <Fragment>
            <Navbar />
            <Box >

                <Text background="purple.400" textAlign="center" color="white" width="full" mt="4" px="4" py="6" fontSize={["4xl", "4xl", "5xl"]} fontWeight="bold" >{worksheet.title}</Text>

                < Container maxWidth="container.lg" my="4" >
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
                </Container>
            </Box >
        </Fragment>
    )
}


export default Practice
