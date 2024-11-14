#![allow(unused)]
use soroban_sdk::{contracttype, symbol_short, Address, Env, IntoVal, String};

#[contracttype]
pub enum UserInfoRegistry {
  UserInfos(Address),
}

#[contracttype]
#[derive(Clone)]
pub struct UserInfo {
  pub address: Address,
  pub message: String,
  pub name: String,
}

pub struct StorageClient;

impl StorageClient {
  pub fn get_default_user_info(env: Env, user: Address) -> UserInfo {
    let message: String = "Hello, ".into_val(&env);
    let name: String = user.to_string().into_val(&env);

    UserInfo {
      address: user.clone(),
      message,
      name,
    }
  }
}
