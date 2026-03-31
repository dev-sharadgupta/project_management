import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProjectTask } from "../projectEntity/ProjectTask";

@Entity("mm_status_task")
export class MmStatusTask {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 50 })
    status_name!: string;

    @OneToMany(() => ProjectTask, (status) => status.statusInfo)
    tasks!: ProjectTask[];
}