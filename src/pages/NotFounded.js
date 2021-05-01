import { Flex, Text } from '@chakra-ui/layout'
import React, { Fragment } from 'react'
import Navbar from '../components/Navbar'
import useDocumentTitle from '../hooks/useDocumentTitle'

const NotFounded = () => {
    useDocumentTitle("Página no encontrada")
    return (
        <Fragment>
            <Navbar />
            <Flex alignItems="center" flexDirection="column" justifyContent="center" textAlign="center" height="100vh">

                <Text fontSize="6xl">404</Text>
                <Text fontSize="4xl">Page not founded</Text>
            </Flex>
        </Fragment>
    )
}

export default NotFounded
