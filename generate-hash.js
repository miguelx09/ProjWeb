import bcrypt from 'bcrypt';

const password = '123456';

bcrypt.hash(password, 10).then(hash => {
  console.log('\n===========================================');
  console.log('Hash gerado para a password "123456":');
  console.log('===========================================');
  console.log(hash);
  console.log('===========================================\n');
  console.log('Copia o hash acima e executa na base de dados:');
  console.log(`UPDATE users SET password_hash = '${hash}';`);
  console.log('\n');
});



