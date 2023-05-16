import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileAlt, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons'
import './FileItem.scss'

const FileItem = ({color}) => {
    return (
        <div className='card-color'>
           <div className='color' style={{ backgroundColor: color.color, width: 100, height: 100 ,paddingRight:10}}></div>
           <h2 className='color-value'>{color.value.toFixed(3)}</h2>
        </div>
    )
}

export default FileItem
