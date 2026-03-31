import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../userEntity/UserMaster";
import { ProjectTarget } from "../projectEntity/ProjectTarget";

@Entity("target_members")
export class TargetMember {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  target_id!: number;

  @Column()
  user_id!: number;

  @ManyToOne(() => ProjectTarget, (target) => target.members)
  @JoinColumn({ name: "target_id" })
  target!: ProjectTarget;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column()
  status!: number;
}
