import format from "date-fns/format";

export function formatDate(dateString: string) {
    return format(new Date(dateString), "MMM d, yyyy");
}

export function generateSlug(input:string) {
    return input.replace(/[^a-zA-Z0-9 ]/g, '').trim().replace(/ +/g, " ").replace(/\s/g, "-").toLowerCase();

}