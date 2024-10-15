import { Exclusion, Recipient } from "../app.type";

export interface App {
    recipients: Recipient[]
    exclusions?: Exclusion[]
}
