// TODO lets use crypto-js

const getClientOrderId = () =>
  [...Array(32)].map((i) => (~~(Math.random() * 36)).toString(36)).join('');

export default getClientOrderId;
