import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { ProjectMember } from "../projectEntity/ProjectMember";

@Entity("user_master")
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    full_name!: string;

    @Column({ nullable: true })
    image!: string;

    @Column()
    email!: string;

    @Column()
    status!: number

    @OneToMany(() => ProjectMember, (ProjectMember) => ProjectMember.user)
    projectMembers!: ProjectMember[];
}