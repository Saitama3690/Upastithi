"use client"
import { useTheme } from "next-themes";
import {react, useEffect} from 'react';

function Dashboard (){
    const {setTheme} = useTheme()

    useEffect(()=>{
        setTheme('dark');
    },[])
    return (
        <div> <center>page</center></div>
    )
}

export default Dashboard