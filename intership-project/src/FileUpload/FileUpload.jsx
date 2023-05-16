import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import './FileUpload.scss'
import axios from 'axios'
import FileItem from '../FileItem/FileItem'

const FileUpload = ({ files, setFiles, removeFile }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [colors, setColors] = useState([]);
    const [image, setImage] = useState(null)

const onImageChange = (event) => {
 if (event.target.files && event.target.files[0]) {
   setImage(URL.createObjectURL(event.target.files[0]));
 }
}
  
    const handleImageChange = (event) => {
      if (event.target.files && event.target.files[0]) {
        setImage(URL.createObjectURL(event.target.files[0]));
        setSelectedImage(event.target.files[0]);
      }
    };
  
    const handleImageUpload = async () => {
      if(selectedImage==null){
        alert("Image Not Selected");
        return
      }
      if( selectedImage.name.split(".")[1].includes("jpg") || selectedImage.name.split(".")[1].includes("png")){
        const reader = new FileReader();
        reader.readAsDataURL(selectedImage);
        reader.onload = async () => {
          const base64String = reader.result.replace(/^data:(.*;base64,)?/, '');
          const response = await axios.post('http://localhost:8080/api/extractColors', {
            image: base64String,
          });
          setColors(response.data);
        };
      }else{

        alert(selectedImage.name.split('.')[1]+" Select png or jpg only")
        return
      }
    };
  console.log(image,"image")
    return (
<>
      <div className='card-container'>
      <div className='file-card'>
      <div className='inputs'>
        <input className='file-input' id='img' type="file" name='upload' onChange={handleImageChange} />
        <label className='file-input-label' htmlFor='img'>Choose File</label>
        {selectedImage!=null ? "File Name : "+selectedImage.name : "Choose image and Extract Colors"}
        {image && <div className='selectedImageWraper'><img className='selectedImage' src={image}/></div>}
      </div>

      <button className='extractBtn' onClick={handleImageUpload}>Extract Colors</button>
      </div>
        <div className='color-info'>
          {colors?.map((color, index) => (
            <FileItem key={index} color={color}/>
          ))}
        </div>
      </div>
</>
    );
  }

export default FileUpload
