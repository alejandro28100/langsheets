import React from 'react'
import PropTypes from 'prop-types'
import { Box, Text } from '@chakra-ui/layout'
import { Tooltip, Switch } from '@chakra-ui/react'

const PrivateSwitch = ({ dispatch, updateWorksheetProp, isPrivate }) => {
    return (
        <Box my="4">
            <Tooltip label="Si la actividad es privada, no será listada en la página global de actividades. Sólo tus alumnos podrán acceder a ella.">
                <Text my="2" >Actividad Privada <Switch colorScheme="brand" ml="4" onBlur={() => updateWorksheetProp({ property: 'private' })} onChange={(e) => dispatch({ type: "change-worksheet-prop", payload: { property: "private", value: !isPrivate } })} isChecked={isPrivate} /> </Text>
            </Tooltip>
        </Box>
    )
}

PrivateSwitch.defaultProps = {
    isPrivate: false
}

PrivateSwitch.propTypes = {
    dispatch: PropTypes.func.isRequired,
    isPrivate: PropTypes.bool.isRequired,
    updateWorksheetProp: PropTypes.func.isRequired,
}

export default PrivateSwitch
