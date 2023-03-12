import { Decimal } from "@prisma/client/runtime/library";

export default function castRows(result: any) {
  // Success
  let cleanedResult = undefined;
  let cleanRow:
    | { [key: string]: string | number | Decimal | Object }
    | undefined = {};

  // If multiple rows
  if (Array.isArray(result)) {
    cleanRow = undefined;
    cleanedResult = result.map(
      (result: { [key: string]: string | number }, i: number) => {
        return castRowValues(result);
      }
    );
    return cleanedResult;
  }

  // If only one row
  if (!Array.isArray(result)) {
    cleanRow = castRowValues(result);
    return cleanRow;
  }
}

const castRowValues = (data: any) => {
  if (data) {
    let rows:
      | { [key: string]: string | number | Decimal | Date | Object }
      | undefined = {};

    for (
      let i = 0, arrayLength = Object.keys(data).length;
      i < arrayLength;
      i++
    ) {
      const key: string = Object.keys(data)[i];
      const value = data[key];
      switch (typeof value) {
        case "bigint":
          rows[key] = parseInt((value as unknown as number).toString());
          break;
        case "object":
          if (value instanceof Decimal) {
            rows[key] = parseFloat(value as unknown as string);
          }

          // Array
          if (
            value instanceof Array &&
            Array.isArray(value) &&
            value.constructor.name === "Array"
          ) {
            // Recurse if row is an array
            rows[key] = castRows(value) as unknown as Object;
          }

          // Date/Datetime
          if (value instanceof Date) {
            rows[key] = new Date(value);
          }
          break;
        default:
          rows[key] = value;
          break;
      }
    }
    return rows;
  }
};
