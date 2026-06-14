import { parse } from 'csv-parse/sync';

export const parsearCSV = (csvString) => {
    const delimiter = csvString.includes(';') ? ';' : ',';

    const registros = parse(csvString, {
        delimiter,
        columns: true,
        skip_empty_lines: true,
        trim: true,
    });

    return registros;
};