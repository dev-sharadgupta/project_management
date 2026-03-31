import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProjectTask } from "../projectEntity/ProjectTask";

@Entity("mm_priority_task")
export class MmPriorityTask {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 50 })
    priority_name!: string;

    @OneToMany(() => ProjectTask, (task) => task.priorityInfo)
    tasks!: ProjectTask[];
}