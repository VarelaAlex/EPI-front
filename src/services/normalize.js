export const normalizeKey = (text) =>
    text
        .normalize("NFD")                  // separa acentos
        .replace(/[\u0300-\u036f]/g, "")   // elimina acentos
        .replace(/Ñ/g, "N")
        .replace(/\s+/g, "_")
        .toUpperCase();