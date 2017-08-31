import * as _ from "lodash";
import * as React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import CreateTask from "../component/CreateTask";
import DoneTasks from "../component/DoneTasks";
import Task from "../component/Task";
import TodoTasks from "../component/TodoTasks";
import { ITask } from "../lib/task";
import { actionCreators } from "../redux/tasks";
import "./style/Home.css";

interface IProps {
    currentTask: ITask | null;
    setCurrentTask: (task: ITask | null) => void;
    signedIn: boolean;
    doneTasks: ITask[];
    todoTasks: ITask[];
}

interface IState {
    showDoneTasks: boolean;
}

class Home extends React.Component<IProps, IState> {
    public state: IState = { showDoneTasks: false };

    public render() {
        if (!this.props.signedIn) {
            return <Redirect to="/sign-in" />;
        }

        const { showDoneTasks } = this.state;
        const Tasks = showDoneTasks ? DoneTasks : TodoTasks;

        return (
            <div className="Home-container">
                <div className="Home-buttons">
                    <button
                        className="Home-button"
                        onClick={() => this.setState({ showDoneTasks: false })}
                        disabled={!showDoneTasks}
                    >
                        todo
                    </button>
                    <button
                        className="Home-button"
                        onClick={() => this.setState({ showDoneTasks: true })}
                        disabled={showDoneTasks}
                    >
                        done
                    </button>
                </div>
                <div className="Home-main">
                    <div className="Home-tasks">
                        <Tasks />
                    </div>
                    <div className="Home-sidebar">
                        <div className="Home-current-task">
                            {this.props.currentTask &&
                                <Task
                                    {...{
                                        detailed: true,
                                        done: this.state.showDoneTasks,
                                        ...this.props.currentTask,
                                    }}
                                />}
                            {!this.state.showDoneTasks && <CreateTask />}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    public componentDidUpdate() {
        const tasks = this.state.showDoneTasks ? this.props.doneTasks : this.props.todoTasks;

        if (!this.props.currentTask || _.findIndex(tasks, this.props.currentTask) < 0) {
            this.props.setCurrentTask(tasks[0] || null);
        }
    }
}

export default connect(
    ({ authState, tasks }) => ({ ...authState, ...tasks }),
    actionCreators,
)(Home);
