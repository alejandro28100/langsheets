import React, { useRef } from 'react'
import PropTypes from "prop-types";

import { Editable, EditablePreview, EditableInput, Box } from "@chakra-ui/react"


function WorksheetTitle({ title, dispatch }) {
    const textRef = useRef();
    return (
        <Box
            onClick={() => textRef.current.focus()}
            sx={{
                "@media print": {
                    textAlign: "center",
                }
            }}
        >
            <Editable
                fontSize="x-large"
                required
                id="title"
                value={title}
                onChange={newValue => dispatch({ type: "change-worksheet-prop", payload: { property: "title", value: newValue } })}
                type="text"
                placeholder="Escribe un tílulo aquí..."
            >
                <EditablePreview ref={textRef} />
                <EditableInput />
            </Editable>
        </Box>
    )
}

WorksheetTitle.propTypes = {
    title: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
}

export default WorksheetTitle
