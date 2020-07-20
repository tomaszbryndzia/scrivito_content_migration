import * as React from "react";
import * as Scrivito from "scrivito";
import InPlaceEditingPlaceholder from "../../Components/InPlaceEditingPlaceholder";

class RootComponent extends React.Component {
  componentDidMount() {
    Scrivito.load(() => {
      const link = this.props.page.get("destination");
      const url = link && Scrivito.urlFor(link);

      return { link, url };
    }).then(({ link, url }) => {
      if (!link) {
        return;
      }
      if (Scrivito.isEditorLoggedIn()) {
        const scrivitoUiUrl = `${window.location.origin}/scrivito/${link.id()}`;

        window.top.location.replace(scrivitoUiUrl);
      } else {
        window.location.replace(url);
      }
    });
  }

  render() {
    const link = this.props.page.get("link");

    if (!link) {
      return (
        <InPlaceEditingPlaceholder center>
          Bitte setzen Sie einen Weiterleitungslink in den Einstellungen.
        </InPlaceEditingPlaceholder>
      );
    }

    return null;
  }
}

Scrivito.provideComponent("RootPage", RootComponent);
