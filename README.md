# The Hello Ootle Tapplet

This is an _hello world_ tapplet for testing purposes only. All you can do here is connect to the `TariProvider` and check the status of your user account. Just like that.

## Provide configuration in .env file

Copy the `.env.example` file to `.env` and edit the correct environment variable values.

## Run the application

To run the web:

```shell
npm install
npm run dev
```

### Tari Universe Setup

Make sure that `taplet.config.json` is in the root directory and has all the required fields as below. The values ​​are just examples and may vary.

```
{
  "packageName": "hello-ootle",
  "displayName": "Hello Ootle",
  "version": "0.1.0",
  "supportedChain": ["MAINNET", "STAGENET", "NEXTNET"],
  "permissions": {
    "requiredPermissions": [
      "TariPermissionAccountInfo",
    ],
    "optionalPermissions": []
  }
}
```

### Connect to your wallet

Click on `Connect` button on the top right corner, choose `WalletConnect` option.

![Open WalletConnect](docs/wallet-connect-1.png)

Copy the connection id by clicking on copy icon on the top right corner.

![Copy WalletConnect connection id](docs/wallet-connect-2.png)

Go to your wallet and click `Connect with WalletConnect` button.
A dialog will appear asking you to approve the connection.

![Copy WalletConnect connection id](docs/wallet-connect-3.png)

Authorize it on the next screen.

![Copy WalletConnect connection id](docs/wallet-connect-4.png)

Now you should be connected. Go back to application and the connection button now should read `Connected`.
