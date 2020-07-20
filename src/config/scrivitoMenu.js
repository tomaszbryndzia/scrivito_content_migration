import * as Scrivito from "scrivito";

Scrivito.extendMenu((menu) => {
  menu.remove("system.createPage");
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
