# FireFly CLI - Local Development Setup

This guide walks you through setting up the FireFly CLI for local development on Linux systems.

## Prerequisites

Before you begin, ensure you have the following installed on your development machine:

### Required Software

1. **Go** (version 1.22 or later)
2. **Docker** 
3. **Docker Compose**
4. **OpenSSL** (usually pre-installed on Linux)
5. **Make** (for build automation)

### Installation Steps

#### 1. Install Go

If Go is not installed on your system:

```bash
# Install Go using snap (recommended)
sudo snap install go --classic

# Verify installation
go version
```

Expected output: `go version go1.24.4 linux/amd64` (or similar)

#### 2. Verify Docker Installation

```bash
# Check Docker version
docker --version

# Check Docker Compose version
docker-compose --version
# OR (newer Docker installations)
docker compose version
```

If Docker is not installed, follow the [official Docker installation guide](https://docs.docker.com/engine/install/).

#### 3. Install Make

```bash
sudo apt update
sudo apt install make -y
```

#### 4. Install OpenSSL (if not present)

```bash
# OpenSSL is usually pre-installed, but if needed:
sudo apt install openssl -y
```

## Building the FireFly CLI

### 1. Clone and Navigate to the Repository

```bash
cd /path/to/your/firefly-cli
```

### 2. Download Dependencies

```bash
cd ff && go mod download
```

### 3. Build the Binary

You have several options for building:

#### Option A: Using Make (Recommended)

```bash
# Build the binary
make build

# Or build with full pipeline (format, build, lint, test)
make all
```

#### Option B: Direct Go Build

```bash
cd ff
go build -ldflags="-X 'github.com/hyperledger/firefly-cli/cmd.BuildDate=$(date -u +"%Y-%m-%dT%H:%M:%SZ")' -X 'github.com/hyperledger/firefly-cli/cmd.BuildCommit=$(git rev-parse --short HEAD)'"
```

### 4. Verify the Build

```bash
# Check if the binary was created
ls -la ff/ff

# Test the binary
./ff/ff --help
```

Expected output should show the FireFly CLI help menu.

## Installation Options

### Option 1: Global Installation (Recommended)

Install the CLI globally so you can use `ff` from anywhere:

```bash
# Install to system PATH
make install

# Or manually copy to /usr/local/bin
sudo cp ff/ff /usr/local/bin/ff
sudo chmod +x /usr/local/bin/ff
```

Verify global installation:
```bash
ff --help
ff version
```

### Option 2: Local Development Usage

If you prefer to keep it local for development:

```bash
# Create an alias in your shell profile
echo 'alias ff="/path/to/your/firefly-cli/ff/ff"' >> ~/.bashrc
source ~/.bashrc

# Or use the full path
/path/to/your/firefly-cli/ff/ff --help
```

## Development Workflow

### Running Tests

```bash
# Run all tests
make test

# Run tests with coverage
go test ./internal/... ./pkg/... ./cmd/... -cover -coverprofile=coverage.txt -covermode=atomic -timeout=30s
```

### Code Formatting

```bash
# Format all Go code
make format

# Or directly
gofmt -s -w .
```

### Linting

```bash
# Run linter
make lint

# Install linter if not present
go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
```

### Building for Different Platforms

```bash
# Linux AMD64 (default)
GOOS=linux GOARCH=amd64 go build -o ff-linux-amd64

# Windows
GOOS=windows GOARCH=amd64 go build -o ff-windows-amd64.exe

# macOS Intel
GOOS=darwin GOARCH=amd64 go build -o ff-darwin-amd64

# macOS Apple Silicon
GOOS=darwin GOARCH=arm64 go build -o ff-darwin-arm64
```

## Using the FireFly CLI

### Basic Commands

```bash
# Show help
ff --help

# Show version
ff version

# Initialize a new FireFly stack
ff init

# Start a stack
ff start <stack_name>

# Stop a stack
ff stop <stack_name>

# List all stacks
ff list

# View stack information
ff info <stack_name>

# Remove a stack
ff remove <stack_name>
```

### Creating Your First Stack

```bash
# Initialize a new Ethereum-based stack
ff init ethereum

# Follow the prompts to configure your stack
# Then start it
ff start <your_stack_name>
```

### Accessing the FireFly UI

Once your stack is running, you can access:
- **FireFly UI**: http://localhost:5000
- **FireFly API**: http://localhost:5000/api

## Troubleshooting

### Common Issues

#### 1. Permission Denied with Docker

If you get permission errors with Docker:

```bash
# Add your user to the docker group
sudo usermod -aG docker $USER

# Log out and log back in, or run:
newgrp docker
```

#### 2. Port Already in Use

If ports are already in use:

```bash
# Check what's using the port
sudo netstat -tulpn | grep :5000

# Stop conflicting services or change ports in stack configuration
```

#### 3. Build Failures

```bash
# Clean and rebuild
make clean
go clean -cache
make build
```

#### 4. Module Download Issues

```bash
# Clean module cache
go clean -modcache
go mod download
```

### Getting Help

- **GitHub Issues**: [FireFly CLI Issues](https://github.com/hyperledger/firefly-cli/issues)
- **Documentation**: [FireFly Documentation](https://hyperledger.github.io/firefly/)
- **Discord**: Join the Hyperledger FireFly community

## Development Tips

1. **Hot Reloading**: Rebuild and test changes frequently
2. **Docker Management**: Use `docker system prune` occasionally to clean up
3. **Log Files**: Check `~/.firefly/logs/` for detailed logs
4. **Stack Data**: Stack data is stored in `~/.firefly/stacks/`

## Contributing

When contributing to the project:

1. Run `make all` before committing
2. Ensure all tests pass
3. Follow the existing code style
4. Update documentation as needed

## Makefile Targets

```bash
make all        # Format, build, lint, test, and tidy
make build      # Build the binary
make test       # Run tests
make lint       # Run linter
make format     # Format code
make install    # Install globally
make clean      # Clean build artifacts
make help       # Show available targets
```

---

**Note**: This guide assumes a Linux development environment. For other operating systems, adjust the commands accordingly.
