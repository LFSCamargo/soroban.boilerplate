import { Network } from "../types/index";

/**
 * @description Creates a network URL based on the provided network type.
 * @param {Network} network - The network type.
 * @returns {string} The URL for the specified network for deploying soroban contracts.
 */
export function getNetworkUrl(network: Network): string {
  switch (network) {
    case "mainnet":
      return "https://mainnet.sorobanrpc.com:443";
    case "testnet":
      return "https://soroban-testnet.stellar.org:443";
    default:
      throw new Error(`Unsupported network: ${network}`);
  }
}
