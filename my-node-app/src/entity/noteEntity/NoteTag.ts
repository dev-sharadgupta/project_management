import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProjectNote } from "../projectEntity/ProjectNote";
import { MmTagNote } from "./MmTagNote";

@Entity("note_tags")
export class NoteTag {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  note_id!: number;

  @Column()
  tag_id!: number;

  @Column()
  status!: number;

  @ManyToOne(() => ProjectNote, (note) => note.noteTags)
  @JoinColumn({ name: "note_id" })
  note!: ProjectNote;

  @ManyToOne(() => MmTagNote, (tag) => tag.noteTags)
  @JoinColumn({ name: "tag_id" })
  tag!: MmTagNote;

}

