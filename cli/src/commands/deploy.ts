import type { Arguments, CommandBuilder } from "yargs";
import * as StellarSDK from "@stellar/stellar-sdk";
import {
  deployContract,
  getNetworkUrl,
  uploadWasm,
  getRootDirectory,
} from "../utility";
import { Network } from "../types/network";
import debug from "debug";

const log = debug("cli:deploy");

interface DeployOptions {
  deployer: string;
  contractWasm: string;
  network: string;
  constructorArgs: StellarSDK.xdr.ScVal[];
}

export const command: string = "deploy";
export const desc: string = "Deploy a Stellar smart contract";

export const builder: CommandBuilder<DeployOptions, DeployOptions> = (yargs) =>
  yargs
    .usage(
      "Usage: $0 deploy --deployer <secretKey> --contractWasm <path> [options]"
    )
    .options({
      deployer: {
        type: "string",
        describe:
          "Secret key of the stellar account that will own the contract",
        demandOption: true,
        alias: "d",
      },
      contractWasm: {
        type: "string",
        describe: "Path to the contract WASM file",
        demandOption: true,
        alias: "w",
      },
      network: {
        type: "string",
        describe: "Network to deploy to",
        choices: ["mainnet", "testnet"],
        default: "testnet",
        alias: "n",
      },
      constructorArgs: {
        type: "array",
        describe:
          "Constructor arguments for the contract in Stellar SCVal format",
        default: [],
        alias: "c",
        coerce: (args) => {
          // Convert string arguments to Stellar SCVal format
          return args.map((arg: unknown) => {
            try {
              let argument = StellarSDK.Address.fromString(arg as string);

              return StellarSDK.nativeToScVal(argument, {
                type: "address",
              });
            } catch (error) {
              return StellarSDK.nativeToScVal(arg, {
                type: typeof arg,
              });
            }
          });
        },
      },
    })
    .check((argv) => {
      // Validate secret key format (basic check for Stellar secret key)
      const secretKey = argv.deployer as string;
      if (!secretKey.startsWith("S") || secretKey.length !== 56) {
        throw new Error(
          'Invalid secret key format. Stellar secret keys start with "S" and are 56 characters long.'
        );
      }

      return true;
    });

export const handler = async (
  argv: Arguments<DeployOptions>
): Promise<void> => {
  const { contractWasm, deployer, constructorArgs } = argv as DeployOptions;

  log(`Deploying contract from WASM file: ${contractWasm}`);

  const network = argv.network as Network;

  const networkUrl = getNetworkUrl(network);

  log(`Using network URL: ${networkUrl}`);

  log(`Uploading contract WASM to Stellar...`);

  const response = await uploadWasm(contractWasm, deployer, networkUrl);

  log("WASM uploaded successfully. Building transaction to deploy contract...");

  const address = await deployContract(
    response,
    deployer,
    networkUrl,
    constructorArgs
  );

  log(`Contract deployed at address: ${address}`);

  const sourceKeypair = StellarSDK.Keypair.fromSecret(deployer);

  log(`Contract deployed successfully at address: ${address}`);
  log(`Network: ${network}`);
  log(`Deployer: ${sourceKeypair.publicKey()}`);
};
