#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, String};

fn create_client<'a>(e: &Env, owner: &Address) -> ContractClient<'a> {
  let address = e.register(Contract, (owner, "Hello"));
  ContractClient::new(e, &address)
}

#[test]
fn test_custom_greeting() {
  let env = Env::default();

  let owner = Address::generate(&env);
  let client = create_client(&env, &owner);

  let to = Address::generate(&env);

  env.mock_all_auths();

  let greeting1 = client
    .customize_greeting(&to, &String::from_str(&env, "Hello, World! Luiz"));

  let greeting = client.hello(&to);

  assert_eq!(greeting.address, to);
  assert_eq!(greeting.greeting, greeting1.greeting);
}

#[test]
fn test_default_greeting() {
  let env = Env::default();

  let owner = Address::generate(&env);
  let client = create_client(&env, &owner);

  let to = Address::generate(&env);

  env.mock_all_auths();

  let greeting = client.hello(&to);

  assert_eq!(greeting.address, to);
  assert_eq!(greeting.greeting, String::from_str(&env, "Hello"));
}
