const { EmailClient } = require("@azure/communication-email");

const connectionString = connectionStringAzure;
const client = new EmailClient(connectionString);

async function main() {
    const emailMessage = {
        senderAddress: senderAddressAzure,
        content: {
            subject: "Email de Teste",
            plainText: "Olá, mundo por email.",
            html: `
			<html>
				<body>
					<h1>Olá, mundo por email.</h1>
				</body>
			</html>`,
        },
        recipients: {
            to: [{ address: "wsavioli@hotmail.com" }],
        },
        
    };

    const poller = await client.beginSend(emailMessage);
    const result = await poller.pollUntilDone();
}

main();