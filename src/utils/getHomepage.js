import * as Scrivito from "scrivito";

const getHomepage = (obj = Scrivito.currentPage()) => {
  if (!obj || obj.objClass() === "Homepage") {
    return obj;
  }

  const path = obj.path();
  if (path === "" || !path) {
    return null;
  }

  const pathStart = path.split("/")[1];

  return Scrivito.Obj.getByPath(`/${pathStart}`);
};

export default getHomepage;
