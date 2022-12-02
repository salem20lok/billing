export const isEmail = (email: string) => {
  const re = new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);
  return re.test(email);
};
