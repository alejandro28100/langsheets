import React, { useCallback } from 'react'

//Slate elements
import Leaf from "../components/Slate/Inline/Leaf";
import DefaultElement from "../components/Slate/Block/DefaultElement";
import { Title, Subtitle } from "../components/Slate/Block/Header";

const useSlateRender = () => {
    //method to render inline leaves in the slate editor
    const renderLeaf = useCallback(props => {
        return <Leaf {...props} />
    }, [])
    //method to render block/void elements in the slate editor
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
    return [renderLeaf, renderElement];
}

export default useSlateRender
