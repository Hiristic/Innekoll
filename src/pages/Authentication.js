import { Formik } from 'formik'
import { Button, Form } from 'react-bootstrap'
import * as yup from 'yup'
import * as Realm from 'realm-web'
import { useHistory } from 'react-router'
import { useEffect, useState } from 'react'
import { isAnon } from '../utils'
import Loading from '../components/Loading'

const userSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required().min(8)
})

function Authentication ({mongoContext: {app, user, setUser}, type = 'login'}) {
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
        <Formik 
            initialValues={{
                email: '',
                password: ''
            }}

            validationSchema={userSchema}

            onSubmit={submitHandler}
        >
            {({errors, touched, handleSubmit, values, handleChange}) => (
                <Form noValidate onSubmit={handleSubmit}>
                    {loading && <Loading />}
                    {!loading && (<div>
                        <h1>{type === 'login' ? 'Login' : 'Sign Up'}</h1>
                        <Form.Row>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="email" value={values.email} onChange={handleChange} 
                            isValid={touched.email && !errors.email} />
                            <Form.Control.Feedback>{errors.email}</Form.Control.Feedback>
                        </Form.Row>
                        <Form.Row>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name="password" value={values.password} onChange={handleChange} 
                            isValid={touched.password && !errors.password} />
                            <Form.Control.Feedback>{errors.password}</Form.Control.Feedback>
                        </Form.Row>
                        <div className="text-center mt-2">
                            <Button variant="primary" type="submit">Submit</Button>
                        </div>
                    </div>)}
                </Form>
            )}
        </Formik>
    )
}

export default Authentication