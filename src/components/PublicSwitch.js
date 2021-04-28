import React from 'react'
import PropTypes from 'prop-types'
import { Box, Text } from '@chakra-ui/layout'
import { Tooltip, Switch } from '@chakra-ui/react'

const PublicSwitch = ({ handleChangeProp, sentToServer, isPublic }) => {
    return (
        <Box my="4">
            <Tooltip label="Si la actividad es pública, será listada en la página global de actividades">
                <Text my="2" fontWeight="medium">Actividad Pública <Switch ml="4" onChange={(e) => handleChangeProp({ propery: "isPublic", value: !isPublic })} isChecked={isPublic} /> </Text>
            </Tooltip>
        </Box>
    )
}

PublicSwitch.defaultProps = {
    isPublic: true
}

PublicSwitch.propTypes = {
    isPublic: PropTypes.bool.isRequired,
}

export default PublicSwitch
