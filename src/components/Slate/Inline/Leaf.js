import { Text } from "@chakra-ui/layout";
import { useReadOnly } from "slate-react"
import MissingWordInput from "./MissingWord/Input";
import MissingWordEditable from "./MissingWord/Editable";

// import { MissingWordEditable, MissingWordInput } from "./MissingWord";
const Leaf = (props) => {
    let { leaf, children, attributes } = props
    const isReadOnly = useReadOnly();
    const isMissingWord = leaf.missingWord === true;

    if (isMissingWord) {
        //If the editor is in readOnly mode render an input to be answered by a student
        if (isReadOnly) {
            return <MissingWordInput {...props} />
        }
        return <MissingWordEditable {...props} />
    }

    if (leaf.division) {
        children = <Text as="span" fontWeight="black" color="brand.500">{children}</Text>
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

    if (leaf.strike) {
        children = <s>{children}</s>
    }

    //Default text element
    return (
        <span {...attributes}>{children}</span>
    )
};

export default Leaf
