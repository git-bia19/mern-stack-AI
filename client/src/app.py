from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import DetrFeatureExtractor, DetrForSegmentation
from PIL import Image
import numpy as np
import torch
import io
from io import BytesIO
import base64

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
app.config['MAX_CONTENT_LENGTH'] = 16 * 1000 * 1000
# Load the model
feature_extractor = DetrFeatureExtractor.from_pretrained("facebook/detr-resnet-50-panoptic")
model = DetrForSegmentation.from_pretrained("facebook/detr-resnet-50-panoptic")

@app.route('/segment', methods=['POST','GET'])
def segment_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
 

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    # Convert the file stream to a PIL image
    image = Image.open(file.stream)
    
    # Prepare image for the model
    inputs = feature_extractor(images=image, return_tensors="pt")
    
    # Forward pass
    outputs = model(**inputs)
    
    # Convert model output to segmentation map
    processed_sizes = torch.as_tensor(inputs["pixel_values"].shape[-2:]).unsqueeze(0)
    result = feature_extractor.post_process_panoptic(outputs, processed_sizes)[0]
    
    # Convert the segmentation map to an image
    panoptic_seg = Image.open(io.BytesIO(result["png_string"]))
    panoptic_seg_id = np.array(panoptic_seg, dtype=np.uint8)
    print(panoptic_seg_id)
    # Convert the segmentation map to base64 to send to the client
    buffered = BytesIO()
    panoptic_seg.save(buffered, format="PNG")
    result_image = Image.fromarray(panoptic_seg_id)
    result_image.save('segmented_output.png')
    img_str = base64.b64encode(buffered.getvalue()).decode()
    ``````````````````````````````````
    response_data= jsonify({'segmented_image': img_str})
    response_data.headers.add('Access-Control-Allow-Origin', '*')
    return response_data

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
