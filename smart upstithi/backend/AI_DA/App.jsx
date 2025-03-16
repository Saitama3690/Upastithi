import React, { useEffect, useRef, useState } from "react";

const App = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [detectedImg, setDetectedImg] = useState(null);
    const [detectedClasses, setDetectedClasses] = useState([]);
    const [isCapturing, setIsCapturing] = useState(false);

    useEffect(() => {
        startWebcam();

        // Automatically capture an image every 5 seconds
        const interval = setInterval(() => {
            if (isCapturing) {
                sendFrameForDetection();
            }
        }, 5000);

        return () => clearInterval(interval); // Cleanup interval on component unmount
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

            {/* Webcam Feed */}
            <video ref={videoRef} autoPlay playsInline className="border-2 border-gray-300 rounded-md" width="480" height="360"></video>
            <canvas ref={canvasRef} width="480" height="360" className="hidden"></canvas>

            {/* Start/Stop Detection Button */}
            <button 
                onClick={() => setIsCapturing(!isCapturing)} 
                className={`mt-4 px-4 py-2 ${isCapturing ? "bg-red-500" : "bg-green-500"} text-white rounded`}>
                {isCapturing ? "Stop Detection" : "Start Detection"}
            </button>

            {/* Display Processed Image with Bounding Boxes */}
            {detectedImg && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Processed Image:</h3>
                    <img src={detectedImg} alt="Processed" className="border-2 border-gray-400 rounded-md" width="480" />
                </div>
            )}

            {/* Detected Objects List */}
            {detectedClasses.length > 0 && (
                <div className="mt-4">
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

export default App;
