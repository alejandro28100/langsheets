import { Text } from '@chakra-ui/layout';

const DefaultElement = (props) => {
    const { children, element, attributes } = props;
    const { textAlign } = element;
    return (
        <Text textAlign={textAlign} {...attributes}>
            {children}
        </Text>
    )
}


export default DefaultElement
