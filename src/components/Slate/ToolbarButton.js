import { Button } from '@chakra-ui/button';
import { MenuItem } from '@chakra-ui/menu';
import { Tooltip } from '@chakra-ui/tooltip';
import PropTypes from "prop-types";
import React from 'react'
import { useSlate } from 'slate-react';

import { toggleBlock, toggleMark, isBlockActive, isMarkActive } from "../../utils/slate";


const ToolbarButton = ({ format, label, type, customOnClick, variant, icon, formatKey, ...rest }) => {

    const editor = useSlate();

    function handleClick() {
        if (typeof customOnClick === "function") {
            //run custom click function
            return customOnClick.call()
        }
        if (type === "mark") {
            return toggleMark(format, editor);
        }
        return toggleBlock(formatKey, format, editor);
    }

    function isActive() {
        if (type === "mark") {
            return isMarkActive(format, editor);
        };
        return isBlockActive(formatKey, format, editor);
    }

    if (variant === "button") {
        return (
            <Tooltip hasArrow label={label} fontSize="md">
                <Button {...rest} background={isActive() ? "purple.100" : ""} variant="ghost" onClick={handleClick} >
                    {icon}
                </Button>
            </Tooltip >
        )
    };

    return (
        <MenuItem color={isActive() ? "purple.500" : ""} background={isActive() ? "purple.100" : ""} onClick={handleClick} icon={icon} >
            {label}
        </MenuItem>
    )

}

ToolbarButton.defaultProps = {
    customOnClick: undefined,
    variant: "button",
    formatKey: "type"
}

ToolbarButton.propTypes = {
    customOnClick: PropTypes.func,
    formatKey: PropTypes.string.isRequired,
    format: PropTypes.string.isRequired,
    icon: PropTypes.node,
    variant: PropTypes.oneOf(["menuListItem", "button"]).isRequired,
    type: PropTypes.oneOf(["mark", "block"]).isRequired,
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node
    ]).isRequired,
}
export default ToolbarButton
