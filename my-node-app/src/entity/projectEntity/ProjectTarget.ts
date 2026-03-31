import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { ProjectMaster } from "./ProjectMaster";
import { MmPriorityTarget } from "../targetEntity/TargetPriority";
import { MmStatusTarget } from "../targetEntity/TargetStatus";
import { TargetMember } from "../targetEntity/TargetMember";
import { User } from "../userEntity/UserMaster";

@Entity("project_targets")
export class ProjectTarget {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    project_id!: number;

    @Column({ length: 50 })
    title!: string;

    @Column({ type: 'text' })
    description!: string;

    @Column({ type: 'date' })
    start_date!: Date;

    @Column({ type: 'date' })
    due_date!: Date;

    @Column()
    owner_id!: number;

    @Column()
    priority!: number;

    @Column()
    status!: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created!: Date;

    @Column()
    created_by!: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    modified!: Date;

    @Column()
    modified_by!: number;

    @ManyToOne(() => ProjectMaster)
    @JoinColumn({ name: "project_id" })
    project!: ProjectMaster;

    @ManyToOne(() => MmPriorityTarget)
    @JoinColumn({ name: "priority" })
    priorityInfo!: MmPriorityTarget;

    @ManyToOne(() => User)
    @JoinColumn({ name: "owner_id" })
    owner!: User;

    @ManyToOne(() => MmStatusTarget)
    @JoinColumn({ name: 'status' })
    statusInfo!: MmStatusTarget;

    @OneToMany(() => TargetMember, (tm) => tm.target)
    members!: TargetMember[];
}
