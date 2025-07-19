// Every task in the game

export const taskTabs = [
    "daily life",
    "science",
    "big projects",
    "travel"
];

export const allTasks = [
    {
        id: "dalby_work_fields",
        tab: taskTabs[0],
        buttonName: "Work the fields",
        money: 0,
        health: -1,
        motivation: -1,
        DBH: 0.001,
        resourcePeriod: 7,
        available: true,
        description: `The Whalley family very kindly took you in, but you have to pull your weight.<br>
        Maybe there are other ways you can help them out?`
    },
    {
        id: "tab_1_test",
        tab: taskTabs[1],
        buttonName: "Tab 1 button",
        money: 0,
        health: -1,
        motivation: -1,
        DBH: 0.001,
        resourcePeriod: 7,
        available: true,
        description: `Tab 1 button desc.`
    },
    {
        id: "tab_2_test",
        tab: taskTabs[2],
        buttonName: "Tab 2 button",
        money: 0,
        health: -1,
        motivation: -1,
        DBH: 0.001,
        resourcePeriod: 7,
        available: true,
        description: `Tab 2 button desc.`
    },
    {
        id: "tab_3_test",
        tab: taskTabs[3],
        buttonName: "Tab 3 button",
        money: 0,
        health: -1,
        motivation: -1,
        DBH: 0.001,
        resourcePeriod: 7,
        available: true,
        description: `Tab 3 button desc.`
    }
]