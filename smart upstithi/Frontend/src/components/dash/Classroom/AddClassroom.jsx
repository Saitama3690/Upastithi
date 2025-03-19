import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const Branches = [
  "Computer Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Mechanical Engineering",
];

const Semesters = [1, 2, 3, 4, 5, 6];

export default function AddClassroom() {
  const [classrooms, setClassrooms] = useState(() => [
    { Branch: "", Semester: "", Division: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (index, { target: { name, value } }) => {
    setClassrooms((prevClassrooms) =>
      prevClassrooms.map((classroom, i) =>
        i === index
          ? {
              ...classroom,
              [name]:
                name === "Division" ? value.toUpperCase().slice(0, 1) : value,
            }
          : classroom
      )
    );
  };

  const handleSelectChange = (index, name, value) => {
    setClassrooms((prevClassrooms) =>
      prevClassrooms.map((classroom, i) =>
        i === index ? { ...classroom, [name]: value } : classroom
      )
    );
  };

  const addClassForm = () => {
    setClassrooms((prev) => [...prev, { Branch: "", Semester: "", Division: "" }]);
  };

  const removeClassroom = (index) => {
    if (classrooms.length > 1) {
      setClassrooms((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      for (const classroom of classrooms) {
        if (!classroom.Branch || !classroom.Semester || !classroom.Division) {
          alert("All fields are required. Please fill in all details.");
          setIsSubmitting(false);
          return;
        }
  
        console.log("Sending classroom:", classroom); // Debug request payload
  
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_IP}api/classroom/add-classroom`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(classroom), // ✅ Send single object
          }
        );
  
        const responseData = await response.json();
        console.log("Server Response:", responseData); // Debug response
  
        if (!response.ok) throw new Error(responseData.message || "Failed to add classroom");
      }
  
      alert("Classrooms added successfully!");
      setClassrooms([{ Branch: "", Semester: "", Division: "" }]);
    } catch (error) {
      console.error("Error adding classrooms:", error);
      alert(error.message || "Failed to add classrooms. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <Card className="max-w-lg mx-auto mt-10 p-6 shadow-lg rounded-xl bg-white">
      <CardContent>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Add Classroom
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {classrooms.map((classroom, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg shadow-sm bg-gray-50 relative"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-700">
                  Classroom {index + 1}
                </h3>
                {index > 0 && (
                  <Button
                    type="button"
                    onClick={() => removeClassroom(index)}
                    variant="destructive"
                    size="sm"
                  >
                    Remove
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                {/* Branch Selection */}
                <div>
                  <Label className="text-gray-700">Branch</Label>
                  <Select
                    value={classroom.Branch}
                    onValueChange={(value) =>
                      handleSelectChange(index, "Branch", value)
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {Branches.map((Branch) => (
                        <SelectItem
                          key={Branch}
                          value={Branch}
                          className="cursor-pointer"
                        >
                          {Branch}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Semester Selection */}
                <div>
                  <Label className="text-gray-700">Semester</Label>
                  <Select
                    value={classroom.Semester}
                    onValueChange={(value) =>
                      handleSelectChange(index, "Semester", value)
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {Semesters.map((sem) => (
                        <SelectItem
                          key={sem}
                          value={sem.toString()}
                          className="cursor-pointer"
                        >
                          Semester {sem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Division Input */}
                <div>
                  <Label className="text-gray-700">Division</Label>
                  <Input
                    type="text"
                    name="Division"
                    value={classroom.Division}
                    onChange={(e) => handleInputChange(index, e)}
                    placeholder="Enter Division (A-Z) or (1-9)"
                    pattern="[A-Z1-9]{1}"
                    title="Division must be an uppercase letter (A-Z) or a digit (1-9)"
                    required
                    className="uppercase"
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between gap-4">
            <Button
              type="button"
              onClick={addClassForm}
              className="flex-1 bg-green-600"
            >
              + Add Another Classroom
            </Button>
            <Button
              type="submit"
              className="flex-1 border text-white border-gray-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit All Classrooms"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
