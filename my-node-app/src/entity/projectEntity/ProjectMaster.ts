import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { ProjectStatus } from "./ProjectStatus";
import { ProjectOwner } from "./ProjectOwner";
import { ProjectMember } from "./ProjectMember";
import { User } from "../userEntity/UserMaster";

@Entity("project_master")
export class ProjectMaster {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 50 }) // same as { type: 'varchar', length: 50 }
    title!: string;

    @Column({ length: 50 })
    summary!: string;

    @Column({ type: 'text' })
    description!: string;

    @Column({ type: 'date' })
    start_date!: Date;

    @Column({ type: 'date' })
    end_date!: Date;

    @Column()
    owner_id!: number;

    @Column()
    project_status!: number;

    @Column()
    status!: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created!: Date;

    @Column()
    created_by!: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    modified!: Date;

    @Column()
    modified_by!: number;

    @ManyToOne(() => ProjectStatus, (status) => status.projects)
    @JoinColumn({ name: "project_status" })
    statusInfo!: ProjectStatus;

    @ManyToOne(() => User)
    @JoinColumn({ name: "owner_id" })
    owner!: User;

    @OneToMany(() => ProjectMember, (pm) => pm.project)
    members!: ProjectMember[];
}
