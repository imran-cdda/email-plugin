import dayjs from "dayjs";
/**
 * Format a given date into a string.
 * @param date - The date to format (string | Date)
 * @param format - The output format (default: "YYYY-MM-DD")
 * @returns formatted date as string
 */
export function dateFormatter(date, format = "YYYY-MM-DD") {
    return dayjs(date).format(format);
}
