import { Address } from "stellar-plus/lib/stellar-plus/types";
import { GreetingContractMethods } from "./methods";

export type GreetingContractInputTypes = {
  [GreetingContractMethods.GetUserInfo]: {
    to: string;
  };

  [GreetingContractMethods.SetUserInfo]: {
    to: string;
    message: string;
    name: string;
  };
};

export type GreetingContractOutputTypes = {
  [GreetingContractMethods.GetUserInfo]: {
    message: string;
    name: string;
    address: Address;
  };
};
