import * as Scrivito from "scrivito";

const RootPage = Scrivito.provideObjClass("RootPage", {
  attributes: {
    title: "string",
    destination: "reference",
    logo: ["reference", { only: "Image" }],
    childOrder: "referencelist",
  },
});

export default RootPage;
