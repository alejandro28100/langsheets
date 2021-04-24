import { Transforms } from 'slate';
import { ReactEditor, useSlate } from 'slate-react';

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

const MissingWordInput = (props) => {
    console.log("rendering leaf");
    const { text: correctAnswer, userAnswer = "", isChecked = false, isCorrect = false } = props.leaf;

    const editor = useSlate();

    function setLeafProps(properties) {
        const path = ReactEditor.findPath(editor, props.text);
        Transforms.setNodes(editor, properties, { at: path })
    }

    function handleOnChange(e) {
        const value = e.target.value;
        setLeafProps({
            isAnswered: value.trim().length > 0,
            isCorrect: handleIsCorrect(value),
            userAnswer: value
        });
    }

    function handleIsCorrect(userAnswer) {
        //remove all the spaces around the words and compare them in a non sensitive case
        return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
    }

    function getColor() {
        if (isChecked) {
            return isCorrect ? "#4caf50" : "#f44336";
        }
        return ""
    }

    return (
        <span {...props.attributes}>
            <input readOnly={isChecked} style={{ color: getColor() }} value={userAnswer} onChange={handleOnChange} type="text" />
        </span>
    )

}

const MissingWordEditable = props => {
    return (
        <span
            {...props.attributes}
            style={{ border: 'lightblue 1px solid' }}
        >
            {props.children}
        </span>
    )
}


export default Leaf
