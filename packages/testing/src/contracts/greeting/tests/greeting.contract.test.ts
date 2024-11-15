import { adminTxInvocation, getAdmin } from "@self/utils/admin";

import {
  contractIdRegex,
  wasmHashRegex,
} from "stellar-plus/lib/stellar-plus/utils/regex";
import { uploadAndDeployGreeting } from "..";

describe("End-to-end test for Greeting Contract", () => {
  it("should be able to upload and interact with the contract", async () => {
    const admin = await getAdmin();
    const contract = await uploadAndDeployGreeting();

    expect(contract.getContractId()).toMatch(contractIdRegex);
    expect(contract.getWasmHash()).toMatch(wasmHashRegex);

    const payload = {
      to: admin.getPublicKey(),
      message: "Hello, from Stellar Plus!",
      name: "Luiz",
    };

    await expect(
      contract.setUserInfo({
        ...adminTxInvocation(),
        ...payload,
      }),
    ).resolves.toBeDefined();

    const user_info = contract.getUserInfo({
      ...adminTxInvocation(),
      to: admin.getPublicKey(),
    });

    await expect(user_info).resolves.toMatchObject({
      message: payload.message,
      name: payload.name,
      address: admin.getPublicKey(),
    });
  });
});
