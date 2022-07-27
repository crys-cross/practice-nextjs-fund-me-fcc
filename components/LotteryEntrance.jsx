// have function to enter Lottery
// TODO Challenge: update recentWinner by event trigger
import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit" //component library(the other is css library)

const LotteryEntrance = () => {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    console.log(parseInt(chainIdHex))
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const [entranceFee, setEntranceFee] = useState("0") //[state or actual variable, the function to update it]
    const [numPlayers, setNumPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")
    const dispatch = useNotification() //little popup

    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, // specify network ID
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, // specify network ID
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getNumberOfplayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, // specify network ID
        functionName: "getNumberOfplayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, // specify network ID
        functionName: "getRecentWinner",
        params: {},
    })

    const updateUI = async () => {
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const numpleyersFromCall = (await getNumberOfplayers()).toString()
        const recentWinnerFromCall = await getRecentWinner()
        setEntranceFee(entranceFeeFromCall)
        setNumPlayers(numpleyersFromCall)
        setRecentWinner(recentWinnerFromCall)
        console.log(entranceFee)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            // try to read the raffle entrance fee

            updateUI()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async (tx) => {
        await tx.wait(1) //this is the piece to wait for transaction to be confirmed
        handleNewNotification(tx)
        updateUI()
    }

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete",
            title: "Tx Notification",
            position: "topR",
            icon: "bell",
        })
    }

    return (
        <div className="p-5">
            Hi from Raffle Entrance
            {raffleAddress ? (
                <div>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onclick={async () => {
                            await enterRaffle({
                                //onComplete:
                                onSuccess: handleSuccess, //only checks to see if transaction is sent to metamask
                                onError: (error) => {
                                    console.log(error)
                                },
                            })
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            <div>Enter Raffle</div>
                        )}
                    </button>
                    <div>
                        Entrance Fee: {ethers.utils.formatUnits(entranceFeeFromCall, "ethers")} ETH
                    </div>
                    <div>Number of Players: {numPlayers}</div>
                    <div>Recent Winner: {recentWinner}</div>
                </div>
            ) : (
                <div>No Raffle Address Detected</div>
            )}
        </div>
    )
}
export default LotteryEntrance
