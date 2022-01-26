const safeNumber = (value: string | undefined): number => {
  if (!value) return 0;
  let float = parseFloat(value);

  return isNaN(float) ? 0 : float;
};

export default safeNumber;
