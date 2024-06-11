import { Button, Modal, Input, Card, Pagination, Flex, Image } from "antd";
import { arasaacURL } from '../../Globals';
import { useState } from "react";

let SelectImageModal = ({ setMessage, setOpen, open, selectedImages, setSelectedImages, selectionLimit }) => {

    let { Search } = Input;

    const PAGE_SIZE = 12;

    let [images, setImages] = useState([]);
    let [currentPage, setCurrentPage] = useState(1);
    let [searchText, setSearchText] = useState("");

    let handleCancel = () => {
        setOpen(false);
        setImages([]);
        setSearchText("");
    };

    let handlePageChange = (page) => {
        setCurrentPage(page);
    };

    let searchImages = async (text) => {
        let response = null;
        try {
            response = await fetch(arasaacURL + `/pictograms/es/search/${text}`);
        } catch (e) {
            setMessage({ error: { type: "internalServerError", message: e } });
            return;
        }

        let jsonData = await response?.json();
        if (response?.ok) {
            setImages(jsonData.map(image => image._id));
        } else {
            setMessage({ error: jsonData?.error });
        }
    };

    let handleImageClick = (image) => {
        if (selectedImages.includes(image)) {
            setSelectedImages(selectedImages.filter(selectedImage => selectedImage !== image));
        } else if (selectedImages.length < selectionLimit) {
            setSelectedImages([...selectedImages, image]);
        }
    };

    let currentImages = images.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    return (
        <Modal
            title='Selecciona la imagen principal'
            open={open}
            onCancel={handleCancel}
            width="70vw"
            footer={[
                <Button key="back" onClick={handleCancel}>
                    Cancel
                </Button>
            ]}
        >
            <Search
                placeholder="input search text"
                allowClear
                onSearch={(value) => {
                    setSearchText(value);
                    searchImages(value);
                }}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: "25vmax" }}
            />
            <Flex wrap style={{ marginTop: "2vh" }} gap="2vh">
                {currentImages && currentImages.map(image =>
                    <Card
                        onClick={() => handleImageClick(image)}
                        hoverable
                        key={image}
                        style={selectedImages.includes(image) ? { border: '2px solid #1890ff' } : {}}
                    >
                        <Image preview={false} width="6vmax" src={`${arasaacURL}/pictograms/${image}`} />
                    </Card>
                )}
            </Flex>
            <Pagination
                current={currentPage}
                pageSize={PAGE_SIZE}
                total={images.length}
                onChange={handlePageChange}
                style={{ marginTop: "2vh", textAlign: "center" }}
                showSizeChanger={false}
            />
        </Modal>
    );
};

export default SelectImageModal;
