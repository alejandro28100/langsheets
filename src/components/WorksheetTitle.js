import React from 'react'
import PropTypes from "prop-types";

import { Editable, EditablePreview, EditableInput, Box } from "@chakra-ui/react"

function WorksheetTitle({ title, handleChangeProp, sentToServer }) {
    return (
        <Box my="4" mx="6">
            <Editable
                fontSize="2em"
                required
                id="title"
                value={title}
                onBlur={sentToServer}
                onChange={newValue => handleChangeProp({ propery: "title", value: newValue })}
                type="text"
                placeholder="Escribe un tílulo aquí..."
            >
                <EditablePreview />
                <EditableInput />
            </Editable>
        </Box>
    )
}
WorksheetTitle.defaultProps = {
    title: ""
}

WorksheetTitle.propTypes = {
    title: PropTypes.string.isRequired,
}

export default WorksheetTitle
