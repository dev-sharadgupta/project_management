import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../userEntity/UserMaster";
import { ProjectTask } from "../projectEntity/ProjectTask";

@Entity("task_members")
export class TaskMember {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  task_id!: number;

  @Column()
  user_id!: number;

  @ManyToOne(() => ProjectTask, (task) => task.members)
  @JoinColumn({ name: "task_id" })
  task!: ProjectTask;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column()
  status!: number;
}
