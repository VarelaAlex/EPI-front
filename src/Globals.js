export const CATEGORIES = {
	BODY_AND_FOOD: "BODY&FOOD", FAMILY: "FAMILY", TRANSPORTS: "TRANSPORTS", ANIMALS: "ANIMALS", SEASONS: "SEASONS"
};

export const REPRESENTATION = {
	ICONIC: "ICONIC", MIXED: "MIXED", GLOBAL: "GLOBAL", SYMBOLIC: "SYMBOLIC"
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

export const TRAINING_MODES = {
    FREE: "FREE",
    RULED: "RULED"
};

export const conceptAmpliationAudioMap = {
    "2317": "CASAS",
    "2439": "JUGAR",
    "2445": "LECHE",
    "2497": "PADRE",
    "2541": "QUESO",
    "2618": "YOGUR",
    "2737": "DIENTES",
    "2859": "PARQUES",
    "2944": "LENGUA",
    "2948": "LANA",
    "2953": "LABIOS",
    "3011": "CEJAS",
    "3058": "ARBOLES",
    "3124": "REYES_MAGOS",
    "3131": "NIEVE",
    "3139": "PAPA_NOEL",
    "3298": "DEDOS",
    "4608": "COLUMPIOS",
    "4759": "TOBOGAN",
    "5459": "ESPINAS",
    "5545": "PLUMAS",
    "5922": "BASTON",
    "6209": "RUEDAS",
    "6245": "VOLANTE",
    "7148": "LA_LLUVIA",
    "7287": "TROMPA",
    "7294": "VELAS",
    "8319": "PESTANAS",
    "9826": "DEDOS",
    "10341": "HIJOS",
    "10343": "NIETOS",
    "15905": "BANO",
    "25843": "BANARSE",
    "30482": "ABUELOS",
    "31148": "MADRE",
    "33070": "COCINA",
    "33074": "SALON",
    "34971": "PATAS",
    "35583": "EL_FRIO",
    "36958": "PUERTAS",
    "LOS_OJOS": "LOS_OJOS",
    "PESTANAS": "PESTANAS",
    "CEJAS": "CEJAS",
    "LA_LECHE": "LA_LECHE",
    "QUESO": "QUESO",
    "YOGUR": "YOGUR",
    "LA_CALLE": "LA_CALLE",
    "PARQUES": "PARQUES",
    "CASAS": "CASAS",
    "LOS_HERMANOS": "LOS_HERMANOS",
    "ABUELOS": "ABUELOS",
    "PADRE": "PADRE",
    "MADRE": "MADRE",
    "LA_OVEJA": "LA_OVEJA",
    "LANA": "LANA",
    "LECHE": "LECHE",
    "LOS_GUANTES": "LOS_GUANTES",
    "EL_FRIO": "EL_FRIO",
    "EL_VERANO": "EL_VERANO",
    "BANARSE": "BANARSE",
    "JUGAR": "JUGAR",
    "LA_NAVIDAD": "LA_NAVIDAD",
    "REYES_MAGOS": "REYES_MAGOS",
    "ARBOLES": "ARBOLES",
    "PAPA_NOEL": "PAPA_NOEL",
    "EL_YOGUR": "EL_YOGUR",
    "LA_BOCA": "LA_BOCA",
    "DIENTES": "DIENTES",
    "LENGUA": "LENGUA",
    "LABIOS": "LABIOS",
    "LA_MADRE": "LA_MADRE",
    "HIJOS": "HIJOS",
    "LA_CASA": "LA_CASA",
    "COCINA": "COCINA",
    "BANO": "BANO",
    "SALON": "SALON",
    "EL_PARQUE": "EL_PARQUE",
    "COLUMPIOS": "COLUMPIOS",
    "TOBOGAN": "TOBOGAN",
    "LOS_PAJAROS": "LOS_PAJAROS",
    "PLUMAS": "PLUMAS",
    "LA_MANO": "LA_MANO",
    "DEDOS": "DEDOS",
    "EL_PADRE": "EL_PADRE",
    "LOS_ABUELOS": "LOS_ABUELOS",
    "BASTON": "BASTON",
    "NIETOS": "NIETOS",
    "LOS_HIJOS": "LOS_HIJOS",
    "EL_BARCO": "EL_BARCO",
    "VELAS": "VELAS",
    "EL_COCHE": "EL_COCHE",
    "RUEDAS": "RUEDAS",
    "VOLANTE": "VOLANTE",
    "PUERTAS": "PUERTAS",
    "LOS_PECES": "LOS_PECES",
    "ESPINAS": "ESPINAS",
    "EL_ABRIGO": "EL_ABRIGO",
    "LA_NIEVE": "LA_NIEVE",
    "LAS_BOTAS": "LAS_BOTAS",
    "LA_LLUVIA": "LA_LLUVIA",
    "EL_INVIERNO": "EL_INVIERNO",
    "NIEVE": "NIEVE",
    "EL_ELEFANTE": "EL_ELEFANTE",
    "TROMPA": "TROMPA",
    "PATAS": "PATAS",
};

export const conceptDefinitionAudioMap = {
    "2300": "CALUROSO",
    "2669": "EL_CUERPO",
    "2684": "LA_CARA",
    "2704": "LA_CIUDAD",
    "2884": "EL_INVIERNO",
    "6061": "BEBER",
    "6456": "COMER",
    "6901": "ANIMALES",
    "7170": "NAVEGAR",
    "7777": "UN_MAMIFERO",
    "9830": "LAS_MANOS",
    "31466": "LA_FAMILIA",
    "35583": "FRIO",
    "36974": "VIAJAR",
    "LOS_OJOS": "LOS_OJOS",
    "LA_CARA": "LA_CARA",
    "LA_LECHE": "LA_LECHE",
    "BEBER": "BEBER",
    "LA_CALLE": "LA_CALLE",
    "LA_CIUDAD": "LA_CIUDAD",
    "LOS_HERMANOS": "LOS_HERMANOS",
    "LA_FAMILIA": "LA_FAMILIA",
    "LA_OVEJA": "LA_OVEJA",
    "UN_ANIMAL": "UN_ANIMAL",
    "LOS_GUANTES": "LOS_GUANTES",
    "LAS_MANOS": "LAS_MANOS",
    "EL_VERANO": "EL_VERANO",
    "CALUROSO": "CALUROSO",
    "LA_NAVIDAD": "LA_NAVIDAD",
    "EL_INVIERNO": "EL_INVIERNO",
    "EL_YOGUR": "EL_YOGUR",
    "COMER": "COMER",
    "LA_BOCA": "LA_BOCA",
    "LA_MADRE": "LA_MADRE",
    "LA_CASA": "LA_CASA",
    "EL_PARQUE": "EL_PARQUE",
    "LOS_PAJAROS": "LOS_PAJAROS",
    "ANIMALES": "ANIMALES",
    "LA_MANO": "LA_MANO",
    "EL_CUERPO": "EL_CUERPO",
    "EL_PADRE": "EL_PADRE",
    "LOS_ABUELOS": "LOS_ABUELOS",
    "LOS_HIJOS": "LOS_HIJOS",
    "EL_BARCO": "EL_BARCO",
    "NAVEGAR": "NAVEGAR",
    "EL_COCHE": "EL_COCHE",
    "VIAJAR": "VIAJAR",
    "LOS_PECES": "LOS_PECES",
    "EL_ABRIGO": "EL_ABRIGO",
    "LAS_BOTAS": "LAS_BOTAS",
    "FRIO": "FRIO",
    "EL_ELEFANTE": "EL_ELEFANTE",
    "UN_MAMIFERO": "UN_MAMIFERO",
};