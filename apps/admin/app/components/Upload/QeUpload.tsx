import { UploadOutlined } from "@ant-design/icons";
import { Button, message, Upload, type UploadProps } from "antd";
import type { UploadChangeParam, UploadFile } from "antd/es/upload";
import { upload } from "../../api/common";
import { useEffect, useState } from "react";
type props = {
  url?: string | undefined;
  setUrl: (url: string) => void;
};
const QeUpload = (props: props) => {
  const { url, setUrl } = props;
  const [fileList, setFileList] = useState<UploadFile[]>();
  const handleUploadChange = (e: UploadChangeParam<UploadFile<any>>) => {
    setFileList(e.fileList);
  };
  const handleUploadDrop = (e: React.DragEvent<HTMLDivElement>) => {
    console.log(e);
  };
  const customRequest = async (options: any) => {
    console.log("options", options);
    const formData = new FormData();
    formData.append("file", options.file);
    await upload(formData).then((res) => {
      const ossUrl = res.data;
      if (!ossUrl) return message.error("获取阿里云URL失败");
      if (options.onSuccess) {
        message.success("上传成功");
        options.file.url = ossUrl;
        setUrl(ossUrl);
        options.onSuccess({ url: ossUrl }, options.file);
      }
    });
  };
  const previewFile = (file: any) => {
    console.log("file", file);
    return Promise.resolve(file.url as string);
  };
  const uploadProps: UploadProps = {
    name: "file",
    fileList: fileList,
    listType: "picture-card",
    customRequest: customRequest,
    onChange: handleUploadChange,
  };
  useEffect(() => {
    if (url) {
      const echoFile: UploadFile = {
        name: "回显图片",
        url: url,
        uid: "1",
      };
      setFileList([echoFile]);
    }
  }, [url]);
  return (
    <>
      <Upload {...uploadProps}>
        <Button icon={<UploadOutlined />} />
      </Upload>
    </>
  );
};
export default QeUpload;
