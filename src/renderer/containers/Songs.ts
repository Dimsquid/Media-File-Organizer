import Songs from "../Page/Songs/Songs";
import { mediaReceived, receiveMedia } from "../Page/Songs/Actions";
import { connect } from "react-redux";

const mapStateToProps = (state: any) => {
  return {
    songs: mediaReceived(state).payload.globals
  };
};
const mapDispatchToProps = {
  receiveMedia
};
export default connect(mapStateToProps, mapDispatchToProps)(Songs);
