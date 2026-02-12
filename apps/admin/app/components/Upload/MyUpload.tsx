import {
  Upload,
  Button,
  type UploadProps,
  type UploadFile,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons"; // 可选：加上传图标更直观
import { upload } from "app/api/common";
import { useState } from "react";

const MyUpload = (params: {
  imageUrls: string[];
  setImageUrls: (url: string[]) => void;
}) => {
  const { imageUrls, setImageUrls } = params;
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const customRequest: UploadProps["customRequest"] = async (options) => {
    const { file, onSuccess, onError } = options;

    try {
      const uploadFile = file as File;
      const formData = new FormData();
      formData.append("file", uploadFile);
      const res = await upload(formData);

      const ossUrl = res.data;
      if (!ossUrl) throw new Error("后端未返回有效的OSS图片地址");

      if (onSuccess) {
        // 🌟 核心修复1：onSuccess 传参格式必须是 (响应对象, 文件对象)
        (file as any).url = ossUrl;
        onSuccess({ url: ossUrl }, file);
        // 兜底：手动挂载url到file顶级（确保预览能拿到）
      }
      message.success("上传成功");
    } catch (err) {
      const errorMsg = (err as Error).message || "上传失败";
      if (onError) onError(new Error(errorMsg), file);
      message.error(errorMsg);
    }
  };

  const uploadProps: UploadProps = {
    name: "file",
    fileList: fileList,
    customRequest: customRequest,
    // 🌟 核心修复2：设置listType为picture/picture-card，强制显示图片预览
    listType: "picture-card", // picture（带文字）/picture-card（纯图片卡片）二选一
    // 🌟 核心修复3：previewFile 增加容错，确保返回字符串
    previewFile: (file: any) => Promise.resolve((file.url as string) || ""),
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList);
      console.log("newFile", newFileList);
      let urls = [];
      for (let i = 0; i < newFileList.length; i++) {
        urls[i] = newFileList[i].url;
        console.log("urls", urls);
      }
      setImageUrls(urls as any);
      console.log("imageUrls", imageUrls);
    },
    // 可选：显示删除按钮，提升体验
    onRemove: (file) => {
      const newFileList = fileList.filter((f) => f.uid !== file.uid);
      setFileList(newFileList);
      return true;
    },
  };

  return (
    <Upload {...uploadProps}>
      <Button icon={<UploadOutlined />}>点击上传</Button>
    </Upload>
  );
};

export default MyUpload;
