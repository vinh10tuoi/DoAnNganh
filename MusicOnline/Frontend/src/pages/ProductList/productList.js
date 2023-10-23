import React, { useState, useEffect } from 'react';
import "./productList.css";
import {
    Col, Row, Upload, Spin, Button, Drawer, Input, Space, message,
    Form, Pagination, Modal, Popconfirm, notification, BackTop, Tag, Breadcrumb, Select, Table,
} from 'antd';
import {
    AppstoreAddOutlined, UploadOutlined, DeleteOutlined, PlusOutlined, EyeOutlined, ExclamationCircleOutlined, SearchOutlined,
    CalendarOutlined, UserOutlined, TeamOutlined, HomeOutlined, HistoryOutlined, FormOutlined, TagOutlined, EditOutlined
} from '@ant-design/icons';
import moment from 'moment';
import productApi from "../../apis/productsApi";
import { useHistory } from 'react-router-dom';
import axiosClient from '../../apis/axiosClient';
import 'suneditor/dist/css/suneditor.min.css';
import { PageHeader } from '@ant-design/pro-layout';
const { Option } = Select;

const ProductList = () => {
    const [product, setProduct] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);

    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [currentPage, setCurrentPage] = useState(1);
    const [id, setId] = useState();
    const [visible, setVisible] = useState(false);
    const [images, setImages] = useState([]);


    const handleOkUser = async (values) => {
        const currentDate = new Date();

        const user = JSON.parse(localStorage.getItem("token"));
        setLoading(true);
        try {
            const categoryList = {
                "path": mp3FileUrl,
                "artist_id": values.artist_id,
                "title_id": values.title_id,
                "user_id": user.user_id,
                "length": '100kb',
                "release_date": currentDate,

            };

            return axiosClient.post("/add_song", categoryList).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description: 'Tạo bài hát thất bại',
                    });
                } else {
                    notification["success"]({
                        message: `Thông báo`,
                        description: 'Tạo bài hát thành công',
                    });
                    setImages([]);
                    setOpenModalCreate(false);
                    handleProductList();
                }
            });

            setLoading(false);
        } catch (error) {
            throw error;
        }
    };
    const handleUpdateProduct = async (values) => {
        setLoading(true);
        const currentDate = new Date();

        const user = JSON.parse(localStorage.getItem("token"));
        const categoryList = {
            "path": values.path,
            "artist_id": values.artist_id,
            "title_id": values.title_id,
            "user_id": user.user_id,
            "length": '100kb',
            "release_date": currentDate,
        };

        return axiosClient.put("/update_song/" + id, categoryList).then(response => {
            if (response === undefined) {
                notification["error"]({
                    message: `Thông báo`,
                    description: 'Chỉnh sửa bài hát thất bại',
                });
                setLoading(false);
            } else {
                notification["success"]({
                    message: `Thông báo`,
                    description: 'Chỉnh sửa bài hát thành công',
                });
                setOpenModalUpdate(false);
                handleProductList();
                setLoading(false);
            }
        });
    };


    const handleCancel = (type) => {
        if (type === "create") {
            setOpenModalCreate(false);
        } else {
            setOpenModalUpdate(false)
        }
        console.log('Clicked cancel button');
    };

    const handleProductList = async () => {
        try {
            await productApi.getListSong({ page: 1, limit: 10000 }).then((res) => {
                console.log(res);
                setProduct(res.songs);
                setLoading(false);
            });
            ;
        } catch (error) {
            console.log('Failed to fetch product list:' + error);
        };
    };

    const handleDeleteCategory = async (id) => {
        setLoading(true);
        try {
            await productApi.deleteSong(id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Xóa bài hát thất bại',

                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Xóa bài hát thành công',

                    });
                    setCurrentPage(1);
                    handleProductList();
                    setLoading(false);
                }
            }
            );

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const handleProductEdit = (id) => {
        setOpenModalUpdate(true);
        (async () => {
            try {
                const response = await productApi.getDetailSong(id);
                console.log(response);
                setId(id);
                form2.setFieldsValue({
                    path: response.song.Path,
                    artist_id: response.song.ArtistID,
                    title_id: response.song.TitleID,
                });
                setMp3FileUrl(response.song.Path);

                setLoading(false);
            } catch (error) {
                throw error;
            }
        })();
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'SongID',
            key: 'SongID',
        },
        {
            title: 'Tên',
            dataIndex: 'Title',
            key: 'Title',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Nghệ sĩ',
            dataIndex: 'Artist',
            key: 'Artist',
        },
        {
            title: 'Ngày phát hành',
            dataIndex: 'ReleaseDate',
            key: 'ReleaseDate',
        },
        {
            title: 'Đường dẫn bài hát',
            dataIndex: 'Path',
            key: 'Path',
        },
        {
            title: 'Người tạo',
            dataIndex: 'User',
            key: 'User',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <div>
                    <Row>
                        <div className='groupButton'>
                            <Button
                                size="small"
                                icon={<EditOutlined />}
                                style={{ width: 150, borderRadius: 15, height: 30, marginTop: 5 }}
                                onClick={() => handleProductEdit(record.SongID)}
                            >{"Chỉnh sửa"}
                            </Button>
                            <div
                                style={{ marginTop: 5 }}>
                                <Popconfirm
                                    title="Bạn có chắc chắn xóa bài hát này?"
                                    onConfirm={() => handleDeleteCategory(record.SongID)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button
                                        size="small"
                                        icon={<DeleteOutlined />}
                                        style={{ width: 150, borderRadius: 15, height: 30 }}
                                    >{"Xóa"}
                                    </Button>
                                </Popconfirm>
                            </div>
                        </div>
                    </Row>
                </div >
            ),
        },
    ];

    const handleOpen = () => {
        setVisible(true);
    };


    const handleSubmit = () => {
        form.validateFields().then((values) => {
            form.resetFields();
            handleOkUser(values);
            setVisible(false);
        });
    };

    const [artists, setArtists] = useState([]);
    const [titles, setTitles] = useState([]);
    const [mp3FileUrl, setMp3FileUrl] = useState(null);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
          // Handle the file upload using Axios
          const formData = new FormData();
          formData.append('mp3', file);
    
          // Send a POST request to upload the file
          axiosClient.post('/upload_mp3', formData)
            .then((response) => {
              if (response) {
                console.log(response)
                setMp3FileUrl(response.file_url);
              } else {
                message.error('Upload failed');
              }
            })
            .catch((error) => {
              console.error(error);
              message.error('Upload failed');
            });
        }
      };


    useEffect(() => {
        (async () => {
            try {
                await productApi.getListSong().then((res) => {
                    console.log(res);
                    setProduct(res.songs);
                    setLoading(false);
                });

                await productApi.getListArtist().then((res) => {
                    console.log(res);
                    setArtists(res.artists);
                    setLoading(false);
                });

                await productApi.getListCategory().then((res) => {
                    console.log(res);
                    setTitles(res.titles);
                    setLoading(false);
                });

                ;
            } catch (error) {
                console.log('Failed to fetch event list:' + error);
            }
        })();
    }, [])
    return (
        <div>
            <Spin spinning={loading}>
                <div className='container'>
                    <div style={{ marginTop: 20 }}>
                        <Breadcrumb>
                            <Breadcrumb.Item href="">
                                <HomeOutlined />
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="">
                                <FormOutlined />
                                <span>Danh sách bài hát</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <div id="my__event_container__list">
                            <PageHeader
                                subTitle=""
                                style={{ fontSize: 14 }}
                            >
                                <Row>
                                    <Col span="18">

                                    </Col>
                                    <Col span="6">
                                        <Row justify="end">
                                            <Space>
                                                <Button onClick={handleOpen} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo bài hát</Button>
                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>

                            </PageHeader>
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Table columns={columns} dataSource={product} pagination={{ position: ['bottomCenter'] }} />
                    </div>
                </div>

                <Drawer
                    title="Tạo bài hát mới"
                    visible={visible}
                    onClose={() => setVisible(false)}
                    width={1000}
                    footer={
                        <div
                            style={{
                                textAlign: 'right',
                            }}
                        >
                            <Button onClick={() => setVisible(false)} style={{ marginRight: 8 }}>
                                Hủy
                            </Button>
                            <Button onClick={handleSubmit} type="primary">
                                Hoàn thành
                            </Button>
                        </div>
                    }
                >
                    <Form
                        form={form}
                        name="eventCreate"
                        layout="vertical"
                        initialValues={{
                            residence: ['zhejiang', 'hangzhou', 'xihu'],
                            prefix: '86',
                        }}
                        scrollToFirstError
                    >
                        <Form.Item
                            name="title_id"
                            label="Tên bài hát"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn tên bài hát!',
                                },
                            ]}
                        >
                            <Select placeholder="Chọn tên bài hát">
                                {titles.map(title => (
                                    <Select.Option key={title.TitleID} value={title.TitleID}>
                                        {title.Title}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="artist_id"
                            label="Nghệ sĩ"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn nghệ sĩ!',
                                },
                            ]}
                        >
                            <Select placeholder="Chọn nghệ sĩ">
                                {artists.map(artist => (
                                    <Select.Option key={artist.ArtistID} value={artist.ArtistID}>
                                        {artist.Name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="path"
                            label="Đường dẫn"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn tệp!',
                                },
                            ]}
                        >
                            <input
                                type="file"
                                accept=".mp3"
                                onChange={handleFileUpload}
                            />
                        </Form.Item>

                </Form>
            </Drawer>


            <Drawer
                title="Chỉnh sửa bài hát"
                visible={openModalUpdate}
                onClose={() => handleCancel("update")}
                width={1000}
                footer={
                    <div
                        style={{
                            textAlign: 'right',
                        }}
                    >
                        <Button onClick={() => {
                            form2
                                .validateFields()
                                .then((values) => {
                                    form2.resetFields();
                                    handleUpdateProduct(values);
                                })
                                .catch((info) => {
                                    console.log('Validate Failed:', info);
                                });
                        }} type="primary" style={{ marginRight: 8 }}>
                            Hoàn thành
                        </Button>
                        <Button onClick={() => handleCancel("update")}>
                            Hủy
                        </Button>
                    </div>
                }
            >
                <Form
                    form={form2}
                    name="eventCreate"
                    layout="vertical"
                    initialValues={{
                        residence: ['zhejiang', 'hangzhou', 'xihu'],
                        prefix: '86',
                    }}
                    scrollToFirstError
                >
                    <Form.Item
                        name="title_id"
                        label="Tên bài hát"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn tên bài hát!',
                            },
                        ]}
                    >
                        <Select placeholder="Chọn tên bài hát">
                            {titles.map(title => (
                                <Select.Option key={title.TitleID} value={title.TitleID}>
                                    {title.Title}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="artist_id"
                        label="Nghệ sĩ"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn nghệ sĩ!',
                            },
                        ]}
                    >
                        <Select placeholder="Chọn nghệ sĩ">
                            {artists.map(artist => (
                                <Select.Option key={artist.ArtistID} value={artist.ArtistID}>
                                    {artist.Name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="path"
                        label="Đường dẫn"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập đường dẫn!',
                            },
                        ]}
                    >
                        <Input placeholder="Đường dẫn" />
                    </Form.Item>

                </Form>
            </Drawer>

            <BackTop style={{ textAlign: 'right' }} />
        </Spin>
        </div >
    )
}

export default ProductList;