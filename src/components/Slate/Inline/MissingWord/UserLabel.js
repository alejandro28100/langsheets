import { Text } from "@chakra-ui/layout";

const UserLabel = props => {
    return (
        <Text as="span">
            {props.username} esta escribiendo <DotAnimation />
        </Text>
    )
}

const DotAnimation = props => (
    <Text as="span" id="wave" position="relative">
        <Text as="span" className="dot"></Text>
        <Text as="span" className="dot"></Text>
        <Text as="span" className="dot"></Text>
    </Text>
)

export default UserLabel;