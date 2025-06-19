import {Toast} from "primereact/toast";
import moment from "moment";


export default function callToast(
    toast: React.RefObject<Toast | null>,
    type: boolean | string,
    msg: string,
    life: number = 3000
) {
    if (toast?.current) {
        toast?.current?.show({
            severity: type === "warn" ? "warn" : type ? "success" : "error",
            summary: type === "warn" ? "Warning" : type ? "Successful" : "Error",
            detail: msg,
            life: life,
        });
    }
}


// Date Format Function
export const formattedDateTime = (date: string | Date, isTime: boolean = false) => {
    return moment(date).format(`${isTime ? `h:mm A,` : ""} Do MMM YYYY`)
}

export const handleChangeData = (name: string, value: any, allData: {
    [key: string]: string | name | any
}, setAllData: any) => {
    return setAllData({
        ...allData,
        [name]: value
    })
}
