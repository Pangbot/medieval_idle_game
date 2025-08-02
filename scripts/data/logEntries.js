// Lists the possible log entries that can occur

const conditionSchema = { name: "string", value: undefined };

export const logSchema = {
    id: "string",
    theme: "string",
    playerConditions: [conditionSchema],
    gameConditions: [conditionSchema],
    text: `string`
}

const logThemes = [
    "PC Related", // e.g. The player's character travels somewhere, or gains renown
    "Regular Time Event", // e.g. Annual market, historical events, natural events
    "Abnormal Time Event", // e.g. A technology is invented earlier, the lifespan of someone famous is altered, crazier stuff at high DBH (UFO appears/small portals open...)
];

export const logEntries = [
    {
        id: "log_1",
        theme: logThemes[0],
        playerConditions: [
            { name: "age", value: "young"},
        ],
        gameConditions: [
            { name: "day", value: 5 },
        ],
        text: `A new visitor is the buzz of the village.`
    }
]