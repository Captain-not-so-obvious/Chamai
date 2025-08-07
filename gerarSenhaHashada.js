const bcrypt = require('bcryptjs');

// Senha que você deseja usar para o seu primeiro admin
const senhaDoAdmin = 'ZapTI';

// Gera o hash da senha
const salt = bcrypt.genSaltSync(10);
const senhaCriptografada = bcrypt.hashSync(senhaDoAdmin, salt);

console.log('Senha criptografada:');
console.log(senhaCriptografada);