


export const getUniqueRecords = (attendanceList) =>{

    if (!Array.isArray(attendanceList)) {
        console.error("Expected an array but got:", attendanceList);
        return [];
    }
    
    const uniqueRecords = [];
    const existingUser = new Set();

    attendanceList ?.forEach(record => {
        if(!existingUser.has(record.Enrollment)){
            existingUser.add(record.Enrollment);
            uniqueRecords.push(record);
        }
    });

    return uniqueRecords;
}