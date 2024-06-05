import { arasaacURL } from "../Globals";

export const X = 210;
export const Y = 25;

export const pathTop = (networkType) => {
    if (networkType === "I-I")
        return "L 350 85 L 350 105";
    if (networkType === "I-II")
        return "L 480 85 L 480 105";
    if (networkType === "I-III")
        return "L 570 85 L 570 105";
};
export const pathBottom = (networkType) => {
    if (networkType === "I-I")
        return "L 350 150";
    if (networkType === "I-II")
        return "L 350 150 L 480 150 L 480 150";
    if (networkType === "I-III")
        return "L 350 150 L 570 150 L 570 145";
};
export const pathBottom2 = (networkType) => {
    if (networkType === "I-II")
        return "M 480 145 L 480 150 L 610 150 L 610 165";
    if (networkType === "I-III")
        return "M 570 145 L 570 165";
};
export const nexusX = (networkType) => {
    if (networkType === "I-I")
        return 130;
    if (networkType === "I-II")
        return 260;
    if (networkType === "I-III")
        return 350;
};
export const viewBoxWidth = (networkType) => {
    if (networkType === "I-I")
        return 480;
    if (networkType === "I-II")
        return 730;
    if (networkType === "I-III")
        return 920;
};
export const stopX = (networkType) => {
    if (networkType === "I-I")
        return 90;
    if (networkType === "I-II")
        return 210;
    if (networkType === "I-III")
        return 310;
};
export let nodes = (exercise) => {
    if (exercise?.networkType === "I-I") {
        return [
            { id: "1", type: "type1", posX: 0, posY: 0, src: ["ICONIC", "MIXED"].includes(exercise.representation) ? `${arasaacURL}/${exercise?.mainImage}` : null, text: ["MIXED", "SYMBOLIC"].includes() ? exercise?.title : null, shape: "rect" },
            { order: 2, id: "2", type: "type2", posX: -160, posY: 90, src: "/pictograms/es_parte_de.png", nexus: true, text: "es parte de" },
            { order: 3, id: "3", type: "type3", posX: -160, posY: 170, shape: "ellipse", src: ["ICONIC", "MIXED"].includes(exercise.representation) ? `${arasaacURL}/${exercise?.definitionImage}` : null, text: ["MIXED", "SYMBOLIC"].includes(exercise.representation) ? exercise?.definitionText : null },
            { order: 6, id: "4", type: "type4", posX: nexusX(exercise?.networkType), posY: 90, src: "/pictograms/tiene.png", nexus: true, text: "tiene" },
            { order: 7, id: "5", type: "type5", posX: 130, posY: 170, shape: "ellipse", src: ["ICONIC", "MIXED"].includes(exercise.representation) ? `${arasaacURL}/${exercise?.ampliationImages[0]}` : null, text: ["MIXED", "SYMBOLIC"].includes(exercise.representation) ? exercise?.ampliationText[0] : null },
            { id: "6", type: "type6", posX: -70, posY: 190, text: "." },
        ];
    }
    if (exercise?.networkType === "I-II") {
        return [
            { id: "1", type: "type1", posX: 0, posY: 0, src: ["ICONIC", "MIXED"].includes(exercise.representation) ? `${arasaacURL}/${exercise?.mainImage}` : null, text: ["MIXED", "SYMBOLIC"].includes(exercise.representation) ? exercise?.title : null, shape: "rect" },
            { order: 2, id: "2", type: "type2", posX: -160, posY: 90, src: "/pictograms/es_parte_de.png", nexus: true, text: "es parte de" },
            { order: 3, id: "3", type: "type3", posX: -160, posY: 170, shape: "ellipse", src: ["ICONIC", "MIXED"].includes(exercise.representation) ? `${arasaacURL}/${exercise?.definitionImage}` : null, text: ["MIXED", "SYMBOLIC"].includes(exercise.representation) ? exercise?.definitionText : null },
            { order: 6, id: "4", type: "type4", posX: nexusX(exercise?.networkType), posY: 90, src: "/pictograms/tiene.png", nexus: true, text: "tiene" },
            { order: 7, id: "5", type: "type5", posX: 130, posY: 170, shape: "ellipse", src: ["ICONIC", "MIXED"].includes(exercise.representation) ? `${arasaacURL}/${exercise?.ampliationImages[0]}` : null, text: ["MIXED", "SYMBOLIC"].includes(exercise.representation) ? exercise?.ampliationText[0] : null },
            { id: "6", type: "type6", posX: -70, posY: 190, text: "." },

            { order: 8, id: "7", type: "type7", posX: 260, posY: 190, text: "y", src: ["ICONIC", "MIXED"].includes(exercise.representation) ? `${arasaacURL}/8289` : null, stop: true },
            { order: 9, id: "8", type: "type8", posX: 390, posY: 170, shape: "ellipse", src: ["ICONIC", "MIXED"].includes(exercise.representation) ? `${arasaacURL}/${exercise?.ampliationImages[1]}` : null, text: ["MIXED", "SYMBOLIC"].includes(exercise.representation) ? exercise?.ampliationText[1] : null },
        ];
    }
    if (exercise?.networkType === "I-III") {
        return [
            { id: "1", type: "type1", posX: 0, posY: 0, src: ["ICONIC", "MIXED"].includes(exercise.representation) ? `${arasaacURL}/${exercise?.mainImage}` : null, text: ["MIXED", "SYMBOLIC"].includes(exercise.representation) ? exercise?.title : null, shape: "rect" },
            { order: 2, id: "2", type: "type2", posX: -160, posY: 90, src: "/pictograms/es_parte_de.png", nexus: true, text: "es parte de" },
            { order: 3, id: "3", type: "type3", posX: -160, posY: 170, shape: "ellipse", src: ["ICONIC", "MIXED"].includes(exercise.representation) ? `${arasaacURL}/${exercise?.definitionImage}` : null, text: ["MIXED", "SYMBOLIC"].includes(exercise.representation) ? exercise?.definitionText : null },
            { order: 6, id: "4", type: "type4", posX: nexusX(exercise?.networkType), posY: 90, src: "/pictograms/tiene.png", nexus: true, text: "tiene" },
            { order: 7, id: "5", type: "type5", posX: 130, posY: 170, shape: "ellipse", src: ["ICONIC", "MIXED"].includes(exercise.representation) ? `${arasaacURL}/${exercise?.ampliationImages[0]}` : null, text: ["MIXED", "SYMBOLIC"].includes(exercise.representation) ? exercise?.ampliationText[0] : null },
            { id: "6", type: "type6", posX: -70, posY: 190, text: "." },
            { order: 8, id: "7", type: "type7", posX: 260, posY: 190, text: ",", src: ["ICONIC", "MIXED"].includes(exercise.representation) ? `${arasaacURL}/8289` : null, stop: true },
            { order: 9, id: "8", type: "type8", posX: 350, posY: 170, shape: "ellipse", src: ["ICONIC", "MIXED"].includes(exercise.representation) ? `${arasaacURL}/${exercise?.ampliationImages[1]}` : null, text: ["MIXED", "SYMBOLIC"].includes(exercise.representation) ? exercise?.ampliationText[1] : null },
            { order: 10, id: "9", type: "type9", posX: 460, posY: 190, text: "y", src: ["ICONIC", "MIXED"].includes(exercise.representation) ? `${arasaacURL}/8289` : null, stop: true },
            { order: 11, id: "10", type: "type10", posX: 570, posY: 170, shape: "ellipse", src: ["ICONIC", "MIXED"].includes(exercise.representation) ? `${arasaacURL}/${exercise?.ampliationImages[2]}` : null, text: ["MIXED", "SYMBOLIC"].includes(exercise.representation) ? exercise?.ampliationText[2] : null },
        ];
    };
};