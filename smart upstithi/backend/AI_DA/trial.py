import cv2
import numpy as np
import time
import requests  # Import requests to send data to ESP32
from ultralytics import YOLO

# Load YOLO model
model_path = "bestyolov11.pt"  # Change to your trained model path
try:
    model = YOLO(model_path)
    print("✅ YOLO model loaded successfully!")
except Exception as e:
    print(f"❌ Error loading YOLO model: {str(e)}")
    exit()

# ESP32 Endpoint to receive recognition status
ESP32_SERVER_URL = "http://192.168.201.225/update-recognition"  # Change to ESP32 URL

# Start video capture
ESP32_STREAM_URL = "http://192.168.201.83:81/stream"  # ESP32-CAM stream URL
cap = cv2.VideoCapture(ESP32_STREAM_URL)

if not cap.isOpened():
    print("❌ Error: Could not open webcam.")
    exit()

print("✅ Real-time YOLO detection started. Press 'q' to exit.")

# Timer to track when to capture an image
last_capture_time = time.time()
capture_interval = 5  # Capture every 5 seconds

while True:
    ret, frame = cap.read()
    if not ret:
        print("❌ Error: Failed to grab frame. Exiting...")
        break

    # Show the real-time webcam feed
    cv2.imshow("Live Feed (Press 'q' to exit)", frame)

    # Check if 5 seconds have passed
    current_time = time.time()
    if current_time - last_capture_time >= capture_interval:
        print("📸 Capturing image for processing...")

        # Run YOLO detection on the captured frame
        results = model(frame, verbose=False)  # Suppress unnecessary logs

        detected_status = "Not Recognised"  # Default if no faces detected

        for r in results:
            for box in r.boxes:
                conf = box.conf[0].item()
                if conf >= 0.8:  # Confidence threshold
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    class_id = int(box.cls[0].item())

                    # Get class name safely
                    class_name = model.names.get(class_id, f"Unknown({class_id})")

                    # Draw bounding box
                    label = f"{class_name} {conf:.2f}"
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

                    detected_status = "Recognised"  # If a valid face is detected

        # Send the status update to ESP32
        try:
            response = requests.post(ESP32_SERVER_URL, json={"status": detected_status})
            print(f"🔄 Sent status update to ESP32: {detected_status}, Response: {response.status_code}")
        except Exception as e:
            print(f"⚠️ Failed to send status update to ESP32: {str(e)}")

        # Show the processed frame
        cv2.imshow("Processed Frame", frame)

        # Update the last capture time
        last_capture_time = current_time

    # Press 'q' to exit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Cleanup
cap.release()
cv2.destroyAllWindows()
print("✅ Detection stopped, resources released.")
