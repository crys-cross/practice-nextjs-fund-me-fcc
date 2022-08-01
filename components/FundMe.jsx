// have function to enter Lottery
// TODO Challenge: update recentWinner by event trigger
import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit" //component library(the other is css library)

const FundMe = () => {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    console.log(parseInt(chainIdHex))
    const chainId = parseInt(chainIdHex)
    const fundMeAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const ethAmount = document.getElementById("ethAmount").value
    // const [ethAmount, setEthAmount] = useState("0") //[state or actual variable, the function to update it]
    const [numPlayers, setNumPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")
    const dispatch = useNotification() //little popup

    const {
        runContractFunction: Fund,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: fundMeAddress, // specify network ID
        functionName: "enterRaffle",
        params: {},
        msgValue: ethAmount,
    })

    const { runContractFunction: cheaperWithdraw } = useWeb3Contract({
        abi: abi,
        contractAddress: fundMeAddress, // specify network ID
        functionName: "cheaperWithdraw",
        params: {},
    })

    // const { runContractFunction: getaddressToAmountFunded } = useWeb3Contract({
    //     abi: abi,
    //     contractAddress: fundMeAddress, // specify network ID
    //     functionName: "getaddressToAmountFunded",
    //     params: { funder }, //get params
    // })

    // const { runContractFunction: getRecentWinner } = useWeb3Contract({
    //     abi: abi,
    //     contractAddress: fundMeAddress, // specify network ID
    //     functionName: "getRecentWinner",
    //     params: {},
    // })

    const updateUI = async () => {
        // const entranceFeeFromCall = (await getEntranceFee()).toString()
        // const numpleyersFromCall = (await getNumberOfplayers()).toString()
        // const recentWinnerFromCall = await getRecentWinner()
        // setEntranceFee(entranceFeeFromCall)
        // setNumPlayers(numpleyersFromCall)
        // setRecentWinner(recentWinnerFromCall)
        console.log(ethAmount)
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
            message: "Funding of ${ethAmount} Complete",
            title: "Tx Notification",
            position: "topR",
            icon: "bell",
        })
    }

    return (
        <div className="p-5">
            Simple FundMe App
            {fundMeAddress ? (
                <div>
                    <label for="fund">ETH Amount</label>
                    <input id="ethAmount" placeholder="0.1" />
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onclick={async () => {
                            await Fund({
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
                            <div>Fund</div>
                        )}
                    </button>
                    <div>
                        Entrance Fee: {ethers.utils.formatUnits(entranceFeeFromCall, "ethers")} ETH
                    </div>
                    <div>Number of Players: {numPlayers}</div>
                    <div>Recent Winner: {recentWinner}</div>
                </div>
            ) : (
                <div>Please Connect your Metamask</div>
            )}
        </div>
    )
}
export default FundMe
