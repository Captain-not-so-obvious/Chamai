const bcrypt = require('bcryptjs');
const password = process.argv[2]; // Pega a senha do argumento da linha de comando

if (!password) {
  console.log("Por favor, forneça uma senha. Ex: node hash.js 'senha123'");
  process.exit(1);
}

const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);

console.log("Sua senha criptografada é:");
console.log(hash);