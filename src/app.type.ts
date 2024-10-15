export type Recipient = {
    name?: string;
    email: string;
}

export type Exclusion = {
    sender: string;
    receiver: string;
}
