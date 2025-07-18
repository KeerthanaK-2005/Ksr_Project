from flask import Flask, jsonify
from deepface import DeepFace
import os

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/verify-face', methods=['GET'])  
def verify_face():
    try:
        
        photo_path = os.path.join(UPLOAD_FOLDER, "test_image_1.jpg")
        id_path = os.path.join(UPLOAD_FOLDER, "test_image_2.jpg")

        
        if not os.path.exists(photo_path) or not os.path.exists(id_path):
            return jsonify({"error": "One or both test images not found"}), 404

        result = DeepFace.verify(img1_path=photo_path, img2_path=id_path, model_name='ArcFace')
        is_verified = result["verified"]
        distance = result.get("distance", None)

        return jsonify({
            "verified": is_verified,
            "distance": distance,
            "message": "Face Match" if is_verified else "Face Mismatch"
        })

    except Exception as e:
        print("❌ Error:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
