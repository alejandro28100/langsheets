import React from 'react'
import { Text, Icon, Flex } from "@chakra-ui/react"
import { Logo as BrandLogo } from "../svgs"

const Logo = () => {
    return (
        <Flex as="a" href="/" alignItems="center" >
            <Icon w={10} h={10} as={BrandLogo} />
            <Text fontSize="x-large" fontWeight="bold" color="brand.500">Langsheets</Text>
        </Flex>
    )
}


export default Logo
