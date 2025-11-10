"use client"
import React, {useEffect} from "react";
import Body from "@/src/components/body";
import UserService from "@/src/service/dataService";

export default function Test() {
    const [users, setUsers] = React.useState([]);
    useEffect(() => {
        UserService.getData().then((response) => {
            const getTransactions = response.data.map((itm: { transactions: any; }) =>  itm.transactions );
            setUsers(getTransactions);
        }).catch((error) => {
            console.error(error);
        });
    }, []);
    return (
        <>
            <Body list={users}></Body>
        </>
    );
}
