import cv2
import numpy as np
import base64
from flask import Flask, request, jsonify
from ultralytics import YOLO
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow frontend to connect

# Load YOLO model
try:
    model = YOLO("bestyolov11.pt")  # Change this to your trained model path
    print("✅ YOLO model loaded successfully!")
except Exception as e:
    print(f"❌ Failed to load YOLO model: {str(e)}")

@app.route("/process-frame", methods=["POST"])
def process_frame():
    try:
        # Ensure request has valid JSON
        if "image" not in request.json:
            return jsonify({"error": "No image data received"}), 400
        
        # Decode the base64 image
        image_data = base64.b64decode(request.json["image"])
        np_arr = np.frombuffer(image_data, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if frame is None:
            return jsonify({"error": "Failed to decode image"}), 400

        # Run YOLO detection
        results = model(frame)
        detected_classes = []  # List to store detected class names

        for r in results:
            for box in r.boxes:
                conf = box.conf[0].item()
                if conf >= 0.7:  # Confidence threshold
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    class_id = int(box.cls[0].item())  # Class index
                    
                    # Get class name safely
                    class_name = model.names.get(class_id, f"Unknown({class_id})")  
                    detected_classes.append(class_name)

                    # Draw bounding box
                    label = f"{class_name} {conf:.2f}"
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        # Convert processed image to base64
        _, buffer = cv2.imencode(".jpg", frame)
        processed_image = base64.b64encode(buffer).decode("utf-8")

        return jsonify({"detected_classes": detected_classes, "detected_image": processed_image})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
