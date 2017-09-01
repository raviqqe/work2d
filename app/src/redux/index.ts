import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import { all } from "redux-saga/effects";

import * as firebase from "../lib/firebase";
import * as tasksDatabase from "../lib/tasks";
import { ITask } from "../lib/tasks";
import * as authState from "./auth-state";
import * as signIn from "./sign-in";
import * as tasks from "./tasks";

export default function() {
    const sagaMiddleware = createSagaMiddleware();
    const store = createStore(
        combineReducers({
            authState: authState.reducer,
            signIn: signIn.reducer,
            tasks: tasks.reducer,
        }),
        compose(applyMiddleware(sagaMiddleware)));

    sagaMiddleware.run(function* _() {
        yield all([...signIn.sagas, ...tasks.sagas]);
    });

    firebase.onAuthStateChanged((user) => {
        if (user === null) {
            store.dispatch(authState.actionCreators.signOut());
        } else {
            store.dispatch(authState.actionCreators.signIn());

            tasksDatabase.onDoneTasksUpdate((ts: ITask[]) =>
                store.dispatch(tasks.actionCreators.updateDoneTasks(ts)));

            tasksDatabase.onTodoTasksUpdate((ts: ITask[]) =>
                store.dispatch(tasks.actionCreators.updateTodoTasks(ts)));
        }
    });

    return store;
}
