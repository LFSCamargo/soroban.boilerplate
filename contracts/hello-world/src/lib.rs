#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String};

#[contracttype]
#[derive(Clone)]
pub struct Greeting {
  pub address: Address,
  pub greeting: String,
}

#[contracttype]
pub enum DataKey {
  Greeting(Address),
}

#[contract]
pub struct Contract;

// This is a sample contract. Replace this placeholder with your own contract logic.
// A corresponding test example is available in `test.rs`.
//
// For comprehensive examples, visit <https://github.com/stellar/soroban-examples>.
// The repository includes use cases for the Stellar ecosystem, such as data storage on
// the blockchain, token swaps, liquidity pools, and more.
//
// Refer to the official documentation:
// <https://developers.stellar.org/docs/build/smart-contracts/overview>.
#[contractimpl]
impl Contract {
  pub fn customize_greeting(
    env: Env,
    to: Address,
    greeting: String,
  ) -> Greeting {
    to.require_auth();

    env.storage().instance().set(
      &DataKey::Greeting(to.clone()),
      &Greeting {
        address: to.clone(),
        greeting: greeting.clone(),
      },
    );

    Greeting {
      address: to,
      greeting: greeting,
    }
  }

  pub fn hello(env: Env, to: Address) -> Greeting {
    let greeting = env
      .storage()
      .instance()
      .get(&DataKey::Greeting(to.clone()))
      .unwrap_or(Greeting {
        address: to.clone(),
        greeting: String::from_str(&env, "Hello"),
      });

    greeting
  }
}

mod test;
