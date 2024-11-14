#![cfg(test)]

use super::*;
use contract::{GreetingContract, GreetingContractClient};
use soroban_sdk::testutils::Address as _;
use soroban_sdk::{Address, Env, IntoVal, String};
use storage::StorageClient;

#[test]
fn should_get_default_user_info() {
  let env = Env::default();
  env.mock_all_auths();

  let contract_id = env.register_contract(None, GreetingContract);
  let client = GreetingContractClient::new(&env, &contract_id);

  let user = Address::generate(&env);

  let default_user_info = StorageClient::get_default_user_info(env, user.clone());

  let user_info = client.get_user_info(&user);

  assert_eq!(default_user_info.message, user_info.message);
  assert_eq!(default_user_info.name, user_info.name);
  assert_eq!(default_user_info.address, user_info.address);
}

#[test]
fn should_set_user_info_and_update_storage() {
  let env = Env::default();

  env.mock_all_auths();

  let contract_id = env.register_contract(None, GreetingContract);
  let client = GreetingContractClient::new(&env, &contract_id);

  let user = Address::generate(&env);

  let default_user_info = StorageClient::get_default_user_info(env.clone(), user.clone());

  let user_info = client.get_user_info(&user);

  assert_eq!(default_user_info.message, user_info.message);
  assert_eq!(default_user_info.name, user_info.name);
  assert_eq!(default_user_info.address, user_info.address);

  let message: String = "Wassup, ".into_val(&env);

  let name: String = "Testing Suite".into_val(&env);

  client.set_info(&user, &message, &name);

  let updated_info = client.get_user_info(&user);

  assert_ne!(updated_info.name, user_info.name);
  assert_ne!(updated_info.message, user_info.message);
  assert_eq!(updated_info.name, name);
  assert_eq!(updated_info.message, message)
}
