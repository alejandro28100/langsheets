import React from 'react'
import PropTypes from "prop-types";
import { Select, Box, Text } from '@chakra-ui/react';

const LanguagePicker = ({ updateWorksheetProp, dispatch, lang }) => {
    return (
        <Box my="4">
            <Text my="2">Idioma</Text>
            <Select
                background="white"
                required
                value={lang}
                onBlur={() => updateWorksheetProp({ property: 'lang' })}
                onChange={e => dispatch({ type: "change-worksheet-prop", payload: { property: "lang", value: e.target.value } })}
            >
                <option value=""></option>
                <option value="de">Alemán</option>
                <option value="es">Español</option>
                <option value="fr">Francés</option>
                <option value="en">Inglés</option>
                <option value="ru">Ruso</option>
                <option value="zh">Chino</option>
                <option value="ja">Japonés</option>
            </Select>
        </Box>
    )
}

LanguagePicker.defaultProps = {
    lang: "",
}

LanguagePicker.propTypes = {
    dispatch: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    updateWorksheetProp: PropTypes.func.isRequired,
}

export default LanguagePicker
