import * as React from "react";
import Article = require("react-icons/lib/fa/file-code-o");
import Book = require("react-icons/lib/md/book");
import Video = require("react-icons/lib/md/ondemand-video");
import Task = require("react-icons/lib/md/playlist-add-check");

import { Page } from "../redux/pages";
import "./style/PageButton.css";

const icons = {
    articles: <Article />,
    books: <Book />,
    tasks: <Task />,
    videos: <Video />,
};

interface IProps {
    className?: string;
    onClick?: () => void;
    page: Page;
}

export default class PageButton extends React.Component<IProps> {
    public render() {
        const { className, onClick, page } = this.props;

        return (
            <div
                className={"PageButton-container" + (className ? " " + className : "")}
                onClick={onClick}
                style={onClick ? { cursor: "pointer" } : {}}
            >
                <div className="PageButton-icon">{icons[page]}</div> {page}
            </div>
        );
    }
}
