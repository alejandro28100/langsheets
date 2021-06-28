import { Text } from "@chakra-ui/layout";
import PropTypes from "prop-types";

const UserLabel = props => {
    return (
        <Text as="span">
            {props.message} <DotAnimation />
        </Text>
    )
}

UserLabel.propTypes = {
    message: PropTypes.string.isRequired,
}

const DotAnimation = props => (
    <Text as="span" id="wave" position="relative">
        <Text as="span" className="dot"></Text>
        <Text as="span" className="dot"></Text>
        <Text as="span" className="dot"></Text>
    </Text>
)

export default UserLabel;