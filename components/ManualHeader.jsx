import { useMoralis } from "react-moralis"
import { useEffect } from "react"

const ManualHeader = () => {
    //
    const {enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading} = useMoralis() //react hook
    useEffect(() => {
        if (isWeb3Enabled) return
        if (typeof window != "undefined"){
            if (window.localStorage.getItem("connected")){
                enableWeb3()
            }
        }
        console.log("Hi!")
        console.log(isWeb3Enabled)
    }, [isWeb3Enabled])

    useEffect(() => {// to check if any account change
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`)
            if (account == null) {
                window.localStorage.removeItem("connected")
                deactivateWeb3()
                console.log("Null account found")
            }
        })
    }, [])


    return(<div>
        {account ? (<div>
            Connected to {account.slice(0,6)}...{account.length - 4}
            </div>
            ) : (
            <button 
                onClick={async () => {
                    await enableWeb3()
                    if (typeof window != "undefined"){
                        window.localStorage.getItem("connected", "injected")
                    }
                    }}
                disabled={isWeb3EnableLoading}
            >
                Connect
            </button>)}
        </div>)
}
export default ManualHeader

//hardway and easier way