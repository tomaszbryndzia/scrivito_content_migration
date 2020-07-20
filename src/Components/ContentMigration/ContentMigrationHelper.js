import * as React from "react";
import * as Scrivito from "scrivito";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import InPlaceEditingPlaceholder from "../InPlaceEditingPlaceholder";
import getHomepage from "../../utils/getHomepage";

class ContentMigrationHelper extends React.Component {
  state = {
    open: false,
    checked: [],
    homepages: [],
    currentPage: undefined,
    homepagePath: "",
    success: false,
    newObjs: [],
    editObjs: [],
    delObjs: [],
  };

  initialLoad() {
    Scrivito.load(() => {
      const currentPage = Scrivito.currentPage();
      const currentPagePath = currentPage.path();
      const homepagePath = getHomepage().path();

      let homepagesQuery = Scrivito.Obj.where(
        "_objClass",
        "equals",
        "Homepage"
      );

      if (currentPagePath && currentPagePath.includes(homepagePath)) {
        homepagesQuery = homepagesQuery.andNot("_path", "equals", homepagePath);
      }

      const homepages = homepagesQuery.take();

      return {
        homepages,
        homepagePath,
        currentPage,
      };
    }).then(({ homepages, homepagePath, currentPage }) => {
      this.setState({
        homepages,
        homepagePath: `${homepagePath}/`,
        currentPage,
        success: false,
        newObjs: [],
        checked: [],
        editObjs: [],
      });
    });
  }

  openWindow = () => {
    this.initialLoad();
    this.setState({
      open: true,
    });
  };

  closeWindow = () => {
    this.setState({
      open: false,
    });
  };

  handleChange = (ev) => {
    const { value } = ev.target;

    const { checked } = this.state;
    const index = checked.indexOf(value);

    this.setState((prevState) => ({
      checked:
        index > -1
          ? prevState.checked.filter((e) => e !== value)
          : [...prevState.checked, value],
    }));
  };

  handleCopy = (oldPage) => {
    const { currentPage } = this.state;

    this.setState((prevState) => ({
      delObjs: [...prevState.delObjs, oldPage],
    }));

    const newUrl = oldPage.path().split("/").slice(0, -1).join("/");

    currentPage
      .copy()
      .then((copiedPage) => {
        copiedPage.update({
          _path: `${newUrl}/${copiedPage.id()}`,
          webReferences: [currentPage],
        });
        return copiedPage;
      })
      .then((copiedPage) => {
        this.setState((prevState) => ({
          editObjs: [...prevState.editObjs, copiedPage],
        }));
      });
  };

  handleMigration = () => {
    const { checked, currentPage } = this.state;
    this.setState({ loader: true });

    Scrivito.load(() => currentPage.get("webReferences"))
      .then((webRef) => {
        checked.map((homepagePath) => {
          const found = webRef.find((page) =>
            page.path().includes(homepagePath)
          );
          if (found) {
            this.handleCopy(found);
          } else {
            this.handleCreate(homepagePath);
          }
        });
        return webRef;
      })
      .then((webRef) => {
        setTimeout(() => {
          const { delObjs, editObjs } = this.state;

          if (delObjs.length) {
            delObjs.forEach((delPage) => {
              delPage.destroy();
            });
          }

          if (editObjs.length) {
            const arrDeletedItems = [];
            delObjs.forEach((p) => {
              arrDeletedItems.push(p.id());
            });

            const newRefs = webRef.filter((ref) => {
              if (!arrDeletedItems.includes(ref.id())) {
                return ref;
              }
            });

            currentPage.update({ webReferences: [...newRefs, ...editObjs] });
          }

          this.setState({
            success: true,
            loader: false,
          });
        }, 3000);
      });
  };

  handleCreate = (homepagePath) => {
    const { currentPage } = this.state;

    /*eslint-disable */
    const parentObj = currentPage
      .parent()
      .get("webReferences")
      .find((ref) => ref.path().includes(homepagePath));

    const path = `${parentObj ? parentObj.path() : homepagePath}`;

    return currentPage.copy().then((copiedPage) => {
      Scrivito.load(() => {
        return {
          webReferences: currentPage.get("webReferences"),
          copiedPage,
        };
      }).then(({ webReferences, copiedPage }) => {
        copiedPage.update({
          _path: `${path}/${copiedPage.id()}`,
          webReferences: [currentPage],
        });
        currentPage.update({
          webReferences: [...(webReferences || []), copiedPage],
        });
        this.setState((prevState) => ({
          newObjs: [...prevState.newObjs, copiedPage],
        }));
      });
    });
    /* eslint-enable */
  };

  render() {
    const {
      open,
      homepages,
      checked,
      success,
      newObjs,
      editObjs,
      loader,
    } = this.state;

    return (
      <InPlaceEditingPlaceholder>
        <Dialog
          open={open}
          onClose={this.closeWindow}
          PaperProps={{
            style: {
              backgroundColor: "#658b51",
            },
          }}
        >
          <div className="p-4 text-white">
            {success ? (
              <div className="row">
                <div className="col-6">
                  <h2>Neue object{newObjs.length > 1 && "s"}:</h2>
                  {newObjs.map((obj) => (
                    <Scrivito.LinkTag
                      className="p-4 text-white text-underline"
                      to={obj}
                      target="_blank"
                      key={`index-${obj.id()}`}
                    >
                      <p className="text-uppercase">
                        <span>{obj.path()}</span>
                        <i className="ml-3 fa fa-external-link text-white" />
                      </p>
                    </Scrivito.LinkTag>
                  ))}
                </div>

                <div className="col-6">
                  <h2>Edit object{editObjs.length > 1 && "s"}:</h2>
                  {editObjs.map((obj) => (
                    <Scrivito.LinkTag
                      className="p-4 text-white text-underline"
                      to={obj}
                      target="_blank"
                      key={`index-${obj.id()}`}
                    >
                      <p className="text-uppercase">
                        <span>{obj.path()}</span>
                        <i className="ml-3 fa fa-external-link text-white" />
                      </p>
                    </Scrivito.LinkTag>
                  ))}
                </div>
              </div>
            ) : (
              <React.Fragment>
                <h2>
                  Lege eine neue Version dieser Seite in einem anderen Web an.
                </h2>
                <p>In welches Web soll die neue Seite kopiert werden?</p>
                {homepages.map((homepage) => {
                  const path = homepage.path();

                  return (
                    <div key={path}>
                      <FormControlLabel
                        className="text-uppercase"
                        control={
                          <Checkbox
                            checked={checked.indexOf(path) > -1}
                            onChange={this.handleChange}
                            value={path}
                            style={{ color: "white" }}
                          />
                        }
                        label={<span className="text-white">{path}</span>}
                      />
                    </div>
                  );
                })}
              </React.Fragment>
            )}
          </div>
          <DialogActions
            style={{
              backgroundColor: "#EEEEEE",
            }}
            className="p-2 m-0"
          >
            {Boolean(!success && homepages.length) && (
              <Button
                onClick={this.handleMigration}
                disabled={!checked.length}
                style={{
                  color: "white",
                  backgroundColor: "#888",
                }}
              >
                Neue Version anlegen
              </Button>
            )}
            <Button
              onClick={this.closeWindow}
              style={{
                color: "white",
                backgroundColor: "#888",
              }}
            >
              Schließen
            </Button>
          </DialogActions>
        </Dialog>
      </InPlaceEditingPlaceholder>
    );
  }
}

export default Scrivito.connect(ContentMigrationHelper);
