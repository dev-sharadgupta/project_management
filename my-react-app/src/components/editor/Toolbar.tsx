import { useState, useCallback, useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    FORMAT_TEXT_COMMAND,
    SELECTION_CHANGE_COMMAND,
    $getSelection,
    $isRangeSelection,
    UNDO_COMMAND,
    REDO_COMMAND,
    type TextFormatType,
    PASTE_COMMAND,
    $insertNodes,
} from 'lexical';
import {
    $isListNode,
    REMOVE_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    INSERT_ORDERED_LIST_COMMAND,
} from '@lexical/list'
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Code,
    List,
    ListOrdered,
    Undo2,
    Redo2,
    Paperclip,
    Image,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { $createImageNode } from '@/components/editor/nodes/ImageNode'

export default function Toolbar() {
    const [blockType, setBlockType] = useState<string | null>(null);
    const [editor] = useLexicalComposerContext();
    const [activeFormats, setActiveFormats] = useState({
        bold: false,
        italic: false,
        underline: false,
        strikethrough: false,
        code: false,
    });

    const updateToolbar = useCallback(() => {
        editor.getEditorState().read(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                setActiveFormats({
                    bold: selection.hasFormat('bold'),
                    italic: selection.hasFormat('italic'),
                    underline: selection.hasFormat('underline'),
                    strikethrough: selection.hasFormat('strikethrough'),
                    code: selection.hasFormat('code'),
                });

                const anchor = selection.anchor.getNode();
                const topLevel = anchor.getTopLevelElementOrThrow();

                if ($isListNode(topLevel)) {
                    setBlockType(topLevel.getTag()); // 'ul' or 'ol'
                } else {
                    setBlockType(null); // Not in a list
                }
            }
        });
    }, [editor]);


    // Handle image paste
    const handlePaste = useCallback((event: ClipboardEvent) => {
        const clipboardData = event.clipboardData;
        if (!clipboardData) return false;

        const items = Array.from(clipboardData.items);
        const imageItem = items.find(item => item.type.startsWith('image/'));

        if (imageItem) {
            event.preventDefault();
            const file = imageItem.getAsFile();
            if (file) {
                handleImageFile(file);
            }
            return true;
        }

        return false;
    }, []);

    useEffect(() => {
        return editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            () => {
                updateToolbar();
                return false;
            },
            1
        );
    }, [editor, updateToolbar]);

    useEffect(() => {
        return editor.registerCommand(
            PASTE_COMMAND,
            (event: ClipboardEvent) => {
                return handlePaste(event);
            },
            1
        );
    }, [editor, handlePaste]);


    useEffect(() => {
        updateToolbar();
    }, [updateToolbar]);


    const handleFormatClick = (format: TextFormatType) => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
        editor.focus(); // Ensure editor stays focused

        // Update toolbar state after a brief delay
        setTimeout(() => {
            updateToolbar();
        }, 10);
    };

    // Keep this for non-formatting buttons
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
    };

    // Convert image file to data URL and insert
    const handleImageFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result as string;
            editor.update(() => {
                const imageNode = $createImageNode({
                    src: dataUrl,
                    alt: file.name,
                    width: 'auto',
                    height: 'auto',
                });
                $insertNodes([imageNode]);
            });
        };
        reader.readAsDataURL(file);
    };

    const handleImageUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = () => {
            const file = input.files?.[0];
            if (file) {
                handleImageFile(file);
            }
        };
        input.click();
    };

    return (
        <div className="flex items-center gap-1 p-2 border-b bg-muted">
            <Button
                size="sm"
                variant={activeFormats.bold ? 'default' : 'ghost'}
                onClick={() => handleFormatClick('bold')}
                className="h-8 w-8 p-0"
                title="Bold (Ctrl+B)"
            >
                <Bold size={14} />
            </Button>
            <Button
                size="sm"
                variant={activeFormats.italic ? 'default' : 'ghost'}
                onClick={() => handleFormatClick('italic')}
                className="h-8 w-8 p-0"
                title="Italic (Ctrl+I)"
            >
                <Italic size={14} />
            </Button>
            <Button
                size="sm"
                variant={activeFormats.underline ? 'default' : 'ghost'}
                onClick={() => handleFormatClick('underline')}
                className="h-8 w-8 p-0"
                title="Underline (Ctrl+U)"
            >
                <Underline size={14} />
            </Button>
            <Button
                size="sm"
                variant={activeFormats.strikethrough ? 'default' : 'ghost'}
                onClick={() => handleFormatClick('strikethrough')}
                className="h-8 w-8 p-0"
                title="Strikethrough"
            >
                <Strikethrough size={14} />
            </Button>
            <Button
                size="sm"
                variant={activeFormats.code ? 'default' : 'ghost'}
                onClick={() => handleFormatClick('code')}
                className="h-8 w-8 p-0"
                title="Code"
            >
                <Code size={14} />
            </Button>
            <Button
                size="sm"
                variant={blockType === 'ul' ? 'default' : 'ghost'}
                onClick={() => {
                    if (blockType === 'ul') {
                        editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
                    } else {
                        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
                    }
                }}
                onMouseDown={handleMouseDown}
                className="h-8 w-8 p-0"
                title="Bullet List"
            >
                <List size={14} />
            </Button>

            <Button
                size="sm"
                variant={blockType === 'ol' ? 'default' : 'ghost'}
                onClick={() => {
                    if (blockType === 'ol') {
                        editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
                    } else {
                        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
                    }
                }}
                onMouseDown={handleMouseDown}
                className="h-8 w-8 p-0"
                title="Numbered List"
            >
                <ListOrdered size={14} />
            </Button>

            <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
                onMouseDown={handleMouseDown}
                className="h-8 w-8 p-0"
                title="Undo"
            >
                <Undo2 size={14} />
            </Button>
            <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
                onMouseDown={handleMouseDown}
                className="h-8 w-8 p-0"
                title="Redo"
            >
                <Redo2 size={14} />
            </Button>
            <Button
                size="sm"
                variant="ghost"
                onClick={handleImageUpload}
                onMouseDown={handleMouseDown}
                className="h-8 w-8 p-0"
                title="Insert Image"
            >
                <Image size={14} />
            </Button>
            <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.onchange = () => {
                        const file = input.files?.[0];
                        if (file) {
                            alert(`Attached: ${file.name}`);
                            // TODO: Replace with actual image/file upload + insertion logic
                        }
                    };
                    input.click();
                }}
                onMouseDown={handleMouseDown}
                className="h-8 w-8 p-0"
                title="Attach File"
            >
                <Paperclip size={14} />
            </Button>
        </div>
    );
}