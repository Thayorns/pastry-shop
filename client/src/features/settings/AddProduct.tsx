import React, { useState, useEffect } from "react";
import { Spin, Result, Button, Input, Image, Upload, Select, message } from 'antd';
import { LeftOutlined, PlusOutlined } from '@ant-design/icons';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { useAddProductMutation } from "../api/apiSlice";
import { useSelector } from 'react-redux';
import { RootState } from "../../app/store/store";
import { Link } from "react-router-dom";

import './settings.css';
import '../../app/styles/normalize.css';
import '../../app/styles/vars.css';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
const { TextArea } = Input;

const AddProduct: React.FC = () => {
    const [addProduct, { isError, isSuccess, isLoading }] = useAddProductMutation();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [activeSelect, setActiveSelect] = useState('');

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => setFileList(newFileList);

    const handleSelectChange = (value: string) => {
        setActiveSelect(value);
    };

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );


    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
    const [messageApi, contextHolder] = message.useMessage();
    const success = () => {
        messageApi.open({
            type: 'success',
            content: `You have added a new product to your product feed!`,
            duration: 5,
        });
    };
    const error = () => {
        messageApi.open({
            type: 'error',
            content: 'An error occurred! Not added..',
            duration: 5,
        });
    };
    useEffect(() => {
        if (isSuccess) {
            success();
        }
        if (isError) {
            error();
        }
    }, [isSuccess, isError]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (fileList.length === 0 || !fileList[0].originFileObj) {
            console.error('File not selected');
            return;
        }

        const formData = new FormData();
        formData.append('photo', fileList[0].originFileObj as Blob);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('ingredients', ingredients);
        formData.append('chapter', activeSelect);

        try {
            await addProduct(formData);
            setTitle('');
            setDescription('');
            setPrice('');
            setIngredients('');
            setFileList([]);
            setActiveSelect('');
        } catch (err) {
            console.error('Error adding product:', err);
        }
    };


    return (
        <>
            {(
                <div className="add-settings-div">
                    {contextHolder}
                    <Button type="dashed" className="backward-button">
                        <Link to={'/admin-settings'}><LeftOutlined /></Link>
                    </Button>
                    <p>Fill out the form, be sure to select the desired <strong>section</strong> to correctly add a new product to the feed.</p>

                    <form onSubmit={handleSubmit}>
                        <div className="upload-div">

                            <Upload
                                listType="picture-card"
                                fileList={fileList}
                                onPreview={handlePreview}
                                onChange={handleChange}
                            >
                                {fileList.length >= 1 ? null : uploadButton}
                            </Upload>
                            {previewImage && (

                                <Image
                                    wrapperStyle={{ display: 'none' }}
                                    preview={{
                                        visible: previewOpen,
                                        onVisibleChange: (visible) => setPreviewOpen(visible),
                                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                                    }}
                                    src={previewImage}
                                />
                            )}
                        </div>
                        <div className="form-select">
                            <Select value={activeSelect}
                                style={{ width: 120 }}
                                onChange={handleSelectChange}
                                options={[
                                    { value: '', label: 'Sections:' },
                                    { value: 'Cakes', label: 'Cakes' },
                                    { value: 'Baked Goods', label: 'Baked Goods' },
                                    { value: 'Desserts', label: 'Desserts' },
                                    { value: 'Drinks', label: 'Drinks' },
                                    { value: 'Sandwiches', label: 'Sandwiches' },
                                    { value: 'Salads', label: 'Salads' },
                                ]}
                            />
                        </div>
                        <div>
                            <Input
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                                value={title}
                                type="text"
                                name="title" placeholder="Product name" required
                            ></Input>
                        </div>
                        <div>
                            <Input.TextArea
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                                value={description}
                                rows={4}
                                name="description"
                                placeholder="Product description"
                                required
                            />
                        </div>
                        <div>
                            <Input
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)}
                                value={price}
                                type="number"
                                name="price" placeholder="Product price" required
                            ></Input>
                        </div>
                        <div>
                            <Input.TextArea
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setIngredients(e.target.value)}
                                value={ingredients}
                                rows={4}
                                name="ingredients"
                                placeholder="Product ingredients separated by commas."
                                required
                            />
                        </div>
                        <Button htmlType="submit" type="primary" className="form-button" disabled={isLoading}>Add</Button>
                    </form>
                </div>
            )}


            {isAuth === false && (
                <Result status="403" subTitle="Sorry, you are not logged in and cannot access this page." />
            )}
        </>

    )
}
export default AddProduct;