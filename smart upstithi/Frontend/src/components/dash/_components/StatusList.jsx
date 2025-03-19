import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { getUniqueRecords } from '../../../../app/_service/UniqueRecords';
import moment from "moment";

function StatusList({attendanceList}) {
    const [totalStudent, setTotalStudent] = useState(0);
    const [presentPercentage,setPresentPercentage] = useState(0);

    console.log("📌 Received attendanceList:", attendanceList);


    useEffect(()=>{

        
        if(attendanceList){
            const totalSt = getUniqueRecords(attendanceList)
            setTotalStudent(totalSt.length);

            const today = moment().format('D');
            const presentPercentage = (attendanceList.length/totalSt.length*Number(today)*100);
            console.log("percentage ye hona chaiye", presentPercentage)
            setPresentPercentage(presentPercentage);
        }
    },attendanceList)
    
  return (
    <div>
        StatusList

    </div>
  )
}

export default StatusList
