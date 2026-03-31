import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from "typeorm";
import { ProjectMaster } from "./ProjectMaster";
import { ProjectTarget } from "./ProjectTarget";
import { ProjectTask } from "./ProjectTask";
import { User } from "../userEntity/UserMaster";
import { NoteTag } from "../noteEntity/NoteTag";

@Entity("project_notes")
export class ProjectNote {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    project_id!: number;

    @Column({ nullable: true })
    target_id?: number;

    @Column({ nullable: true })
    task_id?: number;

    @Column({ type: 'enum', enum: ['General', 'Target', 'Task'] })
    note_type!: 'General' | 'Target' | 'Task';

    @Column({ length: 50 })
    title!: string;

    @Column({ type: 'text' })
    content!: string;

    @Column({ nullable: true })
    parent_id?: number;

    @Column()
    status!: number;

    @CreateDateColumn({ type: 'timestamp' })
    created!: Date;

    @Column()
    created_by!: number;

    @UpdateDateColumn({ type: 'timestamp' })
    modified!: Date;

    @Column()
    modified_by!: number;

    @ManyToOne(() => ProjectMaster)
    @JoinColumn({ name: "project_id" })
    project!: ProjectMaster;

    @ManyToOne(() => ProjectTarget, { nullable: true })
    @JoinColumn({ name: "target_id" })
    target?: ProjectTarget;

    @ManyToOne(() => ProjectTask, { nullable: true })
    @JoinColumn({ name: "task_id" })
    task?: ProjectTask;

    @OneToMany(() => NoteTag, (noteTag) => noteTag.note)
    noteTags!: NoteTag[];

    @ManyToOne(() => ProjectNote, { nullable: true })
    @JoinColumn({ name: "parent_id" })
    parent?: ProjectNote;

    @ManyToOne(() => User)
    @JoinColumn({ name: "created_by" })
    createdBy!: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: "modified_by" })
    modifiedBy!: User;
}
