import React, { useState } from "react";
import { Spin, Result, Button, Input, Image, Upload } from 'antd';
import { LeftOutlined, PlusOutlined } from '@ant-design/icons';
import type { GetProp, UploadFile, UploadProps } from 'antd';

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
    
    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>Загрузить фото</div>
        </button>
    );

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [ingredients, setIngredients] = useState('')

    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            
        }catch(err){
            console.error('Ошибка регистрации: ', err);
        }
    }


    return (
        <>  
            <div className="add-settings-div">
                <Button type="dashed" className="backward-button">
                    <Link to={'/admin-settings'}><LeftOutlined /></Link>
                </Button>
                <p>Заполните форму, чтобы добавить новый продукт в ленту.</p>

                <form onSubmit={handleSubmit}>
                    <div className="upload-div">
                        <Upload
                            action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChange}
                        >
                            {fileList.length >= 3 ? null : uploadButton}
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
                    <Button htmlType="submit" type="primary" className="form-button">Добавить</Button>
                </form>

            </div>
            
        
            {isAuth === false && (
                <Result status="403" title="403" subTitle="Простите, Вы не авторизованы и не можете зайти на эту страницу." />
            )}
        </>
        
    )
}
export default AddProduct;