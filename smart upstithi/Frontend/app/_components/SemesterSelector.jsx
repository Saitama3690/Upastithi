"use client";
import { useState, useEffect } from "react";
import GlobalApi from "../_service/GlobalApi";

function SemesterSelector({ selectedBranch, onSemesterChange }) {
    const [semesters, setSemesters] = useState([]);

    useEffect(() => {
        if (selectedBranch) {
            GlobalApi.GetSemestersByBranch(selectedBranch).then(setSemesters);
        } else {
            setSemesters([]); // Reset when no branch is selected
        }
    }, [selectedBranch]);

    return (
        <div>
            <select className="p-3 border rounded-lg"
            //  onChange={(e) => selectedDivision(e.target.value)}
             >
                <option value="">Select Semester</option>
                {semesters.map((item, index) => (
                    <option key={index} value={item}>
                        {item}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default SemesterSelector;
