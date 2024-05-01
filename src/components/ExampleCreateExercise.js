import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

let ExampleCreateExercise = () => {
    const [image, setImage] = useState(null);
    const [textInput, setTextInput] = useState('');
    const [generatedImage, setGeneratedImage] = useState(null);

    const onDrop = acceptedFiles => {
        const file = acceptedFiles[0];
        const reader = new FileReader();

        reader.onload = () => {
            setImage(reader.result);
        };

        reader.readAsDataURL(file);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const handleTextChange = event => {
        setTextInput(event.target.value);
    };

    const handleGenerateImage = () => {
        const imageElement = new Image();
        imageElement.crossOrigin = 'anonymous';
        imageElement.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = imageElement.width;
            canvas.height = imageElement.height + 50; // Añade espacio para el texto

            ctx.drawImage(imageElement, 0, 0);

            ctx.font = '30px Arial';
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            ctx.fillText(textInput, canvas.width / 2, canvas.height - 10); // Coloca el texto en la parte inferior y centrado

            const generatedImageUrl = canvas.toDataURL('image/png');
            setGeneratedImage(generatedImageUrl);
        };
        imageElement.src = image;
    };

    return (
        <div>
            <h1>Subir imagen y añadir texto</h1>
            <div {...getRootProps()} style={dropzoneStyle}>
                <input {...getInputProps()} />
                <p>Arrastra una imagen aquí o haz clic para seleccionarla.</p>
            </div>
            {image && (
                <div>
                    <h2>Imagen cargada:</h2>
                    <img src={image} alt="Uploaded" style={imageStyle} />
                    <input type="text" value={textInput} onChange={handleTextChange} />
                    <button onClick={handleGenerateImage}>Generar Imagen</button>
                </div>
            )}
            {generatedImage && (
                <div>
                    <h2>Imagen generada:</h2>
                    <img src={generatedImage} alt="Generated" style={imageStyle} />
                </div>
            )}
        </div>
    );
};

const dropzoneStyle = {
    border: '2px dashed #cccccc',
    borderRadius: '4px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
};

const imageStyle = {
    maxWidth: '100%',
    marginTop: '10px',
};

export default ExampleCreateExercise;
