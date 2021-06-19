import { FaCheck, FaTimes } from "react-icons/fa"
import { Icon } from "@chakra-ui/icon";
import { InputRightElement } from "@chakra-ui/input";
// const Mark = ({ isCorrect, checkExercise, showAnswers }) => {
//     //if the exercises is not checked or the answers are shown, render nothing
//     if (!checkExercise || showAnswers) return null;
//     //render correct mark
//     if (isCorrect) {
//         return <InputRightElement as="span" children={<Icon as={FaCheck} color="green.400" />} />
//     }
//     //render wrong mark
//     return <InputRightElement as="span" children={<Icon as={FaTimes} color="red.400" />} />
// }

const Mark = ({ show, type }) => {
    if (!show) return null;

    return type === "correct"
        ? <InputRightElement as="span" children={<Icon as={FaCheck} color="green.400" />} />
        : <InputRightElement as="span" children={<Icon as={FaTimes} color="red.400" />} />
}


export default Mark;