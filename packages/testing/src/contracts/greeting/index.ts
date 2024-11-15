import { ContractEngine } from "stellar-plus/lib/stellar-plus/core/contract-engine";
import { ContractEngineConstructorArgs } from "stellar-plus/lib/stellar-plus/core/contract-engine/types";
import { TransactionInvocation } from "stellar-plus/lib/stellar-plus/types";
import { GreetingContractMethods } from "./methods";
import {
  GreetingContractInputTypes,
  GreetingContractOutputTypes,
} from "./types";
import { uploadAndDeploy as uploadAndDeployGreeting } from "./deploy";

export { uploadAndDeployGreeting };

export class GreetingContract extends ContractEngine {
  static contractWASMPath =
    __dirname +
    "/../../../../../target/wasm32-unknown-unknown/release/greeting_contract.wasm";

  constructor(args: ContractEngineConstructorArgs) {
    super(args);
  }

  public async setUserInfo(
    args: TransactionInvocation & GreetingContractInputTypes["set_info"],
  ) {
    const txInvocation = args;

    await this.invokeContract({
      method: GreetingContractMethods.SetUserInfo,
      methodArgs: {
        ...(args as GreetingContractInputTypes["set_info"]),
      } as GreetingContractInputTypes["set_info"],
      ...txInvocation,
    });
  }

  public async getUserInfo(
    args: TransactionInvocation & GreetingContractInputTypes["get_user_info"],
  ): Promise<GreetingContractOutputTypes["get_user_info"]> {
    const txInvocation = args;

    return (await this.invokeContract({
      method: GreetingContractMethods.GetUserInfo,
      methodArgs: {
        ...(args as GreetingContractInputTypes["get_user_info"]),
      } as GreetingContractInputTypes["get_user_info"],
      ...txInvocation,
    })) as unknown as GreetingContractOutputTypes["get_user_info"];
  }
}
