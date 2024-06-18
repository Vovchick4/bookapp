import { addDays, differenceInDays } from "date-fns";
import { trial_days } from "../constants/app";

export default function isTrialDate(date: string | undefined | null) {
    if (!date) {
        return false;
    }

    return trial_days > differenceInDays(new Date(), new Date(date));
}