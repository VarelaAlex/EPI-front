export const CATEGORIES = {
	BODY_AND_FOOD: "BODY&FOOD", FAMILY: "FAMILY", TRANSPORTS: "TRANSPORTS", ANIMALS: "ANIMALS", SEASONS: "SEASONS"
};

export const REPRESENTATION = {
	ICONIC: "ICONIC", MIXED: "MIXED", SYMBOLIC: "SYMBOLIC"
};

export const NETWORK_TYPE = {
    I: "I-I", II: "I-II", III: "I-III",
}

export const EXERCISE_RULES = {
    I1: {
        networks: [NETWORK_TYPE.I],
        representations: [REPRESENTATION.ICONIC]
    },
    I2: {
        networks: [NETWORK_TYPE.I, NETWORK_TYPE.II],
        representations: [REPRESENTATION.ICONIC]
    },
    I3: {
        networks: [NETWORK_TYPE.I, NETWORK_TYPE.II, NETWORK_TYPE.III],
        representations: [REPRESENTATION.ICONIC]
    },
    M1: {
        conditions: [
            {
                networks: [NETWORK_TYPE.I, NETWORK_TYPE.II, NETWORK_TYPE.III],
                representations: [REPRESENTATION.ICONIC]
            },
            {
                networks: [NETWORK_TYPE.I],
                representations: [REPRESENTATION.MIXED]
            }
        ]
    },
    M2: {
        conditions: [
            {
                networks: [NETWORK_TYPE.I, NETWORK_TYPE.II, NETWORK_TYPE.III],
                representations: [REPRESENTATION.ICONIC]
            },
            {
                networks: [NETWORK_TYPE.I, NETWORK_TYPE.II],
                representations: [REPRESENTATION.ICONIC, REPRESENTATION.MIXED]
            }
        ]
    },
    M3: {
        conditions: [
            {
                networks: [NETWORK_TYPE.I, NETWORK_TYPE.II, NETWORK_TYPE.III],
                representations: [REPRESENTATION.ICONIC]
            },
            {
                networks: [NETWORK_TYPE.I, NETWORK_TYPE.II, NETWORK_TYPE.III],
                representations: [REPRESENTATION.ICONIC, REPRESENTATION.MIXED]
            }
        ]
    },
    S1: {
        conditions: [
            {
                networks: [NETWORK_TYPE.I, NETWORK_TYPE.II, NETWORK_TYPE.III],
                representations: [REPRESENTATION.ICONIC]
            },
            {
                networks: [NETWORK_TYPE.I, NETWORK_TYPE.II, NETWORK_TYPE.III],
                representations: [REPRESENTATION.ICONIC, REPRESENTATION.MIXED]
            },
            {
                networks: [NETWORK_TYPE.I],
                representations: [REPRESENTATION.ICONIC, REPRESENTATION.MIXED, REPRESENTATION.SYMBOLIC]
            }
        ]
    },
    S2: {
        conditions: [
            {
                networks: [NETWORK_TYPE.I, NETWORK_TYPE.II, NETWORK_TYPE.III],
                representations: [REPRESENTATION.ICONIC]
            },
            {
                networks: [NETWORK_TYPE.I, NETWORK_TYPE.II, NETWORK_TYPE.III],
                representations: [REPRESENTATION.ICONIC, REPRESENTATION.MIXED]
            },
            {
                networks: [NETWORK_TYPE.I, NETWORK_TYPE.II],
                representations: [REPRESENTATION.ICONIC, REPRESENTATION.MIXED, REPRESENTATION.SYMBOLIC]
            }
        ]
    },
    S3: {
        conditions: [
            {
                networks: [NETWORK_TYPE.I, NETWORK_TYPE.II, NETWORK_TYPE.III],
                representations: [REPRESENTATION.ICONIC]
            },
            {
                networks: [NETWORK_TYPE.I, NETWORK_TYPE.II, NETWORK_TYPE.III],
                representations: [REPRESENTATION.ICONIC, REPRESENTATION.MIXED]
            },
            {
                networks: [NETWORK_TYPE.I, NETWORK_TYPE.II, NETWORK_TYPE.III],
                representations: [REPRESENTATION.ICONIC, REPRESENTATION.MIXED, REPRESENTATION.SYMBOLIC]
            }
        ]
    }
};

export const COMMUNITIES = [
	{ key: "ANDALUCIA", content: "Andalucía" },
	{ key: "ARAGON", content: "Aragón" },
	{ key: "ASTURIAS", content: "Asturias (Asturies)" },
	{ key: "BALEARES", content: "Islas Baleares (Illes Balears)" },
	{ key: "CANARIAS", content: "Canarias" },
	{ key: "CANTABRIA", content: "Cantabria" },
	{ key: "CASTILLA_LA_MANCHA", content: "Castilla-La Mancha" },
	{ key: "CASTILLA_Y_LEON", content: "Castilla y León" },
	{ key: "CATALUNYA", content: "Cataluña (Catalunya)" },
	{ key: "CEUTA", content: "Ceuta" },
	{ key: "COMUNIDAD_VALENCIANA", content: "Comunidad Valenciana (Comunitat Valenciana)" },
	{ key: "EXTREMADURA", content: "Extremadura" },
	{ key: "GALICIA", content: "Galicia (Galiza)" },
	{ key: "LA_RIOJA", content: "La Rioja" },
	{ key: "MADRID", content: "Madrid" },
	{ key: "MELILLA", content: "Melilla" },
	{ key: "MURCIA", content: "Murcia" },
	{ key: "NAVARRA", content: "Navarra (Nafarroa)" },
	{ key: "PAIS_VASCO", content: "País Vasco (Euskadi)" }
];