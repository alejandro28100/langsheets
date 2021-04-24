import React from 'react'
import PropTypes from "prop-types"

function WorksheetCard({ lang, title, id, createdAt, deleteSheet }) {
    const date = new Date(createdAt);
    const days = date.toLocaleDateString();
    const hours = date.toLocaleTimeString();
    return (
        <div>
            <h3>{title}</h3>
            <p>Idioma : {lang}</p>
            <p>Creada el {days} - {hours} </p>
            <br />
            <a href={`http://localhost:3000/worksheets/${id}/edit`}>Editar</a>
            <br />
            <a href={`http://localhost:3000/worksheets/${id}/practice`}>Hacer actividad</a>
            <br />
            <button onClick={e => deleteSheet(id)}>Elimar</button>
            <hr />
        </div>
    )
}



WorksheetCard.propTypes = {
    lang: PropTypes.oneOf(["en", "fr", "de", "ja", "es", "zh", "ru"]).isRequired,
    title: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    deleteSheet: PropTypes.func.isRequired,
}

export default WorksheetCard


