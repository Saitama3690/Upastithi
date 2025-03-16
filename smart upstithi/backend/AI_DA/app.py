from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import cv2
import numpy as np
import torch
from PIL import Image
import io
import base64
import os
from ultralytics import YOLO

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Load YOLOv8 Model
model = YOLO("yolo11.pt")  
model.conf = 0.5  # Set confidence threshold

# Create upload directory if not exists
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/process-frame', methods=['POST'])
def process_frame():
    try:
        data = request.json['image']
        img_data = base64.b64decode(data)
        image = Image.open(io.BytesIO(img_data)).convert("RGB")

        img_np = np.array(image)
        img_cv = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)

        input_path = os.path.join(UPLOAD_FOLDER, "input.jpg")
        cv2.imwrite(input_path, img_cv)

        # ✅ Run YOLOv8 Detection
        results = model(img_cv)

        detected_classes = []
        for result in results:
            for box in result.boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])  
                conf = float(box.conf[0])  
                cls = int(box.cls[0])  

                # ✅ Ensure only class names are sent
                class_name = model.names.get(cls, "Unknown")  
                detected_classes.append(class_name)

                # Draw bounding box
                cv2.rectangle(img_cv, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(img_cv, class_name, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        output_path = os.path.join(UPLOAD_FOLDER, "detected.jpg")
        cv2.imwrite(output_path, img_cv)

        

        return jsonify({
            "detected_objects": detected_classes,  # ✅ Send only object names
            "processed_image": f"http://127.0.0.1:5001/uploads/detected.jpg"  # ✅ Image URL
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route to serve uploaded images
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
