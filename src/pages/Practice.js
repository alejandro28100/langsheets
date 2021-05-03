// @refresh reset
import React, { Fragment, useEffect, useState } from 'react'
import { useParams } from "react-router-dom"
import { Node, Transforms } from 'slate'
import { Slate, Editable } from "slate-react"
import PropTypes from "prop-types";

import { Container, Box, Text, Button, Flex } from "@chakra-ui/react";
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
    const [renderLeaf, renderElement] = useSlateRender();

    // Keep track of state for the value of the editor.
    const [worksheet, setWorksheet] = useState(defaultValue)

    const [activity, setActivity] = useState({
        isFinished: false,
        //user correct answers count
        correctAnswersCount: 0,
        //exercises total count
        itemsCount: 0
    });

    function handleChangeProp({ propery, value }) {
        setWorksheet(prevValue => {
            return { ...prevValue, [propery]: value }
        })
    }

    useEffect(() => {
        setWorksheet(getWorksheet(id));
    }, [id])

    useEffect(() => {
        function getItemsCount() {
            let itemsCount = 0;
            // Iterate over every node in the editor and get the missing-word-type nodes
            for (const [node] of Node.descendants(editor)) {
                if (node.missingWord === true) {
                    itemsCount++
                }
            }

            return itemsCount;
        };
        const itemsCount = getItemsCount();
        setActivity(prevActivity => ({ ...prevActivity, itemsCount }));
    }, [worksheet, editor])

    function handleCheckExercise() {
        let correctAnswers = 0;

        // Iterate over every node in the editor.
        for (const [node, path] of Node.descendants(editor)) {
            if (node.isCorrect === true) {
                correctAnswers++
            }
            // set isCheck property to change the styling of the exercises
            Transforms.setNodes(editor, { isChecked: true }, { at: path })
        }

        setActivity(prevActivity => ({ ...prevActivity, isFinished: true, correctAnswersCount: correctAnswers }));
    }

    function handleShowAnswers() {
        // Iterate over every node in the editor.
        for (const [node, path] of Node.descendants(editor)) {
            if (node.missingWord === true) {
                // set showAnswer property to show the answers
                Transforms.setNodes(editor, { showAnswer: true }, { at: path })
            }
        }

    }


    function getScorePercentage() {
        //Use math abs to avoid returning values with 0s as decimals 
        // 70.00 will be turn into => 70
        return Math.abs(
            ((activity.correctAnswersCount * 100) / activity.itemsCount)
                .toFixed(2)
        );
    }

    function getScoreString() {
        const isResultSingular = activity.correctAnswersCount === 1;
        return `${activity.correctAnswersCount} ${isResultSingular ? "ejercicio correcto" : "ejercicios correctos"} de ${activity.itemsCount}`
    }
    //Check whether a worksheet has only content or includes exercises
    const hasExercises = activity.itemsCount > 0;

    //Set a custom background color
    useBodyBackground("var(--chakra-colors-gray-100)");
    useDocumentTitle(`LangSheets | ${worksheet.title}`);
    return (

        <Fragment>
            <Navbar />
            <Box >

                <Text background="blue.400" textAlign="center" color="white" width="full" mt="4" px="4" py="6" fontSize={["4xl", "4xl", "5xl"]} fontWeight="bold" >{worksheet.title}</Text>

                < Container maxWidth="container.lg" my="4" >
                    <Slate
                        {...{
                            editor,
                            value: worksheet.content,
                            onChange: (newContent) => handleChangeProp({ propery: "content", value: newContent })
                        }}
                    >
                        <Box background="white" px={["8", "16"]} py="16" as={Editable} shadow="sm"
                            {...{ renderElement, renderLeaf, readOnly: true, style: { textAlign: "left" } }}
                        />
                    </Slate>
                </Container>

                {
                    hasExercises &&
                    <ExercisesSection {...{
                        isFinished: activity.isFinished,
                        scoreString: getScoreString(),
                        scorePercentage: getScorePercentage(),
                        handleCheckExercise,
                        handleShowAnswers
                    }} />

                }
            </Box >
        </Fragment>
    )
}

function ExercisesSection({ isFinished, scorePercentage, scoreString, handleCheckExercise, handleShowAnswers }) {
    return (
        <Flex justifyContent="center" my="4">
            {isFinished
                ? (
                    <Box textAlign="center" m="5">

                        <Text fontSize="4xl">Resultados</Text>
                        <Text> {scorePercentage}% </Text>
                        <Text> {scoreString}</Text>

                        <Button my="4" variant="solid" colorScheme="blue" onClick={handleShowAnswers}>Mostrar Respuestas</Button>

                    </Box>)
                :
                <Button variant="solid" colorScheme="blue" onClick={handleCheckExercise}>Calificar Respuestas</Button>
            }
        </Flex>

    )
}

ExercisesSection.proptTypes = {
    isFinished: PropTypes.bool.isRequired,
    scorePercentage: PropTypes.number.isRequired,
    scoreString: PropTypes.string.isRequired,
    handleCheckExercise: PropTypes.func.isRequired,
    handleShowAnswers: PropTypes.func.isRequired,
}

export default Practice
