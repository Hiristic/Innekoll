import { useEffect, useState } from 'react'
import Loading from '../components/Loading'
import {
    Box,
    Button,
    Heading,
    SimpleGrid,
    Text,
    useColorModeValue,
    VisuallyHidden,
  } from '@chakra-ui/react'
import * as React from 'react'
import { FaFacebook, FaGithub, FaGoogle } from 'react-icons/fa'
import { Card } from '../components/Login/Card'
import { DividerWithText } from '../components/Login/DividerWithText'
import { Link } from '../components/Login/Link'
import { LoginForm } from '../components/Login/LoginForm'
import { Logo } from '../components/Login/Logo'
import { isAnon } from '../utils'
import { useHistory } from 'react-router'
import * as Realm from 'realm-web'
import { ChakraProvider } from "@chakra-ui/react"


function Login ({mongoContext: {app, user, setUser}, type = 'login'}) {
    const history = useHistory()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!isAnon(user)) {
            history.push('/')
        }
    }, [history, user])

    async function submitHandler (values) {
        setLoading(true)
        if (type === 'create') {
            console.time("Register user")
            await app.emailPasswordAuth.registerUser(values.email, values.password);
            console.timeEnd("Register user")
        }

        console.time("Login user and redirect to home")
        const credentials = Realm.Credentials.emailPassword(values.email, values.password);
        try {
            const tmp_username = await app.logIn(credentials)
            setUser(tmp_username)
        } catch (err){
            console.error("Login failed", err)
            if (err.message.includes("401")) {
                console.error("Login failed")
                // TODO Print error message
            } else {
              throw err
            }
        }
        setLoading(false)
        console.timeEnd("Login user and redirect to home")
    }

    return (
    <ChakraProvider>
        <div className="mt-3">
            <Box
            bg={useColorModeValue('gray.50', 'inherit')}
            minH="100vh"
            py="12"
            px={{
                base: '4',
                lg: '8',
            }}
            >
            <Box maxW="md" mx="auto">
            <Heading textAlign="center" size="xl" fontWeight="extrabold">
                Sign in
            </Heading>
            <Text mt="4" mb="8" align="center" maxW="md" fontWeight="medium">
                <Text as="span">Don&apos;t have an account?</Text>
                <Link href="#">Create account</Link>
            </Text>
            <Card>
                <LoginForm />
                <DividerWithText mt="6">or continue with</DividerWithText>
                <SimpleGrid mt="6" columns={3} spacing="3">
                <Button color="currentColor" variant="outline">
                    <VisuallyHidden>Login with Facebook</VisuallyHidden>
                    <FaFacebook />
                </Button>
                <Button color="currentColor" variant="outline">
                    <VisuallyHidden>Login with Google</VisuallyHidden>
                    <FaGoogle />
                </Button>
                <Button color="currentColor" variant="outline">
                    <VisuallyHidden>Login with Github</VisuallyHidden>
                    <FaGithub />
                </Button>
                </SimpleGrid>
            </Card>
            </Box>
        </Box>
        </div>
      </ChakraProvider>
    )
}

export default Login