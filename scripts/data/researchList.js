// Every research in the game

const conditionSchema = { name: "string", value: undefined };

const boolean = true;

const number = 0;

const stringArray = ["element"];

export const researchSchema = {
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

export const researchTabs = [
    "daily-life",
    "comforts",
    "science",
    "big-projects",
    "travel"
];

export const allResearches = [
    {
        id: "lmao",
        tab: researchTabs[4],
        buttonName: "Gain stuff",
        resources: [
            { name: "health", value: 1 },
            { name: "motivation", value: 1 },
            { name: "DBH", value: -0.01 }
        ],
        resourcePeriod: 1,
        progress: 0,
        workProgress: 0,
        daysToComplete: Infinity,
        available: true,
        minDay: 0,
        requires: [],
        completed: false,
        description: `Gives ya stuff. :3`
    },
    {
        id: "rofl",
        tab: researchTabs[4],
        buttonName: "Lose stuff",
        resources: [
            { name: "health", value: -1 },
            { name: "motivation", value: -1 },
            { name: "DBH", value: 0.01 }
        ],
        resourcePeriod: 1,
        progress: 0,
        workProgress: 0,
        daysToComplete: Infinity,
        available: true,
        minDay: 0,
        requires: [],
        completed: false,
        description: `Loses ya stuff. D:`
    },
    {
        id: "non_caustic_soap",
        tab: researchTabs[0],
        buttonName: "Soapmaking",
        resources: [
            { name: "health", value: -1 },
            { name: "motivation", value: -1 },
            { name: "DBH", value: 0.001 }
        ],
        resourcePeriod: 7,
        daysToComplete: 30,
        progress: 0,
        workProgress: 0,
        available: true,
        minDay: 0,
        requires: [],
        completed: false,
        description: `What's available here isn't so much <i>soap</i> as it is... ash... with a sprinkling of water.<br> 
        Do a little digging in your QuanTech&trade; neural chip and figure out how you could make soap that doesn't burn your skin.` 
    },
    {
        id: "water_storage_improvements",
        tab: researchTabs[0],
        buttonName: "Water Storage Improvements",
        resources: [
            { name: "health", value: -1 },
            { name: "motivation", value: -1 },
            { name: "DBH", value: 0.001 }
        ],
        resourcePeriod: 5,
        daysToComplete: 30,
        progress: 0,
        workProgress: 0,
        available: false,
        minDay: 0,
        requires: ["non_caustic_soap"],
        completed: false,
        description: `It's all well and good having nice soap, but what would <b>really</b> help is making it easier to keep water. Running back and forth to the well is a pain.<br>` 
    },
    {
        id: "tab_1_test",
        tab: researchTabs[1],
        buttonName: "Research tab 1 button",
        resources: [
            { name: "health", value: -1 },
            { name: "motivation", value: -1 },
            { name: "DBH", value: 0.001 }
        ],
        resourcePeriod: 1,
        daysToComplete: 30,
        progress: 0,
        workProgress: 0,
        available: true,
        minDay: 0,
        requires: [],
        completed: false,
        description: `Tab 1 test desc.`
    },
    {
        id: "inf_research_test",
        tab: researchTabs[0],
        buttonName: "Keeps researching forever",
        resources: [
            { name: "DBH", value: 0.001 }
        ],
        resourcePeriod: 1,
        daysToComplete: Infinity,
        progress: 0,
        workProgress: 0,
        available: true,
        minDay: 0,
        requires: [],
        completed: false,
        description: `Tab 1 test desc.`
    },
    {
        id: "tab_2_test",
        tab: researchTabs[2],
        buttonName: "Research tab 2 button",
        resources: [
            { name: "health", value: -1 },
            { name: "motivation", value: -1 },
            { name: "DBH", value: 0.001 }
        ],
        resourcePeriod: 7,
        daysToComplete: 30,
        progress: 0,
        workProgress: 0,
        available: true,
        minDay: 0,
        requires: [],
        completed: false,
        description: `Tab 2 test desc.`
    },
    {
        id: "tab_3_test",
        tab: researchTabs[3],
        buttonName: "Research tab 3 button",
        resources: [
            { name: "health", value: -1 },
            { name: "motivation", value: -1 },
            { name: "DBH", value: 0.001 }
        ],
        resourcePeriod: 7,
        daysToComplete: 30,
        progress: 0,
        workProgress: 0,
        available: true,
        minDay: 0,
        requires: [],
        completed: false,
        description: `Tab 3 test desc.`
    },
]