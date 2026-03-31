import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import {
  type Klass,
  type LexicalNode,
  type LexicalNodeReplacement,
  ParagraphNode,
  TextNode,
} from "lexical"
import { ListNode, ListItemNode } from '@lexical/list';
import { ImageNode } from "../editor/nodes/ImageNode";
export const nodes: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement> =
  [
    HeadingNode,
    ParagraphNode,
    TextNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    ImageNode,
  ]
