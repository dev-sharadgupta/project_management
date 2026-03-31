import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { ProjectMaster } from "./ProjectMaster";

@Entity("mm_status_project")
export class ProjectStatus {
    @PrimaryColumn()
    status_id!: number;

    @Column()
    status_name!: string;

    @OneToMany(() => ProjectMaster, (p) => p.statusInfo)
    projects!: ProjectMaster[];
}