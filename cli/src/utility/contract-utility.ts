import * as StellarSDK from "@stellar/stellar-sdk";
import fs from "fs";
import debug from "debug";
import { getRootDirectory } from "./directory-utility";

const log = debug("cli:contract-utility");

export function getServer(url: string) {
  if (!url) {
    throw new Error("Network URL is required");
  }
  return new StellarSDK.rpc.Server(url);
}

async function buildAndSendTransaction(
  account: StellarSDK.Account,
  operations: StellarSDK.xdr.Operation,
  sourceKeypair: StellarSDK.Keypair,
  server: StellarSDK.rpc.Server
) {
  const transaction = new StellarSDK.TransactionBuilder(account, {
    fee: StellarSDK.BASE_FEE,
    networkPassphrase: StellarSDK.Networks.TESTNET,
  })
    .addOperation(operations)
    .setTimeout(30)
    .build();

  const tx = await server.prepareTransaction(transaction);
  tx.sign(sourceKeypair);

  log("⚠️ Sending transaction ⚠️");
  let response:
    | StellarSDK.rpc.Api.SendTransactionResponse
    | StellarSDK.rpc.Api.GetTransactionResponse = await server.sendTransaction(
    tx
  );
  const hash = response.hash;
  log(`⚠️ Transaction sent with hash: ${hash}. Waiting for confirmation... ⚠️`);

  while (true) {
    response = await server.getTransaction(hash);
    if (response.status !== "NOT_FOUND") {
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  if (response.status === "SUCCESS") {
    log("✅ Transaction Successful ✅");
    return response;
  } else {
    log("🚨 Transaction Failed Failed 🚨");
    throw new Error("Transaction failed");
  }
}

export async function deployContract(
  response: Awaited<ReturnType<typeof buildAndSendTransaction>>,
  secretKey: string,
  serverUrl: string,
  constructorArgs?: StellarSDK.xdr.ScVal[]
) {
  const server = getServer(serverUrl);

  log("⚠️ Deploying contract to the Stellar ⚠️");
  const sourceKeypair = StellarSDK.Keypair.fromSecret(secretKey);
  const account = await server.getAccount(sourceKeypair.publicKey());

  const operation = StellarSDK.Operation.createCustomContract({
    wasmHash: response.returnValue!.bytes(),
    address: StellarSDK.Address.fromString(sourceKeypair.publicKey()),
    // @ts-ignore
    salt: response.hash,
    constructorArgs,
  });

  log("⚠️ Building and sending transaction to deploy contract ⚠️");

  const responseDeploy = await buildAndSendTransaction(
    account,
    operation,
    sourceKeypair,
    server
  );
  const contractAddress = StellarSDK.StrKey.encodeContract(
    StellarSDK.Address.fromScAddress(
      responseDeploy.returnValue!.address()
    ).toBuffer()
  );

  log(`✅ Contract deployed successfully at address: ${contractAddress} ✅`);

  return contractAddress;
}

export async function uploadWasm(
  contractPath: string,
  secretKey: string,
  serverUrl: string
) {
  log("⚠️ Uploading contract WASM to Stellar ⚠️");
  const server = getServer(serverUrl);
  const rootDir = getRootDirectory();

  const bytecode = fs.readFileSync(`${rootDir}/${contractPath}`);
  const sourceKeypair = StellarSDK.Keypair.fromSecret(secretKey);
  const account = await server.getAccount(sourceKeypair.publicKey());
  const operation = StellarSDK.Operation.uploadContractWasm({ wasm: bytecode });

  log("⚠️ Building and sending transaction to upload contract WASM ⚠️");

  return await buildAndSendTransaction(
    account,
    operation,
    sourceKeypair,
    server
  );
}
