"use client";
import { useState, useEffect } from "react";
import GlobalApi from "../_service/GlobalApi";

function BranchSelector() {
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    GlobalApi.GetAllBranches().then(setBranches);
  }, []);

  return (
    <div>
      <select className="p-3 border rounded-lg">
        <option value="">Select Branch</option>
        {branches.map((branch, index) => (
          <option key={index} value={branch}>
            {branch}
          </option>
        ))}
      </select>
    </div>
  );
}

export default BranchSelector;
