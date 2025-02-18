import "react-quill/dist/quill.snow.css";
import React from "react";
import ReactQuill from "react-quill";

interface IRichTextEditor {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor = ({ value, onChange }: IRichTextEditor) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, false] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      [{ direction: "rtl" }],
      ["link"],
      ["clean"],
    ],
  };

  return (
    <div className="bg-white rounded-md text-black max-h-[320px] overflow-y-auto">
      <ReactQuill
        value={value}
        onChange={onChange}
        modules={modules}
        theme="snow"
      />
    </div>
  );
};

export default RichTextEditor;
