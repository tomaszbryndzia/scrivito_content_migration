import * as Scrivito from "scrivito";

Scrivito.provideEditingConfig("RootPage", {
  title: "Root Page",
  hideInSelectionDialogs: true,
  attributes: {
    title: {
      title: "Titel",
    },
    destination: {
      title: "Ziel der automatischen Weiterleitung",
    },
    logo: {
      description: "Logo, das oben links über der Navigation angezeigt wird.",
    },
  },
  properties: ["title", "destination", "logo"],
});
