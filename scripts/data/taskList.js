// Every task in the game

const conditionSchema = { name: "string", value: undefined };

const boolean = true;

const number = 0;

const stringArray = ["element"];

export const taskSchema = {
    id: "string",
    tab: "string",
    buttonName: "string",
    resources: [conditionSchema],
    resourcePeriod: number,
    progress: number,
    workProgress: number,
    daysToComplete: number,
    available: boolean,
    minDay: number, // Could change this to gameConditions and resources to playerConditions...
    requires: stringArray,
    completed: boolean,
    description: `string`
}

export const taskTabs = [
    "daily-life",
    "comforts",
    "science",
    "big-projects",
    "travel"
];

export const allTasks = [
    {
        id: "lmao",
        tab: taskTabs[4],
        buttonName: "Gain Stuff",
        resources: [
            { name: "health", value: 1 },
            { name: "motivation", value: 1 },
            { name: "DBH", value: -0.01 }
        ],
        resourcePeriod: 1,
        progress: 0,
        workProgress: 0,
        daysToComplete: Infinity,
        completed: false,
        available: true,
        minDay: 0,
        requires: [],
        description: `Gives ya stuff. :3`
    },
    {
        id: "rofl",
        tab: taskTabs[4],
        buttonName: "Lose Stuff",
        resources: [
            { name: "health", value: -1 },
            { name: "motivation", value: -1 },
            { name: "DBH", value: 0.01 }
        ],
        resourcePeriod: 1,
        progress: 0,
        workProgress: 0,
        daysToComplete: Infinity,
        completed: false,
        available: true,
        minDay: 0,
        requires: [],
        description: `Loses ya stuff. D:`
    },
    {
        id: "water_bucket_drainer",
        tab: taskTabs[4],
        buttonName: "Takes your water buckets",
        resources: [
            { name: "Water buckets", value: -1 },
        ],
        resourcePeriod: 1,
        progress: 0,
        workProgress: 0,
        daysToComplete: Infinity,
        completed: false,
        available: true,
        minDay: 0,
        requires: ["water_improvements"],
        description: `Stay hydrated.`
    },
    {
        id: "dalby_work_fields",
        tab: taskTabs[0],
        buttonName: "Work the fields",
        resources: [
            { name: "health", value: -1 },
            { name: "motivation", value: -1 },
            { name: "DBH", value: 0.001 }
        ],
        resourcePeriod: 7,
        progress: 0,
        workProgress: 0,
        daysToComplete: Infinity,
        completed: false,
        available: true,
        minDay: 0,
        requires: [],
        description: `The Whalley family very kindly took you in, but you have to pull your weight.<br>
        Maybe there are other ways you can help them out?`
    },
    {
        id: "examine_arrival_area",
        tab: taskTabs[1],
        buttonName: "Examine Arrival Area",
        resources: [
            { name: "DBH", value: 0.001 }
        ],
        resourcePeriod: 7,
        progress: 0,
        workProgress: 0,
        daysToComplete: 30,
        completed: false,
        available: false,
        minDay: 90,
        requires: [],
        description: `Now that you're settling in, it might be a good time to look around the place you arrived here from. Maybe something else came back with you?`
    },
    {
        id: "look_for_lichens",
        tab: taskTabs[1],
        buttonName: "Look for Lichens",
        resources: [
            { name: "health", value: -1 },
            { name: "motivation", value: -1 },
            { name: "DBH", value: 0.001 },
            { name: "Lichens", value: 1 }
        ],
        resourcePeriod: 7,
        progress: 0,
        workProgress: 0,
        daysToComplete: Infinity,
        completed: false,
        available: false,
        minDay: 0,
        requires: ["non_caustic_soap"],
        description: `To make sure the pH of your soap is right, you can find a natural pH indicator. With a bit of processing, lichens can be used and there should be some growing around here.`
    },
    {
        id: "dalby_fetch_water",
        tab: taskTabs[1],
        buttonName: "Fetch Buckets of Water",
        resources: [
            { name: "health", value: -1 },
            { name: "motivation", value: -1 },
            { name: "DBH", value: 0.001 },
            { name: "Water buckets", value: 1 }
        ],
        resourcePeriod: 7,
        progress: 0,
        workProgress: 0,
        daysToComplete: Infinity,
        completed: false,
        available: true,
        minDay: 0,
        requires: ["water_storage_improvements"],
        description: `Water's needed for a lot of things.`
    },
    {
        id: "dalby_make_soap",
        tab: taskTabs[1],
        buttonName: "Make a Bar of Soap",
        resources: [
            { name: "health", value: -1 },
            { name: "motivation", value: -1 },
            { name: "DBH", value: 0.001 },
            { name: "Lichens", value: -1 },
            { name: "Soap", value: 1 }
        ],
        resourcePeriod: 7,
        progress: 0,
        workProgress: 0,
        daysToComplete: Infinity,
        completed: false,
        available: false,
        minDay: 0,
        requires: ["non_caustic_soap"],
        description: `Better soap will keep you healthier.`
    },
    {
        id: "tab_2_test",
        tab: taskTabs[2],
        buttonName: "Tab 2 button",
        resources: [
            { name: "health", value: -1 },
            { name: "motivation", value: -1 },
            { name: "DBH", value: 0.001 }
        ],
        resourcePeriod: 7,
        progress: 0,
        workProgress: 0,
        daysToComplete: Infinity,
        completed: false,
        available: true,
        minDay: 0,
        requires: [],
        description: `Tab 2 button desc.`
    },
    {
        id: "tab_3_test",
        tab: taskTabs[3],
        buttonName: "Tab 3 button",
        resources: [
            { name: "health", value: -1 },
            { name: "motivation", value: -1 },
            { name: "DBH", value: 0.001 }
        ],
        resourcePeriod: 7,
        progress: 0,
        workProgress: 0,
        daysToComplete: Infinity,
        completed: false,
        available: true,
        minDay: 0,
        requires: [],
        description: `Tab 3 button desc.`
    }
]