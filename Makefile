# Default target, which will trigger the build
default: build

# Build target using the Soroban contract build command
build:
	soroban contract build

# Test target which builds the project and then runs the tests
test: build
	cargo test

# Clean target which removes the build artifacts
clean:
	cargo clean

# Alias for the test target, that technically runs all the important scripts
all: test

# Format using cargo formatting tool
fmt:
	cargo fmt --all

# Lint using cargo linter
lint:
	cargo fmt --all --check

# Build target using the Soroban contract build command
bindings:
	soroban contract inspect --wasm ./target/wasm32-unknown-unknown/release/greeting_contract.wasm

test_integration: build
	pnpm install && pnpm test
