import { CustomDialog } from '@/components/dialog/CustomDialog';
import { CustomFormField } from '@/components/form/CustomFormField';
import { QuillRichTextEditor } from '@/components/richtexteditor/QuillRichTextEditor';
import { CustomComboboxSelect } from '@/components/select/CustomComboboxSelect';
import { Form } from '@/components/ui/form';
import { tagColors } from '@/lib/customHelper';
import { useAppDispatch } from '@/store/hooks';
import { setShowAddNote } from "@/store/slices/projectSlice";
import type { TargetType } from '@/types/target';
import type { TaskType } from '@/types/task';

import React, { useEffect } from 'react';

interface AddNoteDialogProps {
    showAddNote: boolean;
    noteForm: any;
    handleAddNote: (values: any) => void;
    allTargets: any[];
    allTasks: any[];
    watchedTargetId?: number | null;
    watchedTaskId?: number | null;
    noteTag: any[];
    selectedNoteTask?: TaskType | null;
    selectedNoteTarget?: TargetType | null;
}

const AddNoteDialog: React.FC<AddNoteDialogProps> = ({
    showAddNote,
    noteForm,
    handleAddNote,
    allTargets,
    allTasks,
    watchedTargetId,
    watchedTaskId,
    noteTag,
    selectedNoteTarget,
    selectedNoteTask,
}) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (showAddNote) {
            noteForm.reset({
                target_id: selectedNoteTarget?.id || undefined,
                task_id: selectedNoteTask?.id || undefined,
                title: "",
                content: "",
                tags: [],
            });
        }
    }, [showAddNote, selectedNoteTask?.id, noteForm]);

    return (
        <CustomDialog
            open={showAddNote}
            onOpenChange={(open) => {
                // dispatch(setShowAddNote(open));
                if (!open) {
                    noteForm.reset();
                }
            }}
            title="Add Note"
            description="Add Note to your target, task or general"
            onConfirm={noteForm.handleSubmit(handleAddNote)}
            onCancel={() => {
                noteForm.reset();
                dispatch(setShowAddNote(false));
            }}
        >
            <Form {...noteForm}>
                <form onSubmit={noteForm.handleSubmit(handleAddNote)}>
                    <div className="grid flex-1 auto-rows-min gap-6">
                        {/* Select Target */}
                        <CustomFormField
                            form={noteForm}
                            name="target_id"
                            label="Select Target"
                            renderInput={(field) => (
                                <CustomComboboxSelect
                                    {...field}
                                    placeholder="Select Target"
                                    value={String(field.value ?? '')}
                                    onValueChange={(val) => field.onChange(Number(val))}
                                    options={allTargets}
                                    disabled={!!watchedTaskId}
                                    clearable
                                />
                            )}
                        />

                        {/* Select Task */}
                        <CustomFormField
                            form={noteForm}
                            name="task_id"
                            label="Select Task"
                            renderInput={(field) => (
                                <CustomComboboxSelect
                                    {...field}
                                    placeholder="Select Task"
                                    value={String(field.value ?? '')}
                                    onValueChange={(val) => field.onChange(Number(val))}
                                    options={allTasks}
                                    disabled={!!watchedTargetId}
                                    clearable
                                />
                            )}
                        />

                        {/* Note title */}
                        <CustomFormField
                            form={noteForm}
                            name="title"
                            label="Note Title"
                            required
                            renderInput={(field) => (
                                <input
                                    id="note_title"
                                    tabIndex={0}
                                    placeholder="Enter Task Title"
                                    className="py-2 px-4 border rounded-md placeholder:text-sm"
                                    autoComplete="off"
                                    {...field}
                                />
                            )}
                        />

                        {/* Note content */}
                        <CustomFormField
                            form={noteForm}
                            name="content"
                            label="Note Content"
                            required
                            renderInput={(field) => (
                                <QuillRichTextEditor
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />

                        {/* Tags */}
                        <CustomFormField
                            form={noteForm}
                            name="tags"
                            label="Tags"
                            renderInput={(field) => {
                                const selectedTags: number[] = field.value || [];

                                return (
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {noteTag.map((tag) => {
                                            const isSelected = selectedTags.includes(tag.id);

                                            const toggleTag = () => {
                                                const newTags = isSelected
                                                    ? selectedTags.filter((t) => t !== tag.id)
                                                    : [...selectedTags, tag.id];

                                                field.onChange(newTags);
                                            };

                                            return (
                                                <button
                                                    key={tag.id}
                                                    type="button"
                                                    onClick={toggleTag}
                                                    className={`px-4 py-1 rounded-full text-sm border font-medium transition-colors ${isSelected
                                                        ? tagColors[tag.id] ||
                                                        'bg-blue-100 text-blue-800 border-blue-200'
                                                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    {tag.tag_name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                );
                            }}
                        />
                    </div>
                </form>
            </Form>
        </CustomDialog>
    );
};

export default AddNoteDialog;
