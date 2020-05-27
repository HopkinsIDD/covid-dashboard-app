// Once this file becomes too big, start splitting the models into different files

interface Scenario {
    id: Number,
    key: any, // FIXME
    name: any, // FIXME
    checked: Boolean,
    disabled: Boolean,
}

interface Stat {
    id: Number,
    key: String,
    name: String
}

interface Severity {
    id: Number,
    key: String,
    name: String
}
