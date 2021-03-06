import {
    SET_TASKDATA,
    ADD_TASKBOARD,
    DELETE_TASKSBOARD,
    EDIT_TASKSBOARD,
    ADD_TASK,
    DELETE_TASK,
    EDIT_TASK,
    EDIT_TASK_STATUS,
    DELETE_TASKSBOARD_TASKS
} from '../actions/tasks';
import Task from '../../models/task';
import TaskBoard from '../../models/taskboard';

const initialState = {
    taskboards: [],
};

export default (state = initialState, action) => {
    const updatedTaskboards = [...state.taskboards];
    switch (action.type) {
        case SET_TASKDATA:
            return {
                ...state,
                taskboards: action.taskboards,
            };
        case ADD_TASKBOARD:
            updatedTaskboards.push(new TaskBoard(
                action.id,
                action.name,
                [],
                action.color,
                action.link,
            ));
            return {
                ...state,
                taskboards: updatedTaskboards
            };
        case DELETE_TASKSBOARD:
            return {
                ...state,
                taskboards: [...state.taskboards].filter((tboard) => tboard.id != action.id)
            };
        case DELETE_TASKSBOARD_TASKS:
            const taskboardIndexDeleteTasks = updatedTaskboards.findIndex((tboard) => tboard.id === action.id);
            updatedTaskboards[taskboardIndexDeleteTasks].tasks = [];
            return {
                ...state,
                taskboards: taskboards
            }
        case EDIT_TASKSBOARD:
            const taskboardIndex = updatedTaskboards.findIndex((tboard) => tboard.id === action.id);
            updatedTaskboards[taskboardIndex].name = action.name;
            updatedTaskboards[taskboardIndex].link = action.link;
            updatedTaskboards[taskboardIndex].color = action.color;
            return {
                ...state,
                taskboards: taskboards
            };
        case ADD_TASK: {
            const taskboardIndexAddTask = updatedTaskboards.findIndex((tboard) => tboard.id === action.taskBoardId);
            updatedTaskboards[taskboardIndexAddTask].tasks.push(new Task(action.id, action.name, action.date, action.deadline, action.duration, action.status));
            return {
                ...state,
                taskboards: updatedTaskboards
            };
        }
        case EDIT_TASK: {
            const taskboardIndexEditTask = updatedTaskboards.findIndex((tboard) => tboard.id === action.taskBoardId);
            const taskIndex = updatedTaskboards[taskboardIndexEditTask].tasks.findIndex((task) => task.id === action.id);
            updatedTaskboards[taskboardIndexEditTask].tasks[taskIndex].name = action.name;
            updatedTaskboards[taskboardIndexEditTask].tasks[taskIndex].date = action.date;
            updatedTaskboards[taskboardIndexEditTask].tasks[taskIndex].deadline = action.deadline;
            updatedTaskboards[taskboardIndexEditTask].tasks[taskIndex].duration = action.duration;
            return {
                ...state,
                taskboards: updatedTaskboards
            };
        }
        case EDIT_TASK_STATUS: {
            const taskboardIndexEditTaskStatus = updatedTaskboards.findIndex((tboard) => tboard.id === action.taskBoardId);
            const taskIndex = updatedTaskboards[taskboardIndexEditTaskStatus].tasks.findIndex((task) => task.id === action.id);
            updatedTaskboards[taskboardIndexEditTaskStatus].tasks[taskIndex].status = action.status;
            return {
                ...state,
                taskboards: updatedTaskboards
            };
        }
        case DELETE_TASK: {
            const taskboardIndexTaskDelete = updatedTaskboards.findIndex((tboard) => tboard.id === action.taskBoardId);
            updatedTaskboards[taskboardIndexTaskDelete].tasks = updatedTaskboards[taskboardIndexTaskDelete].tasks.filter((task) => task.id != action.id);
            return {
                ...state,
                taskboards: updatedTaskboards
            };
        }
    }
    return state;
};
