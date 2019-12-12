import * as React from "react";
import { JJect, Category } from "../../Models";
import * as css from "./categories.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faSave } from "@fortawesome/free-solid-svg-icons";

interface Props {
  jsonData: JJect;
  showModal?: Function;
  updateJSON: Function;
}

interface State {
  categorieData: any;
  jsonData: any;
  showEditBar: boolean;
  selectedCategory: number;
  newCategoryObject: Category;
  update: any;
}

export default class CategorieList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      categorieData: null,
      jsonData: null,
      showEditBar: false,
      selectedCategory: NaN,
      newCategoryObject: { id: 0, name: "" },
      update: null
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.saveNewName = this.saveNewName.bind(this);
  }

  componentDidMount() {
    this.setState({
      categorieData: this.props.jsonData.categories,
      jsonData: this.props.jsonData
    });
  }

  toggleModal(id: number) {
    if (isNaN(id)) {
      id = this.state.categorieData.length;
    }
    this.setState({
      showEditBar: !this.state.showEditBar,
      selectedCategory: id
    });
  }

  onChange(e: any) {
    this.setState({
      newCategoryObject: {
        id: this.state.selectedCategory,
        name: e.target.value
      }
    });
  }

  saveNewName() {
    const {
      newCategoryObject,
      selectedCategory,
      jsonData,
      categorieData
    } = this.state;
    categorieData[selectedCategory] = newCategoryObject;
    let obj: JJect = {
      songs: jsonData.songs,
      playlist: jsonData.playlist,
      categories: categorieData
    };
    this.props.updateJSON && this.props.updateJSON("", obj);
    this.setState({ showEditBar: false });
  }

  render() {
    const { categorieData, showEditBar } = this.state;

    return (
      <div>
        <ul>
          <div className={css.nameChangeBar}>
            <button onClick={() => this.toggleModal(NaN)}>
              Add new category
            </button>
            {!showEditBar ? (
              categorieData &&
              categorieData.length > 0 &&
              categorieData.map((category: Category) => {
                {
                  return (
                    <li>
                      {category.name}
                      <div className={css.editIcon}>
                        <FontAwesomeIcon
                          onClick={() => this.toggleModal(category.id)}
                          className={css.icons}
                          icon={faPen}
                        ></FontAwesomeIcon>
                      </div>
                    </li>
                  );
                }
              })
            ) : (
              <div className={css.nameChangeBar}>
                <li>
                  <input
                    onChange={e => this.onChange(e)}
                    placeholder="Change category name"
                    type="text"
                  />
                  <FontAwesomeIcon
                    onClick={this.saveNewName}
                    className={css.icons}
                    icon={faSave}
                  />
                </li>
              </div>
            )}
          </div>
        </ul>
      </div>
    );
  }
}
