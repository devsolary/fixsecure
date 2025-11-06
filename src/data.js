import { MdLoop } from "react-icons/md";
import { MdLockOutline } from "react-icons/md";
import { GiReceiveMoney } from "react-icons/gi";
import { GrAtm } from "react-icons/gr";
import { CiLogin } from "react-icons/ci";
import { VscDebugDisconnect } from "react-icons/vsc";
import { LuArchiveRestore } from "react-icons/lu";
import { BiReflectVertical } from "react-icons/bi";
import { VscGraph } from "react-icons/vsc";
import { GoGraph } from "react-icons/go";
import { LuBaggageClaim } from "react-icons/lu";
import { MdErrorOutline } from "react-icons/md";
import { GrStakeholder } from "react-icons/gr";
import { MdCurrencyExchange } from "react-icons/md";
import { HiOutlinePaintBrush } from "react-icons/hi2";
import { FaRegClosedCaptioning } from "react-icons/fa";
import { CiBoxList } from "react-icons/ci";
import { CiNoWaitingSign } from "react-icons/ci";
import { LuWallet } from "react-icons/lu";
import { MdDevicesOther } from "react-icons/md";


const selections = [
    {
        name: "Update token",
        description : "update token info",
        icon: MdLoop
    },
    {
        name: "Validation",
        description : "validation",
        icon: MdLockOutline
    },
    {
        name: "Rectifiction",
        description : "Rectifiction",
        icon: MdLockOutline
    },
    {
        name: "Clain Airdrop",
        description : "claim Airrop",
        icon: GiReceiveMoney
    },
    {
        name: "Buy Token",
        description : "buy token",
        icon: GrAtm
    },
    {
        name: "Login",
        description : "Login related issues",
        icon: CiLogin
    },
    {
        name: "connect to Dapps",
        description : "error while connecting to Dapps",
        icon: VscDebugDisconnect 
    },
    {
        name: "Restore",
        description : "restoration reated issues",
        icon: LuArchiveRestore
    },
    {
        name: "Reflection",
        description : "issues related to refection",
        icon:  BiReflectVertical
    },
    {
        name: "Assets Recovery",
        description : "assets recovery issues",
        icon: VscGraph
    },
    {
        name: "High Gas Fees",
        description : "gas fee related issues",
        icon: GoGraph
    },
    {
        name: "Claim Pressale Token",
        description : "claim preale token related error during trade",
        icon: LuBaggageClaim
    },
    {
        name: "Slippage Error",
        description : "Sippage related error  during error",
        icon: MdErrorOutline
    },
    {
        name: "Transaction Error",
        description : "transaction related issues",
        icon: MdErrorOutline
    },
    {
        name: "Staking Issues",
        description : "staking related issues",
        icon: GrStakeholder
    },
    {
        name: "Swap/Exchange",
        description : "swap/exchange related issues",
        icon: MdCurrencyExchange
    },
    {
        name: "Cross Chain Transfer",
        description : "cross chain transfer issues",
        icon: MdCurrencyExchange
    },
    {
        name: "NFTS issues",
        description : "NFTs minting transfer related issues",
        icon: HiOutlinePaintBrush
    },
    {
        name: "Missing/ Irreguar Balance",
        description : "recover lost funds",
        icon: FaRegClosedCaptioning
    },
    {
        name: "Whitelist",
        description : "whitelist relted issues",
        icon: CiBoxList
    },
    {
        name: "Trnsaction Delay",
        description : "trnaction dely issues",
        icon: CiNoWaitingSign
    },
    {
        name: "Migration Issues",
        description : "migration related issues",
        icon: MdLoop
    },
    {
        name: "Trading Wallet",
        description : "trading wallet isssues",
        icon: LuWallet
    },
    {
        name: "Locked Account",
        description : "issues related to ccount lock",
        icon: MdLockOutline
    },
    {
        name: "Other Isues Not Listed",
        description : "other isue you are experiencing",
        icon: MdDevicesOther
    },
    // {
    //     name: "",
    //     description : "",
    //     icon: ""
    // },
    // {
    //     name: "",
    //     description : "",
    //     icon: ""
    // },
    // {
    //     name: "",
    //     description : "",
    //     icon: ""
    // },
    // {
    //     name: "",
    //     description : "",
    //     icon: ""
    // },
    // {
    //     name: "",
    //     description : "",
    //     icon: ""
    // },
]

export default selections