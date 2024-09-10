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


  const AddProduct: React.FC = () => {
    const [addProduct, {isError, isSuccess, isLoading}] = useAddProductMutation();

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
          <div style={{ marginTop: 8 }}>Загрузить фото</div>
        </button>
    );


    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
    const [messageApi, contextHolder] = message.useMessage();
    const success = () => {
        messageApi.open({
            type: 'success',
            content: `Вы добавили новую позицию в ленту продуктов!`,
            duration: 5,
        });
    };
    const error = () => {
        messageApi.open({
            type: 'error',
            content: 'Произошла ошибка! Не добавилось..',
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
            console.error('Файл не выбран');
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
            console.error('Ошибка при добавлении продукта:', err);
        }
    };


    return (
        <>  
            {isAuth === true && (
                <div className="add-settings-div">
                    {contextHolder}
                    <Button type="dashed" className="backward-button">
                        <Link to={'/admin-settings'}><LeftOutlined /></Link>
                    </Button>
                    <p>Заполните форму, обязательно выберите нужный <strong>раздел</strong>, чтобы корректно добавить новый продукт в ленту.</p>

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
                                    { value: '', label: 'Разделы:' },
                                    { value: 'Торты', label: 'Торты' },
                                    { value: 'Выпечка', label: 'Выпечка' },
                                    { value: 'Десерты', label: 'Десерты' },
                                    { value: 'Напитки', label: 'Напитки' },
                                    { value: 'Сендвичи', label: 'Сендвичи' },
                                    { value: 'Салаты', label: 'Салаты' },
                                ]}
                            />
                        </div>
                        <div>
                            <Input 
                                onChange={(e:React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value) } 
                                value={title} 
                                type="text" 
                                name="title" placeholder="Название продукта" required
                            ></Input>
                        </div>
                        <div>
                            <Input 
                                onChange={(e:React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value) } 
                                value={description} 
                                type="text" 
                                name="description" placeholder="Описание продукта" required
                            ></Input>
                        </div>
                        <div>
                            <Input 
                                onChange={(e:React.ChangeEvent<HTMLInputElement>) => setPrice(e.target.value) } 
                                value={price} 
                                type="number" 
                                name="price" placeholder="Цена продукта" required
                            ></Input>
                        </div>
                        <div>
                            <Input 
                                onChange={(e:React.ChangeEvent<HTMLInputElement>) => setIngredients(e.target.value) } 
                                value={ingredients} 
                                type="text" 
                                name="ingredients" placeholder="Ингредиенты продукта, через запятую." required
                            ></Input>
                        </div>
                        <Button htmlType="submit" type="primary" className="form-button" disabled={isLoading}>Добавить</Button>
                    </form>
                </div>
            )}
            
        
            {isAuth === false && (
                <Result status="403" subTitle="Простите, Вы не авторизованы и не можете зайти на эту страницу." />
            )}
        </>
        
    )
}
export default AddProduct;