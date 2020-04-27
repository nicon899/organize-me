import Task from '../../models/task';
import TaskBoard from '../../models/taskboard';

export const SET_TASKDATA = 'SET_TASKDATA';
export const ADD_TASKBOARD = 'ADD_TASKBOARD';
export const DELETE_TASKSBOARD = 'DELETE_TASKSBOARD';
export const EDIT_TASKSBOARD = 'EDIT_TASKSBOARD';
export const ADD_TASK = 'ADD_TASK';
export const DELETE_TASK = 'DELETE_TASK';
export const EDIT_TASK = 'EDIT_TASK';
export const EDIT_TASK_STATUS = "EDIT_TASK_STATUS"

const USERNAME = 'Nico';

export const fetchTaskData = () => {
    return async dispatch => {
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
                            new Task(childSnapshot.key, childSnapshot.child('name').val(), new Date(childSnapshot.child('date').val()), new Date(childSnapshot.child('deadline').val()), childSnapshot.child('status').val()),
                        )
                    });
                });
                taskboards.push(new TaskBoard(childSnapshot.key, childSnapshot.child('name').val(), tasks));
            });
        });

        dispatch({
            type: SET_TASKDATA,
            taskboards: taskboards,
        });
    }
};

export const addTaskboard = (name) => {
    return dispatch => {
        const firebase = require("firebase");
        if (!firebase.apps.length) {
            firebase.initializeApp({
                databaseURL: "https://organize-me-private.firebaseio.com/",
                projectId: "organize-me-private",
            });
        }
        firebase.database().ref(`${USERNAME}/TaskManager`).push({
            name,
        }).then((data) => {
            //success callback
            dispatch({
                type: ADD_TASKBOARD,
                id: data.key,
                name: name,
            });
        }).catch((error) => {
            //error callback
        });
    };
}

export const updateTaskboard = (id, name) => {
    return dispatch => {
        const firebase = require("firebase");
        if (!firebase.apps.length) {
            firebase.initializeApp({
                databaseURL: "https://organize-me-private.firebaseio.com/",
                projectId: "organize-me-private",
            });
        }
        firebase.database().ref(`${USERNAME}/TaskManager/${id}`).update({
            name: name,
        }).then((data) => {
            //success callback
            dispatch({
                type: EDIT_TASKSBOARD,
                id: id,
                name: name,
            });
        }).catch((error) => {
            //error callback
        });
    };
}

export const deleteTaskboard = (id) => {
    return dispatch => {
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

export const addTask = (name, date, deadline, status, taskBoardId) => {
    return dispatch => {
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
                status: status
            });
        }).catch((error) => {
            //error callback
        });
    };
}

export const editTask = (id, name, date, deadline, taskBoardId) => {
    return dispatch => {
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
        }).then((data) => {
            //success callback
            dispatch({
                type: EDIT_TASK,
                id: id,
                taskBoardId: taskBoardId,
                name: name,
                date: date,
                deadline: deadline,
            });
        }).catch((error) => {
            //error callback
        });
    };
}

export const editTaskStatus = (id, status, taskBoardId) => {
    return dispatch => {
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
    return dispatch => {
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