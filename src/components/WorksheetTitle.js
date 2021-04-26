import React from 'react'
import PropTypes from "prop-types";

function WorksheetTitle({ title, handleChangeProp, sentToServer }) {
    return (
        <div>
            <label htmlFor="title">Título de la actividad</label>
            <input
                required
                id="title"
                value={title}
                onBlur={sentToServer}
                onChange={e => handleChangeProp({ propery: "title", value: e.target.value })}
                type="text"
                placeholder="Escribe un tílulo aquí..."
            />
        </div>
    )
}
WorksheetTitle.defaultProps = {
    title: ""
}

WorksheetTitle.propTypes = {
    title: PropTypes.string.isRequired,
}

export default WorksheetTitle
