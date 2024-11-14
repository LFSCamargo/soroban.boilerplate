use crate::storage;
use soroban_sdk::{contract, contractimpl, Address, Env, String};

#[contract]
pub struct GreetingContract;

#[contractimpl]
impl GreetingContract {
  pub fn get_user_info(env: Env, to: Address) -> storage::UserInfo {
    to.require_auth();

    let key = storage::UserInfoRegistry::UserInfos(to.clone());

    let user_record = env
      .storage()
      .instance()
      .get(&key)
      .unwrap_or(storage::StorageClient::get_default_user_info(env, to));

    return user_record;
  }

  pub fn set_info(env: Env, to: Address, message: String, name: String) {
    to.require_auth();

    let key = storage::UserInfoRegistry::UserInfos(to.clone());

    let mut user_record = env
      .storage()
      .instance()
      .get(&key)
      .unwrap_or(storage::StorageClient::get_default_user_info(env.clone(), to));

    user_record.message = message.clone();
    user_record.name = name.clone();

    env.storage().instance().set(&key, &user_record);
  }
}
