import React from "react";
import { Upload, message, Button, Icon } from "antd";

const props = {
  name: "file",
  action: "",
  headers: {
    authorization: "authorization-text"
  },
  directory: true,
  accept: ".xlsx",

  onChange: (info: any) => {
    console.log(info);
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  }
};

interface props {
  project: string;
}
export default class UploadButton extends React.Component<props> {
  click = () => {};

  render() {
    props.action =
      "http://104.224.151.19:1090/upload?name=" + this["props"]["project"];
    console.log(props.action);
    return (
      <Upload {...props}>
        <Button>
          <Icon type="upload" /> Click to Upload
        </Button>
      </Upload>
    );
  }
}
