# SphereOne Web SDK - Quick Installation Guide

This guide provides step-by-step instructions for installing and getting started with the SphereOne Web SDK.

## Prerequisites

- Node.js (version 16 or higher) and npm (Node Package Manager) installed on your machine.

Please contact [SphereOne Support](mailto:support@sphereone.xyz?subject=Request%20for%20Web%20SDK%20Assistance) for further support such as API Keys, Accounts, and other necessary project setups.

Once that is done, please follow the steps below.


## Build the Project for Local Development

1. Download the repository from Github:

```bash
git clone https://github.com/SphereGlobal/WebSDK.git
```

2. Change to the project directory:

```bash
cd WebSDK
```

3. Install the project dependencies:

```bash
npm install
```

And that's it, for you to start working.


## Installation into Another Project

1. Install the repository from GitHub via Https:

```bash
npm install https://github.com/SphereGlobal/WebSDK.git
```
or with `yarn`:
```bash
yarn add https://github.com/SphereGlobal/WebSDK.git
```

It should look something like this:
```JSON
{
  "name": "test-project",
  "version": "1.0.0",
  "description": "Test Project with SphereOne WebSDK",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "websdk": "github:SphereGlobal/WebSDK"
  }
}
```
And that's all you need to do, in order to install the SphereOne WebSDK into your project.

## Login

`TBD`


# Further Assistance
If there's missing information not present in the SDK, please reach out to [Official SphereOne Documentation](https://docs.sphereone.xyz/).

# Troubleshooting
If you encounter any issues during the installation or usage of the SphereOne Web SDK, please refer to the troubleshooting section in the documentation or open an issue on GitHub.

# License
This project is licensed under the GNU AGPLv3 License.
