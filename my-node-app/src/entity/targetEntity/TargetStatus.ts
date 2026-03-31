import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProjectTarget } from "../projectEntity/ProjectTarget";

@Entity("mm_status_target")
export class MmStatusTarget {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 50 })
    status_name!: string;

    @OneToMany(() => ProjectTarget, (status) => status.statusInfo)
    targets!: ProjectTarget[];
}