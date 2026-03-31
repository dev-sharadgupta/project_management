import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProjectMaster } from "./ProjectMaster";

@Entity("project_owner")
export class ProjectOwner {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    owner_name!: string;

    @Column()
    pic!: string;

    @OneToMany(() => ProjectMaster, (p) => p.owner)
    projects!: ProjectMaster[];
}