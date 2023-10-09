export function generateRandomPassword(length: number): string {
    const charset = 'abcdefghijklmnopqrs*&^%$#@@@@IJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()(*&^%$#';
    let password = '';
    for (let i = 0; i < length; ++i) {
      const randomPass = Math.floor(Math.random() * charset.length);
      password += charset[randomPass];
    }
    console.log('Random Password:', password);

    return password;
  }