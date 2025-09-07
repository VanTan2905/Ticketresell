import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, Italic, Underline, Strikethrough, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify, ChevronDown,
  List, ListOrdered, IndentIncrease, IndentDecrease 
} from 'lucide-react';

interface RichTextEditorProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ name, value, onChange }) => {
  const [selectedFormat, setSelectedFormat] = useState<string>('Paragraph');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [activeFormats, setActiveFormats] = useState<{ [key: string]: boolean }>({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
  });
  
  const editorRef = useRef<HTMLDivElement | null>(null);

  const formats = [
    "Paragraph", "Heading 1", "Heading 2", "Heading 3",
    "Heading 4", "Heading 5", "Heading 6", "Preformatted"
  ];

  const handleFormat = (command: string, value: string | undefined = undefined) => {
    if (editorRef.current) {
      document.execCommand(command, false, value);
      editorRef.current.focus();
      handleContentChange(); 
      updateActiveFormats(); 

      // Update formatting state
      setActiveFormats({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        strikethrough: document.queryCommandState('strikeThrough'),
      });
    }
  };

  const handleFormatBlock = (format: string) => {
    let tag: string;
    switch (format) {
      case 'Heading 1': tag = 'h1'; break;
      case 'Heading 2': tag = 'h2'; break;
      case 'Heading 3': tag = 'h3'; break;
      case 'Heading 4': tag = 'h4'; break;
      case 'Heading 5': tag = 'h5'; break;
      case 'Heading 6': tag = 'h6'; break;
      case 'Preformatted': tag = 'pre'; break;
      default: tag = 'p';
    }

    handleFormat('formatBlock', tag);
    setSelectedFormat(format);
    setIsDropdownOpen(false);
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      const mockEvent = {
        target: {
          name,
          value: content,
        } as HTMLTextAreaElement 
      };
      onChange(mockEvent as React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>); 
    }
  };

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value; // Update innerHTML only if content has changed
    }
    updateActiveFormats();
  }, [value]);

  const updateActiveFormats = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      setActiveFormats({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        strikethrough: document.queryCommandState('strikeThrough'),
      });
    }
  };

  return (
    <div className="w-full border rounded-md">
      <div className="border-b p-2 flex items-center space-x-1 flex-wrap bg-gray-50">
        <div className="relative mr-2">
          <button
            className="px-3 py-1 border rounded-md flex items-center"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedFormat}
            <ChevronDown className="ml-1 h-4 w-4" />
          </button>
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-40 bg-white border rounded-md shadow-lg z-10">
              {formats.map((format) => (
                <button
                  key={format}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => handleFormatBlock(format)}
                >
                  {format}
                </button>
              ))}
            </div>
          )}
        </div>

        <button className={`p-2 hover:bg-gray-200 rounded-md ${activeFormats.bold ? 'bg-gray-300' : ''}`} onClick={() => handleFormat('bold')}>
          <Bold className="h-4 w-4" />
        </button>
        <button className={`p-2 hover:bg-gray-200 rounded-md ${activeFormats.italic ? 'bg-gray-300' : ''}`} onClick={() => handleFormat('italic')}>
          <Italic className="h-4 w-4" />
        </button>
        <button className={`p-2 hover:bg-gray-200 rounded-md ${activeFormats.underline ? 'bg-gray-300' : ''}`} onClick={() => handleFormat('underline')}>
          <Underline className="h-4 w-4" />
        </button>
        <button className={`p-2 hover:bg-gray-200 rounded-md ${activeFormats.strikethrough ? 'bg-gray-300' : ''}`} onClick={() => handleFormat('strikeThrough')}>
          <Strikethrough className="h-4 w-4" />
        </button>

        <div className="h-4 w-px bg-gray-300 mx-2" />

        <button className="p-2 hover:bg-gray-200 rounded-md" onClick={() => handleFormat('justifyLeft')}>
          <AlignLeft className="h-4 w-4" />
        </button>
        <button className="p-2 hover:bg-gray-200 rounded-md" onClick={() => handleFormat('justifyCenter')}>
          <AlignCenter className="h-4 w-4" />
        </button>
        <button className="p-2 hover:bg-gray-200 rounded-md" onClick={() => handleFormat('justifyRight')}>
          <AlignRight className="h-4 w-4" />
        </button>
        <button className="p-2 hover:bg-gray-200 rounded-md" onClick={() => handleFormat('justifyFull')}>
          <AlignJustify className="h-4 w-4" />
        </button>

        <div className="h-4 w-px bg-gray-300 mx-2" />

        <button className="p-2 hover:bg-gray-200 rounded-md" onClick={() => handleFormat('insertUnorderedList')}>
          <List className="h-4 w-4" />
        </button>
        <button className="p-2 hover:bg-gray-200 rounded-md" onClick={() => handleFormat('insertOrderedList')}>
          <ListOrdered className="h-4 w-4" />
        </button>
        <button className="p-2 hover:bg-gray-200 rounded-md" onClick={() => handleFormat('outdent')}>
          <IndentDecrease className="h-4 w-4" />
        </button>
        <button className="p-2 hover:bg-gray-200 rounded-md" onClick={() => handleFormat('indent')}>
          <IndentIncrease className="h-4 w-4" />
        </button>
      </div>

      {/* Increase height for unlimited characters */}
      <div
        ref={editorRef}
        className="p-4 min-h-[200px] border border-gray-300 h-auto"
        contentEditable
        suppressContentEditableWarning
        onInput={handleContentChange}
      />
    </div>
  );
};

export default RichTextEditor;
