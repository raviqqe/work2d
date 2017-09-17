import * as React from "react";
import { connect } from "react-redux";

import { IVideo } from "../lib/videos";
import { actionCreators } from "../redux/videos";
import Item from "./Item";
import "./style/Video.css";

interface IProps extends IVideo {
    currentItem: IVideo | null;
    detailed: boolean;
    done: boolean;
    toggleItemState: (video: IVideo) => void;
    removeItem: (video: IVideo) => void;
    setCurrentItem: (video: IVideo | null) => void;
}

class Video extends React.Component<IProps> {
    public render() {
        const { embedUri, name, uri } = this.video;

        return (
            <Item
                {...this.props}
                details={[
                    <div key="video" className="Video-wrapper">
                        <iframe
                            id="ytplayer"
                            src={embedUri}
                            frameBorder="0"
                        />
                    </div>]}
                href={uri}
                item={this.video}
            />
        );
    }

    private get video(): IVideo {
        const { id, embedUri, name, uri } = this.props;
        return { id, embedUri, name, uri };
    }
}

export default connect(({ videos }) => videos, actionCreators)(Video);