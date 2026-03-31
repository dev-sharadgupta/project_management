import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { NoteTag } from "./NoteTag";

@Entity("mm_tags_note")
export class MmTagNote {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 50 })
    tag_name!: string;

    @OneToMany(() => NoteTag, (noteTag) => noteTag.tag)
    noteTags!: NoteTag[];
}
