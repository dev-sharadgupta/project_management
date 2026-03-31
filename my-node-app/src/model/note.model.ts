import { NoteTag } from "../entity/noteEntity/NoteTag";
import { MmTagNoteRepo, NoteTagRepo, ProjectNoteRepo } from "../repositories";
import { AddNoteDTO } from "../schemas/addNoteSchema";

const getAllNoteTag = async () => {
    try {
        const tagNote = await MmTagNoteRepo.find();

        return { success: true, message: "Data Found", tag: tagNote };
    } catch (error) {
        console.log('error: ', error);
        return { success: false, message: "Internal Server Error" };
    }
};

const addUpdateNote = async (data: AddNoteDTO) => {

    try {
        let savedNote;

        const noteType: 'General' | 'Target' | 'Task' =
            data.target_id ? 'Target' :
                data.task_id ? 'Task' : 'General';

        if (data.note_id) {
            const existingNote = await ProjectNoteRepo.findOneBy({ id: data.note_id });
            if (!existingNote) {
                return { success: false, message: "Note not found" };
            }

            ProjectNoteRepo.merge(existingNote, {
                project_id: Number(data.project_id),
                target_id: data.target_id,
                task_id: data.task_id,
                title: data.title,
                content: data.content,
                note_type: noteType,
                parent_id: data.parent_id,
                status: 1,
                modified_by: 1,
            });

            savedNote = await ProjectNoteRepo.save(existingNote);

            // Clear old note tag
            await NoteTagRepo.delete({ note_id: data.note_id });
        } else {
            // Create new Note
            const newNote = ProjectNoteRepo.create({
                project_id: Number(data.project_id),
                target_id: data.target_id,
                task_id: data.task_id,
                title: data.title,
                content: data.content,
                note_type: noteType,
                parent_id: data.parent_id,
                status: 1,
                created_by: 1,
                modified_by: 1
            });

            savedNote = await ProjectNoteRepo.save(newNote);
        }
        if (data.tags && data.tags.length > 0) {
            const tags = data.tags.map((tagId) => ({
                note_id: savedNote.id,
                tag_id: tagId,
                status: 1
            }));

            await NoteTagRepo
                .createQueryBuilder()
                .insert()
                .into(NoteTag)
                .values(tags)
                .execute();

        }
        return {
            success: true,
            message: data.note_id ? "Note updated successfully" : "Note added successfully",
            noteId: savedNote.id
        };
    } catch (error) {
        console.error("Insert error:", error);
        return { success: false, message: 'Internal Server Error' };
    }
}


const getProjectsNotes = async (project_id: number) => {
    try {
        const rawNotes = await ProjectNoteRepo
            .createQueryBuilder("note")
            .leftJoin("note.noteTags", "note_tag")
            .leftJoin("note.target", "target")
            .leftJoin("note.task", "task")
            .leftJoin("note_tag.tag", "mm_tag")
            .where("note.project_id = :projectId", { projectId: project_id })
            .select([
                "note.id AS id",
                "note.project_id AS project_id",
                "note.target_id AS target_id",
                "target.title AS target_title",
                "note.task_id AS task_id",
                "task.title AS task_title",
                "note.note_type AS note_type",
                "note.title AS title",
                "note.content AS content",
                "note_tag.tag_id AS tag_id",
                "mm_tag.tag_name AS tag_name",
            ])
            .getRawMany();

        // Use a Map to merge note rows by ID
        const noteMap = new Map<number, any>();

        for (const row of rawNotes) {
            if (!noteMap.has(row.id)) {
                noteMap.set(row.id, {
                    id: row.id,
                    project_id: row.project_id,
                    target_id: row.target_id,
                    target_title: row.target_title,
                    task_id: row.task_id,
                    task_title: row.task_title,
                    note_type: row.note_type,
                    title: row.title,
                    content: row.content,
                    tags: [],
                });
            }

            if (row.tag_id && row.tag_name) {
                const note = noteMap.get(row.id);
                note.tags.push({
                    id: row.tag_id,
                    name: row.tag_name,
                });
            }
        }

        const allNotes = Array.from(noteMap.values());

        // Group by note_type
        const groupedByNoteType = {
            General: [] as any[],
            Target: [] as any[],
            Task: [] as any[],
        };

        const validTypes = ["General", "Target", "Task"];

        for (const note of allNotes) {
            if (validTypes.includes(note.note_type)) {
                groupedByNoteType[note.note_type as keyof typeof groupedByNoteType].push(note);
            }
        }
        return { success: true, message: "Data Found", notes: groupedByNoteType };
    } catch (error) {
        console.error("Error fetching Project Note:", error);
        return { success: false, message: 'Internal Server Error' };
    }
};


const NoteModel = {
    getAllNoteTag,
    addUpdateNote,
    getProjectsNotes,
};
export default NoteModel;