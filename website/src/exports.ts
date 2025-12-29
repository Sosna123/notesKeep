export const apiUri = "http://localhost:3000";

export type Note = {
    id: number;
    user_id: number;
    title: string | null;
    content: string | null;
    dateOfCreation: number | null;
    dateOfLastChange: number | null;
    color: string | null;
};
