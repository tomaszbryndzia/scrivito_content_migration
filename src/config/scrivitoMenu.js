import * as Scrivito from "scrivito";

Scrivito.extendMenu(menu => {
  menu.remove("system.createPage");
  menu.insert({
    id: "editorNotification",
    title: "Not sure how to name it",
    icon: "/important-sign.svg", // TODO: icon is needed here
    description: "Wichtige Nachrichten für den Redakteur.",
    position: { after: "system.enableTour" }, // TODO: Clearify with customer
    group: "system.help",
    onClick: () => Scrivito.openDialog("EditorNotification"),
    enabled: true,
  });
  menu.insert({
    id: "webMigration",
    title: "Migrate content",
    icon: null,
    description: "Migrate content to another web.",
    onClick: () => {
      window.top.contentMigration.openWindow();
    },
    position: { after: "system.duplicateObj" },
    group: "system.add",
    enabled: countryMigrationEnabled(),
  });
});

function countryMigrationEnabled() {
  const currentPage = Scrivito.currentPage();
  if (!currentPage) {
    return false;
  }
  return (
    Scrivito.isInPlaceEditingActive() &&
    Scrivito.currentPage().objClass() !== "Homepage"
  );
}
