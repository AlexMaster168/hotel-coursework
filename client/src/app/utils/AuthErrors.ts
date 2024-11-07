const generateAuthError = (message: string) => {
  switch (message) {
    case 'EMAIL_EXISTS':
      return 'Користувач із таким email вже існує';
    case 'USER_DISABLED':
      return 'Обліковий запис користувача вимкнено адміністратором.';
    case 'EMAIL_NOT_FOUND':
    case 'INVALID_PASSWORD':
    case 'INVALID_EMAIL':
      return 'Невірний email або пароль';
    default:
      return 'Занадто багато спроб входу, спробуйте пізніше';
  }
};

export default generateAuthError;
