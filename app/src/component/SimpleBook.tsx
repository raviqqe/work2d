import { extractBook, IBook } from "common/domain/book";
import * as React from "react";
import { connect } from "react-redux";

import { actionCreators } from "../redux/books";
import BookDetails from "./BookDetails";
import Button from "./Button";
import Image from "./Image";
import ItemLike from "./ItemLike";
import ItemName from "./ItemName";
import Link from "./Link";
import "./style/SimpleBook.css";

interface IProps extends IBook {
    addToTodoList: (book: IBook) => void;
}

class SimpleBook extends React.Component<IProps> {
    public render() {
        const { addToTodoList, name, url } = this.props;
        const book = extractBook(this.props);

        return (
            <ItemLike className="SimpleBook-container">
                <ItemName href={url} text={name} />
                <BookDetails detailed={false} {...book} />
                <Button onClick={() => addToTodoList(book)}>
                    Add to to-read list
                </Button>
            </ItemLike>
        );
    }
}

export default connect(null, actionCreators)(SimpleBook);
