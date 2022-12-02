export const isPassword = (password: string) => {
  const re = new RegExp(
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
  );
  return re.test(password);
};
