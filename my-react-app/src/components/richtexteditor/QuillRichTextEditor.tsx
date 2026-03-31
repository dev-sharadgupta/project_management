import { useEffect, useRef } from "react";
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Make sure the CSS is imported


// Custom image handler
function imageHandler(this: any) {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");
  input.click();

  input.onchange = async () => {
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const range = this.quill.getSelection();
        this.quill.insertEmbed(range.index, "image", reader.result);
      };
      reader.readAsDataURL(file); // Convert image to base64
    }
  };
}


interface QuillRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function QuillRichTextEditor({ value, onChange }: QuillRichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillInstance = useRef<Quill | null>(null);

  useEffect(() => {
    if (editorRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: {
            container: [
              // [{ font: [] }, { size: [] }],
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              ["bold", "italic", "underline", "strike"],
              // [{ color: [] }, { background: [] }],
              // [{ script: "sub" }, { script: "super" }],
              [{ list: "ordered" }, { list: "bullet" }],
              // [{ indent: "-1" }, { indent: "+1" }],
              // [{ direction: "rtl" }],
              // [{ align: [] }],
              ["link", "image", "video"],
              ["clean"],
            ],
            handlers: {
              image: imageHandler,
            },
          },
        }
      });

      // Handle text changes
      quillInstance.current.on("text-change", () => {
        const html = editorRef.current?.querySelector(".ql-editor")?.innerHTML || "";
        onChange(html);
      });
    }

    // Set initial value
    if (quillInstance.current && value !== quillInstance.current.root.innerHTML) {
      quillInstance.current.root.innerHTML = value;
    }
  }, [value, onChange]);

  return <div ref={editorRef} style={{ height: '200px' }} />;
}
