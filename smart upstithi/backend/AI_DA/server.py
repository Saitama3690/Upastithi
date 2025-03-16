from flask import Flask, request, jsonify

app = Flask(__name__)

recognition_status = "Recognising"  # Default status

# Route to update recognition status
@app.route("/update-recognition", methods=["POST"])
def update_recognition():
    global recognition_status
    data = request.get_json()
    
    if "status" not in data:
        return jsonify({"error": "Recognition status is required."}), 400

    recognition_status = data["status"]
    print(f"📢 Recognition updated: {recognition_status}")
    return jsonify({"message": "Recognition status updated successfully."})

# Route to get recognition status
@app.route("/recognition-status", methods=["GET"])
def get_recognition_status():
    return jsonify({"status": recognition_status})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)  # Run on all interfaces
