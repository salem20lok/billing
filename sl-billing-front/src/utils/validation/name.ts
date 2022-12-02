export const isName = (name: string) => {
  const re = new RegExp(/^[a-zA-Z\- ]+$/);
  if (name.length <= 2) {
    return false;
  } else {
    return re.test(name);
  }
};
