export const format_errors = result => {
  return Object.keys(result).reduce((total, key) => {
    const value = result[key];
    return value === true ? total : [...total, ...value];
  }, []);
};

export const isExist = i => {
  return typeof i !== "undefined";
};

export const isNumber = i => {
  return (
    isExist(i) &&
    parseInt(i, 10).toString() === i.toString() &&
    !isNaN(parseInt(i, 10))
  );
};

export const containsKey = key => object => {
  return typeof object[key] === "string";
};
