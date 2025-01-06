import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface IRichTextEditor {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor = ({ value, onChange }: IRichTextEditor) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      [{ direction: "rtl" }],
      ["link"],
      ["clean"],
    ],
  };

  return (
    <ReactQuill
      value={value}
      onChange={onChange}
      modules={modules}
      theme="snow"
    />
  );
};

export default RichTextEditor;
