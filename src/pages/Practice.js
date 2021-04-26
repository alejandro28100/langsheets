// @refresh reset
import React, { useEffect, useMemo, useState, useCallback, Fragment } from 'react'
import { useParams } from "react-router-dom"
import { createEditor, Node, Transforms } from 'slate'
import { Slate, Editable, withReact } from "slate-react"
import PropTypes from "prop-types";

import { Title, Subtitle } from "../components/Slate/Block/Header";
import DefaultElement from "../components/Slate/Block/DefaultElement";

import Leaf from "../components/Slate/Inline/Leaf";

import { deserializeSlateContent } from '../utils'

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
    const editor = useMemo(() => withReact(createEditor()), [])

    //method to render leaves in the slate editor
    const renderLeaf = useCallback(props => {
        return <Leaf {...props} readOnly />
    }, [])

    const renderElement = useCallback(props => {
        switch (props.element.type) {
            case 'title':
                return <Title {...props} />
            case 'subtitle':
                return <Subtitle {...props} />
            default:
                return <DefaultElement {...props} />
        }
    }, [])

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

        async function getWorksheetInfo() {
            try {
                const response = await fetch(`http://localhost:3001/worksheets/${id}`);
                if (!response.ok) throw new Error("Algo salió mal")
                const json = await response.json();
                return json;
            } catch (error) {
                alert(error)
            }
        }
        //get and set the initial state from the fake server
        getWorksheetInfo().then(result => {
            result.content = deserializeSlateContent(result.content);
            setWorksheet(result);

            const itemsCount = getItemsCount()
            setActivity(prevActivity => ({ ...prevActivity, itemsCount }));
        })

    }, [id])

    function getItemsCount() {
        let itemsCount = 0;
        // Iterate over every node in the editor and get the missing-word-type nodes
        for (const [node] of Node.descendants(editor)) {
            if (node.missingWord === true) {
                itemsCount++
            }
        }

        return itemsCount;
    }

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

    // console.log(activity.itemsCount)

    const ExercisesSectionProps = {
        isFinished: activity.isFinished,
        scoreString: getScoreString(),
        scorePercentage: getScorePercentage(),
        handleCheckExercise
    }

    return (
        <div>
            <h1>{worksheet.title}</h1>
            <div style={{ margin: "2em 10em" }}>
                <Slate
                    {...{
                        editor,
                        value: worksheet.content,
                        onChange: (newContent) => handleChangeProp({ propery: "content", value: newContent })
                    }}
                >
                    <Editable
                        {...{ renderElement, renderLeaf, readOnly: true, style: { textAlign: "left" } }}
                    />
                </Slate>
            </div>

            {
                hasExercises ?
                    <ExercisesSection {...ExercisesSectionProps} />
                    : null
            }

        </div>
    )
}

function ExercisesSection({ isFinished, scorePercentage, scoreString, handleCheckExercise }) {
    return (
        <div style={{ margin: "1em" }}>
            {isFinished
                ? (
                    <div>
                        <h5>Resultados</h5>
                        <p> {scorePercentage}% </p>
                        <p> {scoreString}</p>
                    </div>)
                :
                < button onClick={handleCheckExercise}>Calificar Respuestas</button>
            }
        </div>

    )
}

ExercisesSection.proptTypes = {
    isFinished: PropTypes.bool.isRequired,
    scorePercentage: PropTypes.number.isRequired,
    scoreString: PropTypes.string.isRequired,
    handleCheckExercise: PropTypes.func.isRequired,
}

export default Practice
