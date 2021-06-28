import { FaCheck, FaTimes } from "react-icons/fa"
import { Icon } from "@chakra-ui/icon";
import { InputRightElement } from "@chakra-ui/input";

const Mark = ({ show, type }) => {
    if (!show) return null;

    return type === "correct"
        ? <InputRightElement as="span" children={<Icon as={FaCheck} color="green.400" />} />
        : <InputRightElement as="span" children={<Icon as={FaTimes} color="red.400" />} />
}


export default Mark;