import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProjectTarget } from "../projectEntity/ProjectTarget";

@Entity("mm_priority_target")
export class MmPriorityTarget {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 50 })
    priority_name!: string;

    @OneToMany(() => ProjectTarget, (target) => target.priorityInfo)
    targets!: ProjectTarget[];
}