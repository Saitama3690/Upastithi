"use client";
import { useState, useEffect } from "react";
import GlobalApi from "../_service/GlobalApi";

function SubjectSelector({ selectedBranch, selectedSemester, selectedDivision }) {
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        if (!selectedBranch || !selectedSemester || !selectedDivision) {
            console.warn("⚠️ Missing dependencies:", { selectedBranch, selectedSemester, selectedDivision });
            return; // Exit early if any required value is missing
        }
    
        const fetchSubjects = async () => {
            try {
                const fetchedSubjects = await GlobalApi.GetAllSubjectsByBranchSemesterDivision(
                    selectedBranch,
                    selectedSemester,
                    selectedDivision
                );
                console.log("📌 Raw API Response:", fetchedSubjects); // Log the entire response
                const formattedFetchedSubject = fetchedSubjects?.subjects || []; // Safe extraction
                console.log("📌 Subjects to Display:", formattedFetchedSubject);
                setSubjects(Array.isArray(formattedFetchedSubject) ? formattedFetchedSubject : []);
            } catch (error) {
                console.error("❌ Error fetching subjects:", error);
            }
        };
    
        fetchSubjects();
    }, [selectedBranch, selectedSemester, selectedDivision]); 
    
    return (
        <div>
            <select className="p-3 border rounded-lg">
                <option value="">Select Subject</option>
                {subjects.map((item, index) => (
                    <option key={index} value={item}>
                        {item}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default SubjectSelector;
