import * as React from "react";
import { Plus } from "react-feather";
import { connect } from "react-redux";

import { INewTask } from "../lib/task";
import { actionCreators } from "../redux/tasks";
import "./style/CreateTask.css";

interface IProps {
    createTask: (task: INewTask) => void;
}

interface IState {
    creatingTask: boolean;
    task: INewTask;
}

class CreateTask extends React.Component<IProps, IState> {
    public state: IState = {
        creatingTask: false,
        task: { name: "", description: "" },
    };

    private name: { focus: () => void };

    public componentDidUpdate(_, { creatingTask }: IState) {
        if (!creatingTask && this.state.creatingTask) {
            this.name.focus(); // Do this after rendering.
        }
    }

    public render() {
        if (!this.state.creatingTask) {
            return (
                <div
                    className="CreateTask-button-container"
                    onClick={() => this.setState({ creatingTask: true })}
                >
                    <Plus />
                </div>
            );
        }

        return (
            <form
                className="CreateTask-form-container"
                onSubmit={() => {
                    this.props.createTask(this.state.task);
                    this.setState({
                        creatingTask: false,
                        task: { name: "", description: "" },
                    });
                }}
            >
                <input
                    className="Task-name-input"
                    ref={(name) => { this.name = name; }}
                    placeholder="Name"
                    type="text"
                    value={this.state.task.name}
                    onChange={({ target: { value } }) =>
                        this.setState({ task: { ...this.state.task, name: value } })}
                />
                <input
                    placeholder="Description"
                    type="text"
                    value={this.state.task.description}
                    onChange={({ target: { value } }) =>
                        this.setState({ task: { ...this.state.task, description: value } })}
                />
                <div className="CreateTask-buttons">
                    <input className="CreateTask-button" type="submit" value="Create" />
                    <button
                        className="CreateTask-button"
                        onClick={() => this.setState({ creatingTask: false })}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        );
    }
}

export default connect(({ tasks }) => tasks, actionCreators)(CreateTask);
