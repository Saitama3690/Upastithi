import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";

const CameraCapture = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [detectedImg, setDetectedImg] = useState(null);
    const [detectedClasses, setDetectedClasses] = useState([]);
    const [isCapturing, setIsCapturing] = useState(false);
    const [recognitionStatus, setRecognitionStatus] = useState("Recognising");

    useEffect(() => {
        startWebcam();
        
        // Fetch recognition status every 3 seconds
        const statusInterval = setInterval(() => {
            fetchRecognitionStatus();
        }, 3000);

        let captureInterval;
        if (isCapturing) {
            updateRecognitionStatus("Recognising"); // Start recognition
            captureInterval = setInterval(() => {
                sendFrameForDetection();
            }, 5000);
        } else {
            updateRecognitionStatus("Not Recognising"); // Stop recognition
        }

        return () => {
            clearInterval(statusInterval);
            clearInterval(captureInterval);
        };
    }, [isCapturing]);

    // Function to start webcam
    const startWebcam = () => {
        navigator.mediaDevices
            .getUserMedia({ video: true })
            .then((stream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch((error) => {
                console.error("Error accessing webcam:", error);
            });
    };

    // Fetch recognition status from backend
    const fetchRecognitionStatus = async () => {
        try {
            const response = await fetch("https://192.168.1.4/api/attendance/recognition-status");
            const data = await response.json();
            setRecognitionStatus(data.status);
        } catch (error) {
            console.error("Error fetching recognition status:", error);
        }
    };

    // Update recognition status on backend
    const updateRecognitionStatus = async (status) => {
        try {
            await fetch("https://192.168.1.4/api/attendance/update-recognition", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            setRecognitionStatus(status);
        } catch (error) {
            console.error("Error updating recognition status:", error);
        }
    };

    // Capture frame and send to backend
    const sendFrameForDetection = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        const imageData = canvas.toDataURL("image/jpeg").split(",")[1]; // Convert to base64

        try {
            const response = await fetch("http://127.0.0.1:5001/process-frame", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: imageData }),
            });

            const result = await response.json();
            if (result.detected_image) {
                setDetectedImg(`data:image/jpeg;base64,${result.detected_image}`);
            }

            if (result.detected_classes) {
                setDetectedClasses(result.detected_classes);
            }
        } catch (error) {
            console.error("Error sending frame:", error);
        }
    };

    return (
        <div className="flex flex-col items-center p-4">
            <h1 className="text-2xl font-bold mb-4">Real-Time Face/Object Detection</h1>

            {/* Display Recognition Status */}
            <p className="text-lg font-semibold text-blue-600">Status: {recognitionStatus}</p>

            {/* Webcam Feed */}
            <video ref={videoRef} autoPlay playsInline className="border-2 border-gray-300 rounded-md" width="480" height="360"></video>
            <canvas ref={canvasRef} width="480" height="360" className="hidden"></canvas>

            {/* Start/Stop Detection Button */}
            <Button 
                onClick={() => setIsCapturing(!isCapturing)} 
                className={`mt-4 px-4 py-2 ${isCapturing ? "bg-red-500" : "bg-green-500"} text-black rounded`}>
                {isCapturing ? "Stop Detection" : "Start Detection"}
            </Button>

            {/* Display Processed Image with Bounding Boxes */}
            {detectedImg && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Processed Image:</h3>
                    <img src={detectedImg} alt="Processed" className="border-2 border-gray-400 rounded-md" width="480" />
                </div>
            )}

            {/* Detected Objects List */}
            {detectedClasses.length > 0 && (
                <div className="mt-4 p-4 bg-gray-200 rounded-md">
                    <h3 className="text-lg font-semibold">Detected Objects:</h3>
                    <ul className="list-disc ml-6">
                        {detectedClasses.map((cls, index) => (
                            <li key={index}>{cls}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CameraCapture;
