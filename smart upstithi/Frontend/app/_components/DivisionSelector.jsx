"use client";
import { useState, useEffect } from "react";
import GlobalApi from "../_service/GlobalApi";

function DivisionSelector({ selectedBranch, selectedSemester, onDivisionChange }) {
    const [divisions, setDivisions] = useState([]);



    useEffect(() => {
        if (selectedBranch && selectedSemester) {
            GlobalApi.GetDivisionsByBranchSemester(selectedBranch, selectedSemester)
                .then(setDivisions)
                .catch(() => console.error("Failed to fetch divisions"));
        } else {
            setDivisions([]); // Reset when inputs are missing
        }
    }, [selectedBranch, selectedSemester]);
    

    return (
        <div>
            <select 
                className="p-3 border rounded-lg" 
                onChange={(e) => onDivisionChange(e.target.value)}
            >
                <option value="">Select Division</option>
                {divisions.map((item, index) => (
                    <option key={index} value={item}>
                        {item}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default DivisionSelector;
