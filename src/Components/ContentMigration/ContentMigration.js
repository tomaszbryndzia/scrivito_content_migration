import * as React from "react";
import * as Scrivito from "scrivito";

export class ContentMigration extends React.PureComponent {
  state = {
    ContentMigrationHelper: false,
  };

  componentDidMount() {
    if (Scrivito.isInPlaceEditingActive()) {
      import("./ContentMigrationHelper").then(module => {
        this.setState({ ContentMigrationHelper: module.default });
      });
    }
  }

  render() {
    const { ContentMigrationHelper } = this.state;

    return (
      ContentMigrationHelper && (
        <ContentMigrationHelper
          ref={ref => {
            window.top.contentMigration = ref;
          }}
        />
      )
    );
  }
}
