import {Toast} from "primereact/toast";
import moment from "moment";
import {baseUrl} from "@/app/utilis/webinfo";


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


//Validation function
export const validateForm = (values: any, schema: any) => {
    const errors: any = {};
    for (const key in schema) {
        const error = schema[key](values[key]);
        if (error) {
            errors[key] = error;
        }
    }

    return errors;
};


//Delete function
export const handleDelete = async (params: deleteParams) => {
    const {
        id, endPoint, name, data = [], refetch, setData, handlePageFunction, token,
        toast, setUpdate
    } = params
    const isArray = Array.isArray(id);
    const url = `${baseUrl?.url}${endPoint}${isArray ? '' : `/${id}`}`;

    const options: RequestInit = {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        ...(isArray && { body: JSON.stringify({ id: id }) }),
    };

    const filteredData = isArray
        ? data.filter((item: any) => !id.includes(item?.id))
        : data.filter((item: any) => item?.id !== id);

    try {
        const res = await fetch(url, options);
        const responseData = await res.json();


        if (res.ok) {
            if (data?.length > 0 && setData) {
                setData(filteredData);
            }
            if (refetch) {
                refetch();
            }
            if (setUpdate) {
                setUpdate((previous: boolean) => !previous);
            }

            callToast(toast, true, `${name}${isArray ? 's' : ''} deleted successfully`);

            if ((data?.length === 1 || handlePageFunction)) {
                if (setUpdate) {
                    setUpdate((previous: boolean) => !previous);
                } else if (handlePageFunction) {
                    handlePageFunction();
                }
            }

        } else {
            callToast(toast, false, responseData?.message || 'Deletion failed');
        }
    } catch (error: any) {
        callToast(toast, false, error?.message || 'An error occurred');
    }
};
