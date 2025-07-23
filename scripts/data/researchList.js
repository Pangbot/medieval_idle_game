// Every research in the game

export const researchTabs = [
    "daily life",
    "comforts",
    "science",
    "big projects",
    "travel"
];

export const allResearches = [
    {
        id: "non_caustic_soap",
        tab: researchTabs[0],
        buttonName: "Research Soapmaking",
        resources: [
            { name: "health", amount: -1 },
            { name: "motivation", amount: -1 },
            { name: "DBH", amount: 0.001 }
        ],
        resourcePeriod: 7,
        daysToComplete: 30,
        progress: 0,
        workProgress: 0,
        available: true,
        requires: null,
        completed: false,
        description: `What's available here isn't so much <i>soap</i> as it is... ash... with a sprinkling of water.<br> 
        Do a little digging in your QuanTech&trade; neural chip and figure out how you could make soap that doesn't burn your skin.<br>
        Unlocks the 'Make Soap' task and 'Water Improvements' research.` 
    },
    {
        id: "water_improvements",
        tab: researchTabs[0],
        buttonName: "Research Water Improvements",
        resources: [
            { name: "health", amount: -1 },
            { name: "motivation", amount: -1 },
            { name: "DBH", amount: 0.001 }
        ],
        resourcePeriod: 5,
        daysToComplete: 30,
        progress: 0,
        workProgress: 0,
        available: false,
        requires: ["non_caustic_soap"],
        completed: false,
        description: `It's all well and good having nice soap, but what would <i>really</i> help is making it easier to get water. Running back and forth to the well is a pain.<br>
        Unlocks the 'Make Water Pipe' task and 'Water Purification' research.` 
    },
    {
        id: "tab_1_test",
        tab: researchTabs[1],
        buttonName: "Research tab 1 button",
        resources: [
            { name: "health", amount: -1 },
            { name: "motivation", amount: -1 },
            { name: "DBH", amount: 0.001 }
        ],
        resourcePeriod: 1,
        daysToComplete: 30,
        progress: 0,
        workProgress: 0,
        available: true,
        requires: null,
        completed: false,
        description: `Tab 1 test desc.`
    },
    {
        id: "inf_research_test",
        tab: researchTabs[0],
        buttonName: "Keeps researching forever",
        resources: [
            { name: "DBH", amount: 0.001 }
        ],
        resourcePeriod: 1,
        daysToComplete: Infinity,
        progress: 0,
        workProgress: 0,
        available: true,
        requires: null,
        completed: false,
        description: `Tab 1 test desc.`
    },
    {
        id: "tab_2_test",
        tab: researchTabs[2],
        buttonName: "Research tab 2 button",
        resources: [
            { name: "health", amount: -1 },
            { name: "motivation", amount: -1 },
            { name: "DBH", amount: 0.001 }
        ],
        resourcePeriod: 7,
        daysToComplete: 30,
        progress: 0,
        workProgress: 0,
        available: true,
        requires: null,
        completed: false,
        description: `Tab 2 test desc.`
    },
    {
        id: "tab_3_test",
        tab: researchTabs[3],
        buttonName: "Research tab 3 button",
        resources: [
            { name: "health", amount: -1 },
            { name: "motivation", amount: -1 },
            { name: "DBH", amount: 0.001 }
        ],
        resourcePeriod: 7,
        daysToComplete: 30,
        progress: 0,
        workProgress: 0,
        available: true,
        requires: null,
        completed: false,
        description: `Tab 3 test desc.`
    },
]