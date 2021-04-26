import { Transforms } from 'slate';
import { ReactEditor, useSlate } from 'slate-react';

import { MissingWordEditable, MissingWordInput } from "./MissingWord";

const Leaf = (props) => {

    let { leaf, children, attributes } = props
    const isMissingWord = leaf.missingWord === true;

    if (isMissingWord) {
        //If readOnly render an input to be answered by a student
        if (props.readOnly) {
            return <MissingWordInput {...props} />
        }
        return <MissingWordEditable {...props} />
    }


    if (leaf.bold) {
        children = <strong>{children}</strong>
    }
    if (leaf.italic) {
        children = <em>{children}</em>
    }

    if (leaf.underline) {
        children = <u>{children}</u>
    }


    //Default text element
    return (
        <span {...attributes}>{children}</span>
    )
};

Leaf.defaultProps = {
    readOnly: false
}


export default Leaf