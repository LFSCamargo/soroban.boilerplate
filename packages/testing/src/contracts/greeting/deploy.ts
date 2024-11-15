import { TestNet } from "stellar-plus/lib/stellar-plus/network";
import { GreetingContract } from ".";
import { loadWasmFile } from "@self/utils/wasm";
import { DefaultAccountHandler } from "stellar-plus/lib/stellar-plus/account";

export async function uploadAndDeploy() {
  const wasmBuffer = await loadWasmFile(GreetingContract.contractWASMPath);

  const networkConfig = TestNet();
  const contractEngine = new GreetingContract({
    networkConfig,
    contractParameters: {
      wasm: wasmBuffer,
    },
  });

  const admin = new DefaultAccountHandler({ networkConfig });

  await admin.initializeWithFriendbot();

  const txInvocation = {
    header: {
      source: admin.getPublicKey(),
      fee: "10000000",
      timeout: 45,
    },
    signers: [admin],
  };

  await contractEngine.uploadWasm(txInvocation);

  await contractEngine.deploy(txInvocation);

  return contractEngine;
}
