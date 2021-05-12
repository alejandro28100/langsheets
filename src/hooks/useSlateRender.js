import React, { useCallback } from 'react'
//Slate elements
import Leaf from "../components/Slate/Inline/Leaf";
import DefaultElement from "../components/Slate/Block/DefaultElement";
import Heading from "../components/Slate/Block/Heading";
import { ExerciseList, ExerciseBlock } from '../components/Slate/Block/ExerciseBlock';


const useSlateRender = () => {
    //method to render inline leaves in the slate editor
    const renderLeaf = useCallback(props => {
        return <Leaf {...props} />
    }, [])
    //method to render block/void elements in the slate editor
    const renderElement = useCallback(props => {
        const type = props.element.type;

        if (type?.split(" ")[0] === "heading") {
            return <Heading {...props} />
        }
        switch (type) {
            case 'exercise-block':
                return <ExerciseBlock {...props} />
            case 'exercise-list-items':
                return <ExerciseList {...props} />
            default:
                return <DefaultElement {...props} />
        }
    }, [])
    return [renderLeaf, renderElement];
}

export default useSlateRender
