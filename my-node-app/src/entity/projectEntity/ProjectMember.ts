import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProjectMaster } from "./ProjectMaster";
import { User } from "../userEntity/UserMaster";

@Entity("project_members")
export class ProjectMember {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  project_id!: number;

  @Column()
  user_id!: number;

  @ManyToOne(() => ProjectMaster, (project) => project.members)
  @JoinColumn({ name: "project_id" })
  project!: ProjectMaster;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column()
  status!: number;
}
