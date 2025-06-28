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
  Owner,
  DefaultGreeting,
  Greeting(Address),
}

#[contract]
pub struct Contract;

#[contractimpl]
impl Contract {
  pub fn __constructor(env: Env, owner: Address, default_greeting: String) {
    env
      .storage()
      .instance()
      .set(&DataKey::Owner, &owner.clone());

    env
      .storage()
      .instance()
      .set(&DataKey::DefaultGreeting, &default_greeting);
  }

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
    let default_greeting: String = env
      .storage()
      .instance()
      .get(&DataKey::DefaultGreeting)
      .expect("Default greeting not set");

    let greeting = env
      .storage()
      .instance()
      .get(&DataKey::Greeting(to.clone()))
      .unwrap_or(Greeting {
        address: to.clone(),
        greeting: default_greeting.clone(),
      });

    greeting
  }
}

mod test;
