export const getShortId = (id: string) => {
  if (!id) return "";
  return id.split("-")[0];
};
