import {Decimal} from '@prisma/client/runtime/library';

// Define a type for row data
type RowData = {
  [key: string]: string | number | Decimal | Date | Object | RowData[];
};

export default function castRows<T extends RowData | RowData[]>(result: T): T {
  // Success
  let cleanedResult: T;

  // If multiple rows
  if (Array.isArray(result)) {
    cleanedResult = result.map((row: RowData) => castRowValues(row)) as T;
    return cleanedResult;
  }

  // If only one row
  if (!Array.isArray(result)) {
    cleanedResult = castRowValues(result as RowData) as T;
    return cleanedResult;
  }

  throw new Error('Invalid input'); // or return a default value as needed
}

const castRowValues = (data: RowData): RowData => {
  let rows: RowData = {};

  for (const [key, value] of Object.entries(data)) {
    switch (typeof value) {
      case 'bigint':
        rows[key] = Number(value.toString());
        break;
      case 'object':
        if (value instanceof Decimal) {
          rows[key] = parseFloat(value as unknown as string);
        }

        // Array
        if (
          value instanceof Array &&
          Array.isArray(value) &&
          value.constructor.name === 'Array'
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
};
