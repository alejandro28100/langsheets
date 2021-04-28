import React from 'react'
import PropTypes from "prop-types";
import { Select, Box, Text } from '@chakra-ui/react';

const LanguagePicker = ({ handleChangeProp, lang, sentToServer }) => {
    return (
        <Box my="4">
            <Text my="2" fontWeight="medium">Idioma</Text>
            <Select
                background="white"
                required
                value={lang}
                onChange={e => handleChangeProp({ propery: "lang", value: e.target.value })}
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
    sentToServer: PropTypes.func.isRequired,
    handleChangeProp: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
}

export default LanguagePicker
