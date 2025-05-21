import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ImageUploader.css'; // Optional: for your custom styles

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [scale, setScale] = useState(2);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!image) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(image);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
    setResponse(null);
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("scale", scale);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/images/upload",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true, // optional
        }
      );

      setResponse(res.data.data);
    } catch (err) {
      console.error("Upload error:", err.response ? err.response.data : err.message);
      alert("Upload failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Image Uploader & Upscaler</h1>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input"
        />

        {previewUrl && (
          <div className="preview-container">
            <p className="preview-label">Selected Image Preview:</p>
            <img
              src={previewUrl}
              alt="Selected"
              className="preview-image"
            />
          </div>
        )}

        <div className="scale-container">
          <label htmlFor="scale" className="scale-label">
            Scale Factor:
          </label>
          <input
            id="scale"
            type="number"
            min={1}
            max={10}
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            className="scale-input"
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={loading}
          className="upload-button"
        >
          {loading ? "Uploading..." : "Upload and Upscale"}
        </button>

        {response && (
          <div className="response-container">
            <h2 className="response-title">Upscaled Result</h2>
            <div className="response-images">
              <div className="response-image-wrapper">
                <p className="response-image-label">Original Image:</p>
                <img
                  src={response.originalPath}
                  alt="Original"
                  className="response-image"
                />
              </div>

              <div className="response-image-wrapper">
                <p className="response-image-label">Upscaled Image:</p>
                <img
                  src={response.upscaledPath}
                  alt="Upscaled"
                  className="response-image"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
