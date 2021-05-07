import React, { useRef } from 'react'
import PropTypes from "prop-types";

import { Editable, EditablePreview, EditableInput, Box } from "@chakra-ui/react"


function WorksheetTitle({ title, sendToLocalStorage, dispatch }) {
    console.log(title);
    const textRef = useRef();
    return (
        <Box my="4" mx="6"
            onClick={() => textRef.current.focus()}
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
    sendToLocalStorage: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
}

export default WorksheetTitle
