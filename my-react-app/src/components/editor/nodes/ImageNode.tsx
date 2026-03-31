import {
    type DOMConversionMap,
    type DOMConversionOutput,
    type DOMExportOutput,
    type EditorConfig,
    type LexicalNode,
    type NodeKey,
    type Spread,
    type SerializedLexicalNode,
    DecoratorNode,
} from 'lexical';
import React from 'react';
import { ImageComponent } from '@/components/editor/nodes/ImageComponent';

export interface ImagePayload {
    src: string;
    alt?: string;
    width?: string | number;
    height?: string | number;
    maxWidth?: string | number;
}

export type SerializedImageNode = Spread<
    {
        src: string;
        alt?: string;
        width?: string | number;
        height?: string | number;
        maxWidth?: string | number;
    },
    SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<React.JSX.Element> {
    __src: string;
    __alt: string;
    __width: string | number;
    __height: string | number;
    __maxWidth: string | number;

    static getType(): string {
        return 'image';
    }

    static clone(node: ImageNode): ImageNode {
        return new ImageNode(
            node.__src,
            node.__alt,
            node.__width,
            node.__height,
            node.__maxWidth,
            node.__key
        );
    }

    constructor(
        src: string,
        alt?: string,
        width?: string | number,
        height?: string | number,
        maxWidth?: string | number,
        key?: NodeKey
    ) {
        super(key);
        this.__src = src;
        this.__alt = alt || '';
        this.__width = width || 'auto';
        this.__height = height || 'auto';
        this.__maxWidth = maxWidth || '100%';
    }

    createDOM(config: EditorConfig): HTMLElement {
        const span = document.createElement('span');
        span.style.display = 'inline-block';
        span.style.maxWidth = '100%';
        return span;
    }

    updateDOM(): false {
        return false;
    }

    static importDOM(): DOMConversionMap | null {
        return {
            img: (domNode: HTMLElement) => {
                const imgElement = domNode as HTMLImageElement;
                if (imgElement.hasAttribute('src')) {
                    return {
                        conversion: $convertImageElement,
                        priority: 0,
                    };
                }
                return null;
            },
        };
    }

    static importJSON(serializedNode: SerializedImageNode): ImageNode {
        const { src, alt, width, height, maxWidth } = serializedNode;
        return $createImageNode({
            src,
            alt,
            width,
            height,
            maxWidth,
        });
    }

    exportJSON(): SerializedImageNode {
        return {
            src: this.__src,
            alt: this.__alt,
            width: this.__width,
            height: this.__height,
            maxWidth: this.__maxWidth,
            type: 'image',
            version: 1,
        };
    }

    exportDOM(): DOMExportOutput {
        const element = document.createElement('img');
        element.setAttribute('src', this.__src);
        element.setAttribute('alt', this.__alt);
        element.style.width = typeof this.__width === 'number' ? `${this.__width}px` : this.__width;
        element.style.height = typeof this.__height === 'number' ? `${this.__height}px` : this.__height;
        element.style.maxWidth = typeof this.__maxWidth === 'number' ? `${this.__maxWidth}px` : this.__maxWidth;
        return { element };
    }

    setWidthAndHeight(width: string | number, height: string | number): void {
        const writable = this.getWritable();
        writable.__width = width;
        writable.__height = height;
    }

    decorate(): React.JSX.Element {
        return (
            <ImageComponent
                src={this.__src}
                alt={this.__alt}
                width={this.__width}
                height={this.__height}
                maxWidth={this.__maxWidth}
                nodeKey={this.getKey()} // pass the nodeKey
            />
        );
    }


    isInline(): boolean {
        return false;
    }

    isKeyboardSelectable(): boolean {
        return true;
    }
}

function $convertImageElement(domNode: HTMLElement): DOMConversionOutput {
    const img = domNode as HTMLImageElement;
    const { src, alt } = img;

    return {
        node: $createImageNode({
            src,
            alt,
            width: 100, // Thumbnail width
            height: 'auto',
            maxWidth: '100%',
        }),
    };
}

export function $createImageNode(payload: ImagePayload): ImageNode {
    return new ImageNode(
        payload.src,
        payload.alt,
        payload.width,
        payload.height,
        payload.maxWidth
    );
}

export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
    return node instanceof ImageNode;
}