import * as React from "react";

export default class extends React.Component {
    public render() {
        // Load Twitter's widget.js in index.html.

        return (
            <a
                href="https://twitter.com/share?ref_src=twsrc%5Etfw"
                className="twitter-share-button"
                data-show-count="false"
                data-size="large"
            >
                Tweet
            </a>
        );
    }

    public componentWillMount() {
        const script = document.createElement("script");

        script.src = "https://platform.twitter.com/widgets.js";
        script.async = true;

        document.body.appendChild(script);
    }
}
