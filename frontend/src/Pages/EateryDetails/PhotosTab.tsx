// PhotosTab.tsx

import React, { FormEvent, useEffect, useState } from "react";
import { TabProps, UserRole} from "../../interface";
import { useEateryContext } from "../../hooks/useEateryContext";

interface ImageData {
  imageId: string;
  url: string;
}

const PhotosTab: React.FC<TabProps> = ({ eatery, user }) => {
  const [imageUrls, setImageUrls] = useState<ImageData[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const id = Number(eatery.id)
  
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [modalImage, setModalImage] = useState<string>("");

  const { fetchEatery, getEateryImage, addImage, deleteImage} = useEateryContext();

  useEffect(() => {
    const fetchImages = async () => {
      const urls: ImageData[] = [];
      if (eatery && eatery.eatery_image) {
        for (const imageId of eatery.eatery_image) {
          try {
            const url = await getEateryImage(imageId);
            if (url) {
              urls.push({ imageId, url });
            }
          } catch (error) {
            console.error(`Failed to fetch image with ID ${imageId}: `, error);
          }
        }
      }
      setImageUrls(urls);
    };
    fetchImages();
  }, [getEateryImage, eatery?.eatery_image, eatery]);

  const handleAddImageSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    if (imageFile) {
      const success = await addImage(imageFile);
      if (success) {
        setLoading(false);
        setImageFile(null);
        if (id) {
          fetchEatery(id?.toString());
        }
      } else {
        console.error("Failed to upload photo");
        setLoading(false);
      }
    } else {
      console.error("No file selected.");
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    await deleteImage(imageId);
    if (id) {
      fetchEatery(id?.toString());
    }
  };

  return (
    <>
      {user.role == UserRole.EATERY && (<form
        onSubmit={handleAddImageSubmit}
        className="menu-image-form-container"
      >
        <label
          htmlFor="fileInput"
          className="file-input-label"
          style={{ cursor: "pointer" }}
        >
          <input
            type="file"
            id="fileInput"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            style={{ display: "none" }}
          />
          {imageFile ? imageFile.name : "Choose Photo Here"}
        </label>
        <button type="submit" className="submit-button btn btn-primary">
          {loading ? "Uploading..." : "Upload Photo"}
        </button>
      </form>)}

      <hr />
      <div className="image-grid">
        {imageUrls?.map((imgObj, index) => (
          <div className="menu-image-container" key={index}>
            <img 
              src={imgObj.url} 
              alt={`Eatery ${index}`} 
              onClick={() => { 
                setModalImage(imgObj.url);
                setModalVisible(true);
              }}
              />
            {user.role === UserRole.EATERY && (<i
              className="bi bi-trash gl"
              style={{ padding: "10px" }}
              onClick={() => handleDeleteImage(imgObj.imageId)}
            ></i>)}
          </div>
        ))}
      </div>
      
      {isModalVisible && (
        <div 
          className="mod" 
          onClick={() => setModalVisible(false)}
        >
          <img src={modalImage} alt="Modal view" />
        </div>
      )}

    </>
  );
};

export default PhotosTab;
