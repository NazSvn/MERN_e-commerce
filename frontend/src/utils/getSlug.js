const getSlug = (input) => {
  return input.trim().replace(/\s+/g, "_").toLowerCase();
};

export default getSlug;
