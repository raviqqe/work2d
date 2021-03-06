import { ITask } from "common/domain/task";
import * as _ from "lodash";
import * as React from "react";
import { connect } from "react-redux";

import Task from "../component/Task";
import TasksMenu from "../component/TasksMenu";
import { actionCreators as settingsActionCreators } from "../redux/settings";
import { actionCreators as tasksActionCreators } from "../redux/tasks";
import Items from "./Items";
import Timer from "./Timer";

interface IProps {
    currentTag: string | null;
    currentItem: ITask | null;
    doneItems: ITask[];
    notificationOn: boolean | null;
    requestNotificationPermission: () => void;
    setCurrentItem: (task: ITask) => void;
    setItems: (items: ITask[], done: boolean) => void;
    timerOn: boolean;
    todoItems: ITask[];
}

class Tasks extends React.Component<IProps> {
    public render() {
        const { currentTag, doneItems, todoItems, timerOn } = this.props;

        if (timerOn) {
            return <Timer />;
        }

        return (
            <Items
                fixed={currentTag !== null}
                itemComponent={Task}
                menuComponent={TasksMenu}
                {...this.props}
                doneItems={this.getItemsByTag(doneItems)}
                todoItems={this.getItemsByTag(todoItems)}
            />
        );
    }

    public componentDidMount() {
        if (this.props.notificationOn === null) {
            this.props.requestNotificationPermission();
        }
    }

    private getItemsByTag = (items: ITask[]): ITask[] => {
        const { currentTag } = this.props;

        switch (currentTag) {
            case null:
                return items;
            case "":
                return _.filter(items, ({ tags }) => tags.length === 0);
        }

        return _.filter(items, ({ tags }) => tags.includes(currentTag));
    }
}

export default connect(
    ({ settings, tasks, timer }) => ({ ...settings, ...tasks, timerOn: timer.on }),
    { ...settingsActionCreators, ...tasksActionCreators },
)(Tasks);
