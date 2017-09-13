import * as _ from "lodash";

import createStore from "..";
import * as lib from "../../lib/tasks";
import { sleep } from "../../lib/utils";
import { actionCreators, IState } from "../tasks";

jest.mock("../../lib/tasks");

function getState(store): IState {
    return store.getState().tasks;
}

beforeEach(() => {
    lib.resetMocks();
});

it("creates a new task", async () => {
    expect.assertions(3 * 3);

    const store = createStore();

    const check = (creatingTask: boolean, name: string, description: string) => {
        const state = getState(store);

        expect(state.creatingTask).toBe(creatingTask);
        expect(state.newTask.name).toBe(name);
        expect(state.newTask.description).toBe(description);
    };

    store.dispatch(actionCreators.startCreatingTask());
    await sleep(100);

    check(true, "", "");

    store.dispatch(actionCreators.setNewTask({ name: "foo", description: "bar", tags: [] }));
    await sleep(100);

    check(true, "foo", "bar");

    store.dispatch(actionCreators.createTask());
    await sleep(100);

    check(false, "", "");
});

it("cancels creating a new task", async () => {
    expect.assertions(3);

    const store = createStore();

    expect(getState(store).creatingTask).toBe(false);

    store.dispatch(actionCreators.startCreatingTask());
    await sleep(100);

    expect(getState(store).creatingTask).toBe(true);

    store.dispatch(actionCreators.stopCreatingTask());
    await sleep(100);

    expect(getState(store).creatingTask).toBe(false);
});

for (const done of [false, true]) {
    it(`removes a ${done ? "done" : "todo"} task`, async () => {
        expect.assertions(4);

        const store = createStore();

        const tasksState = () => getState(store).tasks;
        const dispatch = async (action, length: number) => {
            store.dispatch(action);
            await sleep(100);
            expect(tasksState().length).toBe(length);
        };

        expect(tasksState().length).toBe(0);

        await dispatch(done ? actionCreators.toggleTasksState() : actionCreators.getTasks(), 1);
        await dispatch(actionCreators.removeTask(tasksState()[0]), 0);
        await dispatch(actionCreators.getTasks(), 0);
    });
}

it("toggles a task's state", async () => {
    expect.assertions(4);

    const store = createStore();
    const dispatch = async (action, length: number) => {
        store.dispatch(action);
        await sleep(100);
        expect(getState(store).tasks.length).toBe(length);
    };

    await dispatch(actionCreators.getTasks(), 1);

    const { tasks: [{ updatedAt }] } = getState(store);

    await dispatch(actionCreators.toggleTaskState(getState(store).currentTask), 0);
    await dispatch(actionCreators.toggleTasksState(), 2);

    const { tasks: [task] } = getState(store);

    expect(task.updatedAt).not.toBe(updatedAt);
});

it("updates a current task", async () => {
    expect.assertions(4);

    const store = createStore();

    const dispatch = async (action) => {
        store.dispatch(action);
        await sleep(100);
    };

    expect(getState(store).currentTask).toBe(null);

    await dispatch(actionCreators.getTasks());
    await dispatch(actionCreators.updateCurrentTask({
        ...(getState(store).currentTask),
        name: "foo bar baz",
    }));

    expect(getState(store).currentTask.name).toBe("foo bar baz");

    const updatedAt = getState(store).currentTask.updatedAt;

    await dispatch(actionCreators.updateCurrentTask({
        ...(getState(store).currentTask),
        name: "FOO BAR BAZ",
    }));

    const { currentTask } = getState(store);

    expect(currentTask.name).toBe("FOO BAR BAZ");
    expect(currentTask.updatedAt).not.toBe(updatedAt);
});

it("sets a current tag", async () => {
    expect.assertions(2);

    const store = createStore();

    const dispatch = async (action) => {
        store.dispatch(action);
        await sleep(100);
    };

    expect(getState(store).currentTag).toBe(null);

    await dispatch(actionCreators.setCurrentTag("foo"));

    expect(getState(store).currentTag).toBe("foo");
});
