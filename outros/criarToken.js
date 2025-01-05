const jwt = require('jsonwebtoken');
require('dotenv').config();

const id = '677ac805d347b4384ebc3857';

 // Gerar o token JWT
    const token = jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: '1h' });

    
    console.log(`iD: ${id}`);
    console.log(`ToKen: ${token}`);
    console.log(`https://jwt.io/#debugger-io?token=${token}`)

//link para testar o token - lembrar que o chave secreta é base64
//https://jwt.io/
// lembrar de alterar o id é de acordo com o usuario