import Task from '../../models/task';
import TaskBoard from '../../models/taskboard';
import * as SecureStore from 'expo-secure-store';

export const SET_TASKDATA = 'SET_TASKDATA';
export const ADD_TASKBOARD = 'ADD_TASKBOARD';
export const DELETE_TASKSBOARD = 'DELETE_TASKSBOARD';
export const DELETE_TASKSBOARD_TASKS = 'DELETE_TASKSBOARD_TASKS';
export const EDIT_TASKSBOARD = 'EDIT_TASKSBOARD';
export const ADD_TASK = 'ADD_TASK';
export const DELETE_TASK = 'DELETE_TASK';
export const EDIT_TASK = 'EDIT_TASK';
export const EDIT_TASK_STATUS = "EDIT_TASK_STATUS"

export const fetchTaskData = () => {
    return async dispatch => {
        const USERNAME = await SecureStore.getItemAsync('USERNAME');

        const firebase = require("firebase");
        if (!firebase.apps.length) {
            firebase.initializeApp({
                databaseURL: "https://organize-me-private.firebaseio.com/",
                projectId: "organize-me-private",
            });
        }

        const taskboards = [];
        firebase.database().ref(`${USERNAME}/TaskManager`).once('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                const tasks = [];
                firebase.database().ref(`${USERNAME}/TaskManager/${childSnapshot.key}/Tasks`).once('value', function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        tasks.push(
                            new Task(childSnapshot.key, childSnapshot.child('name').val(), new Date(childSnapshot.child('date').val()), new Date(childSnapshot.child('deadline').val()), childSnapshot.child('duration').val(), childSnapshot.child('status').val()),
                        )
                    });
                });
                taskboards.push(new TaskBoard(childSnapshot.key, childSnapshot.child('name').val(), tasks, childSnapshot.child('color').val(), childSnapshot.child('link').val()));
            });
        });

        dispatch({
            type: SET_TASKDATA,
            taskboards: taskboards,
        });
    }
};

export const addTaskboard = (name, color, link) => {
    return async dispatch => {
        const USERNAME = await SecureStore.getItemAsync('USERNAME');

        const firebase = require("firebase");
        if (!firebase.apps.length) {
            firebase.initializeApp({
                databaseURL: "https://organize-me-private.firebaseio.com/",
                projectId: "organize-me-private",
            });
        }
        firebase.database().ref(`${USERNAME}/TaskManager`).push({
            name,
            color,
            link
        }).then((data) => {
            //success callback
            dispatch({
                type: ADD_TASKBOARD,
                id: data.key,
                name: name,
                color: color,
                link: link
            });
        }).catch((error) => {
            //error callback
        });
    };
}

export const updateTaskboard = (id, name, color, link) => {
    return async dispatch => {
        const USERNAME = await SecureStore.getItemAsync('USERNAME');

        const firebase = require("firebase");
        if (!firebase.apps.length) {
            firebase.initializeApp({
                databaseURL: "https://organize-me-private.firebaseio.com/",
                projectId: "organize-me-private",
            });
        }
        firebase.database().ref(`${USERNAME}/TaskManager/${id}`).update({
            name: name,
            color: color,
            link: link
        }).then((data) => {
            //success callback
            dispatch({
                type: EDIT_TASKSBOARD,
                id: id,
                name: name,
                color: color,
                link: link
            });
        }).catch((error) => {
            //error callback
        });
    };
}

export const deleteTaskboard = (id) => {
    return async dispatch => {
        const USERNAME = await SecureStore.getItemAsync('USERNAME');

        const firebase = require("firebase");
        if (!firebase.apps.length) {
            firebase.initializeApp({
                databaseURL: "https://organize-me-private.firebaseio.com/",
                projectId: "organize-me-private",
            });
        }
        firebase.database().ref(`${USERNAME}/TaskManager/${id}`).remove().then((data) => {
            //success callback
            dispatch({
                type: DELETE_TASKSBOARD,
                id: id,
            });
        }).catch((error) => {
            //error callback
        });
    };
}

export const deleteTaskboardTasks = (id) => {
    return async dispatch => {
        const USERNAME = await SecureStore.getItemAsync('USERNAME');

        const firebase = require("firebase");
        if (!firebase.apps.length) {
            firebase.initializeApp({
                databaseURL: "https://organize-me-private.firebaseio.com/",
                projectId: "organize-me-private",
            });
        }
        firebase.database().ref(`${USERNAME}/TaskManager/${id}/Tasks`).remove().then((data) => {
            //success callback
            dispatch({
                type: DELETE_TASKSBOARD_TASKS,
                id: id,
            });
        }).catch((error) => {
            //error callback
        });
    };
}

export const addTask = (name, date, deadline, duration, status, taskBoardId) => {
    return async dispatch => {
        const USERNAME = await SecureStore.getItemAsync('USERNAME');

        const firebase = require("firebase");
        if (!firebase.apps.length) {
            firebase.initializeApp({
                databaseURL: "https://organize-me-private.firebaseio.com/",
                projectId: "organize-me-private",
            });
        }
        firebase.database().ref(`${USERNAME}/TaskManager/${taskBoardId}/Tasks`).push({
            name,
            date: date.toString(),
            deadline: deadline.toString(),
            duration: duration,
            status
        }).then((data) => {
            //success callback
            dispatch({
                type: ADD_TASK,
                id: data.key,
                taskBoardId: taskBoardId,
                name: name,
                date: date,
                deadline: deadline,
                duration: duration,
                status: status
            });
        }).catch((error) => {
            //error callback
        });
    };
}

export const editTask = (id, name, date, deadline, duration, taskBoardId) => {
    return async dispatch => {
        const USERNAME = await SecureStore.getItemAsync('USERNAME');

        const firebase = require("firebase");
        if (!firebase.apps.length) {
            firebase.initializeApp({
                databaseURL: "https://organize-me-private.firebaseio.com/",
                projectId: "organize-me-private",
            });
        }
        firebase.database().ref(`${USERNAME}/TaskManager/${taskBoardId}/Tasks/${id}`).update({
            name,
            date: date.toString(),
            deadline: deadline.toString(),
            duration: duration,
        }).then((data) => {
            //success callback
            dispatch({
                type: EDIT_TASK,
                id: id,
                taskBoardId: taskBoardId,
                name: name,
                date: date,
                deadline: deadline,
                duration: duration,
            });
        }).catch((error) => {
            //error callback
        });
    };
}

export const editTaskStatus = (id, status, taskBoardId) => {
    return async dispatch => {
        const USERNAME = await SecureStore.getItemAsync('USERNAME');

        const firebase = require("firebase");
        if (!firebase.apps.length) {
            firebase.initializeApp({
                databaseURL: "https://organize-me-private.firebaseio.com/",
                projectId: "organize-me-private",
            });
        }
        firebase.database().ref(`${USERNAME}/TaskManager/${taskBoardId}/Tasks/${id}`).update({
            status
        }).then((data) => {
            //success callback
            dispatch({
                type: EDIT_TASK_STATUS,
                id: id,
                taskBoardId: taskBoardId,
                status: status,
            });
        }).catch((error) => {
            //error callback
        });
    };
}

export const deleteTask = (id, taskBoardId) => {
    return async dispatch => {
        const USERNAME = await SecureStore.getItemAsync('USERNAME');

        const firebase = require("firebase");
        if (!firebase.apps.length) {
            firebase.initializeApp({
                databaseURL: "https://organize-me-private.firebaseio.com/",
                projectId: "organize-me-private",
            });
        }
        firebase.database().ref(`${USERNAME}/TaskManager/${taskBoardId}/Tasks/${id}`).remove().then((data) => {
            //success callback
            dispatch({
                type: DELETE_TASK,
                id: id,
                taskBoardId: taskBoardId
            });
        }).catch((error) => {
            //error callback
        });
    };
}