import React from 'react'
import PropTypes from "prop-types";

import { Editable, EditablePreview, EditableInput, Box } from "@chakra-ui/react"

function WorksheetTitle({ title, handleChangeProp, sendToLocalStorage }) {
    return (
        <Box my="4" mx="6"
            sx={{
                "@media print": {
                    textAlign: "center",
                }
            }}
        >
            <Editable
                fontSize="2em"
                required
                id="title"
                value={title}
                onBlur={sendToLocalStorage}
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
    sendToLocalStorage: PropTypes.func.isRequired,
}

export default WorksheetTitle
