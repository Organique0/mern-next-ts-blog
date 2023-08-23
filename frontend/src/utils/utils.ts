import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import format from "date-fns/format";

export function formatDate(dateString: string) {
    return format(new Date(dateString), "MMM d, yyyy");
}

export function formatRelativeDate(dateString: string) {
    return formatDistanceToNowStrict(new Date(dateString), { addSuffix: true });
}

export function generateSlug(input: string) {
    return input.replace(/[^a-zA-Z0-9 ]/g, '').trim().replace(/ +/g, " ").replace(/\s/g, "-").toLowerCase();
}