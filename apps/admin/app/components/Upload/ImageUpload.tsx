import QeUpload from "./QeUpload";

type props = {
  url?: string | undefined;
  setUrl: (url: string) => void;
};
const ImageUpload = (props: props) => {
  const { url, setUrl } = props;
  return (
    <>
      <QeUpload url={url} setUrl={setUrl} />
    </>
  );
};
export default ImageUpload;
