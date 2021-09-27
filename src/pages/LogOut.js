import { useEffect } from "react"
import Loading from "../components/Loading"
import * as Realm from 'realm-web'
import { useHistory } from "react-router"
import { isAnon } from "../utils"

function LogOut ({mongoContext: {app, user, setUser, setClient}}) {
    const history = useHistory()

    if (isAnon(user)) {
        history.push('/')
    }

    useEffect(() => {
        async function logout () {
            try{
                console.time("Log out")
                await app.currentUser.logOut()
                console.timeEnd("Log out")
            } catch(err){
                console.error("Log out failed", err);
            }
            try{
                console.time("Annonimous login")
                setUser(await app.logIn(Realm.Credentials.anonymous()))
                console.timeEnd("Annonimous login")
            }catch(err){
                console.error("Anonimous login failed", err);
            }
            console.time("Set new client")
            setClient(app.currentUser.mongoClient('mongodb-atlas'))
            console.timeEnd("Set new client")
        }

        logout()
    }, [app, setClient, setUser])

    return (
        <Loading />
    )
}

export default LogOut