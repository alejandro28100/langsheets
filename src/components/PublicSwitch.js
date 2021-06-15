import React from 'react'
import PropTypes from 'prop-types'
import { Box, Text } from '@chakra-ui/layout'
import { Tooltip, Switch } from '@chakra-ui/react'

const PublicSwitch = ({ dispatch, updateWorksheetProp, isPublic }) => {
    return (
        <Box my="4">
            <Tooltip label="Si la actividad es pública, será listada en la página global de actividades">
                <Text my="2" >Actividad Pública <Switch colorScheme="brand" ml="4" onBlur={() => updateWorksheetProp({ property: 'published' })} onChange={(e) => dispatch({ type: "change-worksheet-prop", payload: { property: "published", value: !isPublic } })} isChecked={isPublic} /> </Text>
            </Tooltip>
        </Box>
    )
}

PublicSwitch.defaultProps = {
    isPublic: true
}

PublicSwitch.propTypes = {
    dispatch: PropTypes.func.isRequired,
    isPublic: PropTypes.bool.isRequired,
    updateWorksheetProp: PropTypes.func.isRequired,
}

export default PublicSwitch
