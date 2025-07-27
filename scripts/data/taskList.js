// Every task in the game

export const taskTabs = [
    "daily-life",
    "comforts",
    "science",
    "big-projects",
    "travel"
];

export const allTasks = [
    {
        id: "dalby_work_fields",
        tab: taskTabs[0],
        buttonName: "Work the fields",
        resources: [
            { name: "health", amount: -1 },
            { name: "motivation", amount: -1 },
            { name: "DBH", amount: 0.001 }
        ],
        resourcePeriod: 7,
        progress: 0,
        workProgress: 0,
        daysToComplete: Infinity,
        available: true,
        requires: null,
        description: `The Whalley family very kindly took you in, but you have to pull your weight.<br>
        Maybe there are other ways you can help them out?`
    },
    {
        id: "examine_arrival_area",
        tab: taskTabs[1],
        buttonName: "Examine Arrival Area",
        resources: [
            { name: "DBH", amount: 0.001 }
        ],
        resourcePeriod: 7,
        progress: 0,
        workProgress: 0,
        daysToComplete: 30,
        available: true,
        requires: null,
        description: `Now that you're settling in, it might be a good time to look around the place you arrived here from. Maybe something else came back with you?`
    },
    {
        id: "look_for_lichens",
        tab: taskTabs[1],
        buttonName: "Look for Lichens",
        resources: [
            { name: "health", amount: -1 },
            { name: "motivation", amount: -1 },
            { name: "DBH", amount: 0.001 },
            { name: "Lichens", amount: 1 }
        ],
        resourcePeriod: 7,
        progress: 0,
        workProgress: 0,
        daysToComplete: Infinity,
        available: false,
        requires: ["non_caustic_soap"],
        description: `To make sure the pH of your soap is right, you can find a natural pH indicator. With a bit of processing, lichens can be used and there should be some growing around here.`
    },
    {
        id: "dalby_fetch_water",
        tab: taskTabs[1],
        buttonName: "Fetch Buckets of Water",
        resources: [
            { name: "health", amount: -1 },
            { name: "motivation", amount: -1 },
            { name: "DBH", amount: 0.001 },
            { name: "Water buckets", amount: 1 }
        ],
        resourcePeriod: 7,
        progress: 0,
        workProgress: 0,
        daysToComplete: Infinity,
        available: true,
        requires: ["water_improvements"],
        description: `Water's needed for a lot of things.`
    },
    {
        id: "dalby_make_soap",
        tab: taskTabs[1],
        buttonName: "Make a Bar of Soap",
        resources: [
            { name: "health", amount: -1 },
            { name: "motivation", amount: -1 },
            { name: "DBH", amount: 0.001 },
            { name: "Lichens", amount: -1 },
            { name: "Soap", amount: 1 }
        ],
        resourcePeriod: 7,
        progress: 0,
        workProgress: 0,
        daysToComplete: Infinity,
        available: false,
        requires: ["non_caustic_soap"],
        description: `Better soap will keep you healthier.`
    },
    {
        id: "tab_2_test",
        tab: taskTabs[2],
        buttonName: "Tab 2 button",
        resources: [
            { name: "health", amount: -1 },
            { name: "motivation", amount: -1 },
            { name: "DBH", amount: 0.001 }
        ],
        resourcePeriod: 7,
        progress: 0,
        workProgress: 0,
        daysToComplete: Infinity,
        available: true,
        requires: null,
        description: `Tab 2 button desc.`
    },
    {
        id: "tab_3_test",
        tab: taskTabs[3],
        buttonName: "Tab 3 button",
        resources: [
            { name: "health", amount: -1 },
            { name: "motivation", amount: -1 },
            { name: "DBH", amount: 0.001 }
        ],
        resourcePeriod: 7,
        progress: 0,
        workProgress: 0,
        daysToComplete: Infinity,
        available: true,
        requires: null,
        description: `Tab 3 button desc.`
    }
]