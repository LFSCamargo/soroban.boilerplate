#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, String};

#[test]
fn test() {
  let env = Env::default();
  let contract_id = env.register(Contract, ());
  let client = ContractClient::new(&env, &contract_id);
  let to = Address::generate(&env);

  env.mock_all_auths();

  let greeting1 = client
    .customize_greeting(&to, &String::from_str(&env, "Hello, World! Luiz"));

  let greeting = client.hello(&to);

  assert_eq!(greeting.address, to);
  assert_eq!(greeting.greeting, greeting1.greeting);
}
