# Soroban Boilerplate

This repository provides a boilerplate for building Soroban contracts on the Stellar network. It includes a CLI tool for deploying contracts, a basic contract example, and a recommended project structure.

## Project Structure

This repository uses the recommended structure for a Soroban project:

```text
.
├── .github/workflows
│   └── code-quality.yml
├── .vscode
│   ├── extensions.json
│   └── settings.json
├── cli
│   ├── src
│   │   ├── commands
│   │   │   ├── deploy.ts
│   │   │   └── index.ts
│   │   ├── types
│   │   │   ├── index.ts
│   │   │   └── network.ts
│   │   ├── utility
│   │   │   ├── index.ts
│   │   │   ├── directory-utility.ts
│   │   │   ├── contract-utility.ts
│   │   │   └── network-utility.ts
│   │   └── main.ts
│   ├── package.json
│   └── tsconfig.json
├── contracts
│   └── hello_world
│       ├── src
│       │   ├── lib.rs
│       │   └── test.rs
│       └── Cargo.toml
├── scripts
│   └── install_stellar.sh
├── .editorconfig
├── .gitignore
├── .nvmrc
├── .prettierrc
├── Cargo.lock
├── Cargo.toml
├── Makefile
├── package.json
├── pnpm-workspace.yaml
├── README.md
└── rustfmt.toml
```

## CLI Tool

The CLI tool is located in the `cli` directory. It provides commands to deploy Soroban contracts to the Stellar network.

### Deploy Command

To deploy a contract, use the following command:

```bash
pnpm deploy --deployer <secretKey> --contractWasm <path>
```

Replace `<secretKey>` with the secret key of the account deploying the contract and `<path>` with the path to the compiled WASM file of the contract.

### Example

To deploy the `hello_world` contract, first compile it using the Rust toolchain:

```bash
make build
```

Then, deploy it using the CLI:

```bash
pnpm deploy --network testnet --deployer <your_secret_key> --contractWasm ./contracts/hello_world/target/wasm32v1-none/release/hello_world.wasm
```
## Contracts

The `hello_world` contract is a simple example that can be found in the `contracts/hello_world` directory. It includes a basic implementation of a Soroban contract written in Rust.

## Installation, Building and Testing

To install the necessary dependencies for the project, run the following command:

```bash
pnpm install
```

To build the project, use the following command:

```bash
make build
```

To test the project, run:

```bash
make test
``` 

## Code Quality Github Workflow

This repository includes a GitHub Actions workflow for code quality checks. The workflow is defined in `.github/workflows/code-quality.yml` and runs on every push and pull request. It checks for tests, and compiles the Rust contracts.


