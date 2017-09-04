import { SagaIterator } from "redux-saga";
import { call, put } from "redux-saga/effects";
import actionCreatorFactory from "typescript-fsa";
import { reducerWithInitialState } from "typescript-fsa-reducers";

import * as tasks from "../lib/tasks";
import { doneTasks, INewTask, ITask, todoTasks } from "../lib/tasks";
import { takeEvery } from "./utils";

const factory = actionCreatorFactory();

const createTask = factory<INewTask>("CREATE_TASK");
const getDoneTasks = factory.async<void, ITask[]>("GET_DONE_TASKS");
const getTodoTasks = factory.async<void, ITask[]>("GET_TODO_TASKS");
const removeDoneTask = factory<ITask>("REMOVE_DONE_TASK");
const removeTodoTask = factory<ITask>("REMOVE_TODO_TASK");
const setCurrentTask = factory<ITask | null>("SET_CURRENT_TASK");
const setNewTask = factory<INewTask>("SET_NEW_TASK");
const setDoneTask = factory<{ newTask: ITask, oldTask: ITask }>("SET_DONE_TASK");
const setDoneTasks = factory<ITask[]>("SET_DONE_TASKS");
const setTodoTask = factory<{ newTask: ITask, oldTask: ITask }>("SET_TODO_TASK");
const setTodoTasks = factory<ITask[]>("SET_TODO_TASKS");
const startCreatingTask = factory("START_CREATING_TASK");
const stopCreatingTask = factory("STOP_CREATING_TASK");
const switchTaskState = factory<ITask>("SWITCH_TASK_STATE");

export const actionCreators = {
    createTask,
    getDoneTasks: () => getDoneTasks.started(null),
    getTodoTasks: () => getTodoTasks.started(null),
    removeDoneTask,
    removeTodoTask,
    setCurrentTask,
    setDoneTask: (oldTask: ITask, newTask: ITask) => setDoneTask({ newTask, oldTask }),
    setDoneTasks,
    setNewTask,
    setTodoTask: (oldTask: ITask, newTask: ITask) => setTodoTask({ newTask, oldTask }),
    setTodoTasks,
    startCreatingTask,
    stopCreatingTask,
    switchTaskState,
};

export interface IInitialState {
    creatingTask: boolean;
    currentTask: ITask | null;
    doneTasks: ITask[];
    newTask: INewTask;
    todoTasks: ITask[];
}

export const initialState: IInitialState = {
    creatingTask: false,
    currentTask: null,
    doneTasks: [],
    newTask: { name: "", description: "" },
    todoTasks: [],
};

export const reducer = reducerWithInitialState(initialState)
    .case(createTask, (state) =>
        ({ ...state, creatingTask: false, newTask: { name: "", description: "" } }))
    .case(getDoneTasks.done, (state, { result }) => ({ ...state, doneTasks: result }))
    .case(getTodoTasks.done, (state, { result }) => ({ ...state, todoTasks: result }))
    .case(setCurrentTask, (state, currentTask) => ({ ...state, currentTask }))
    .case(setNewTask, (state, newTask) => ({ ...state, newTask }))
    .case(startCreatingTask, (state) => ({ ...state, creatingTask: true }))
    .case(stopCreatingTask, (state) => ({ ...state, creatingTask: false }));

export const sagas = [
    takeEvery(
        createTask,
        function* _(newTask: INewTask): SagaIterator {
            const task = yield call(todoTasks.create, newTask);
            yield put(setCurrentTask(task));
        }),
    takeEvery(
        getDoneTasks.started,
        function* _(): SagaIterator {
            const tasks: ITask[] = yield call(doneTasks.getAll);
            yield put(getDoneTasks.done({ params: null, result: tasks }));
        }),
    takeEvery(
        getTodoTasks.started,
        function* _(): SagaIterator {
            const tasks: ITask[] = yield call(todoTasks.getAll);
            yield put(getTodoTasks.done({ params: null, result: tasks }));
        }),
    takeEvery(
        switchTaskState,
        function* _(task: ITask): SagaIterator {
            yield call(tasks.switchTaskState, task);
        }),
    takeEvery(
        removeDoneTask,
        function* _(task: ITask): SagaIterator {
            yield call(doneTasks.remove, task);
        }),
    takeEvery(
        removeTodoTask,
        function* _(task: ITask): SagaIterator {
            yield call(todoTasks.remove, task);
        }),
    takeEvery(
        setDoneTask,
        function* _({ newTask, oldTask }): SagaIterator {
            yield call(doneTasks.set, oldTask, newTask);
            yield put(setCurrentTask(newTask));
        }),
    takeEvery(
        setDoneTasks,
        function* _(tasks: ITask[]): SagaIterator {
            yield call(doneTasks.setAll, tasks);
        }),
    takeEvery(
        setTodoTask,
        function* _({ newTask, oldTask }): SagaIterator {
            yield call(todoTasks.set, oldTask, newTask);
            yield put(setCurrentTask(newTask));
        }),
    takeEvery(
        setTodoTasks,
        function* _(tasks: ITask[]): SagaIterator {
            yield call(todoTasks.setAll, tasks);
        }),
];
