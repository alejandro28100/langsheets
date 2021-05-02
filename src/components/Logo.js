import React from 'react'
import PropTypes from "prop-types";
import { Button, Text, Icon } from "@chakra-ui/react"
import { Logo as LogoIcon } from "../svgs"

const getIconSize = (size) => {
    switch (size) {
        case "sm":
            return { w: "1.5em,", h: "1.5em" };
        case "lg":
            return { w: "3em", h: "3m" };
        //Return md values as default
        default:
            return { w: "2.5em", h: "2.5em" };
    }
}

const Logo = ({ withIcon, size }) => {

    const iconSize = getIconSize(size);
    return (
        <Button variant="unstyled" display="flex" as="a" href="/">
            {withIcon && <Icon mr="2" color="white" {...iconSize} as={LogoIcon} title="LangSheets" />}
            <Text fontFamily="cursive" fontSize="x-large" fontWeight="semibold" color="blue.500" mr="2">LangSheets</Text>
        </Button>
    )
}

Logo.defaultProps = {
    withIcon: true,
    size: "md"
}

Logo.propTypes = {
    withIcon: PropTypes.bool.isRequired,
    size: PropTypes.oneOf(["sm", "md", "lg"]),
}

export default Logo
