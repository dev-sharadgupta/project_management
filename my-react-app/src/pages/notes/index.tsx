import { useState, useEffect, useMemo } from 'react';
import { Grid2X2Plus, SearchIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { getNoteTypeIcon } from '@/utils/getNoteTypeIcon';
import { useAppSelector } from '@/store/hooks';
import API from '@/lib/axios';
import { toast } from 'sonner';
import { noteSeparatorColorMap } from '@/lib/separatorColor';
import { setCallGetNoteApi } from '@/store/slices/noteSlice';
import { useDispatch } from 'react-redux';
import { Badge } from '@/components/ui/badge';
import { tagColors } from '@/lib/customHelper';
import { CustomComboboxSelect } from '@/components/select/CustomComboboxSelect';
import { useNavigate, useSearchParams } from 'react-router';
import SelectFilterStatus from '@/components/select/SelectFilterStatus';
import { CustomDropdownMenuWithTooltip } from '@/components/dropdown/CustomDropdownMenuWithTooltip';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import type { NoteType } from './core/types';
import { NoteTypeOptions } from './core/constants';

const Notes = () => {
  const { selectedProject } = useAppSelector(state => state.project);
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Note
  const { callGetNoteApi } = useAppSelector(state => state.note);
  const [notes, setNotes] = useState<Record<string, NoteType[]>>({});
  const [searchNote, setSearchNote] = useState('');

  // Target
  const initialTargetId = searchParams.get("target_id") ?? "all";
  const [selectedTargetId, setSelectedTargetId] = useState<number | string>(initialTargetId);
  const [targets, setTargets] = useState([]);
  const allTargets = Object.values(targets).flat();

  // Task
  const initialTaskId = searchParams.get("task_id") ?? "all";
  const [selectedTaskId, setSelectedTaskId] = useState<number | string>(initialTaskId);
  const [tasks, setTasks] = useState([]);
  const allTasks = Object.values(tasks).flat();

  // Filters Types
  const [selectedNoteType, setSelectedNoteType] = useState<string>("all");

  /* ####################### Note - Start ########################## */

  /*************** Start - Get The Project Notes ******************/
  const getProjectNotes = async (projectId: number) => {
    try {
      const response = await API.get('get_projectsNotes', {
        params: { project_id: projectId }
      });

      if (response.data.success && typeof response.data.notes === 'object') {
        setNotes(response.data.notes);
      }
    } catch (error) {
      toast.error('Failed to fetch projects notes');
    }
  }
  /*************** End - Get The Project Notes ******************/


  /*************** Start - Grid View Data ******************/
  const columns = useMemo(() => {

    // Search Note
    const lowerSearch = searchNote.toLowerCase();

    const filteredNotes = Object.entries(notes).reduce((acc, [noteType, noteList]) => {
      // Filter each list based on title,
      let filteredList = noteList.filter((note) =>
        note.title.toLowerCase().includes(lowerSearch)
      );

      //  Apply selectedNoteType filter (target / task / general / all)
      if (selectedNoteType === "target") {
        filteredList = filteredList.filter((note) => note.target_id != null);
      } else if (selectedNoteType === "task") {
        filteredList = filteredList.filter((note) => note.task_id != null);
      } else if (selectedNoteType === "general") {
        filteredList = filteredList.filter((note) => note.task_id == null && note.target_id == null);
      }

      // Filter by selectedTargetId
      if (selectedTargetId !== undefined && selectedTargetId !== "all") {
        filteredList = filteredList.filter(
          (note) => String(note.target_id) === String(selectedTargetId)
        );
      }

      // Filter by selectedTaskId
      if (selectedTaskId !== undefined && selectedTaskId !== "all") {
        filteredList = filteredList.filter(
          (note) => String(note.task_id) === String(selectedTaskId)
        );
      }

      acc[noteType] = filteredList;
      return acc;

    }, {} as typeof notes);


    return Object.entries(filteredNotes).map(([noteType, noteList]) => ({
      type: noteType,
      title: `${noteType} Note`,
      separatorColor: noteSeparatorColorMap[noteType],
      notes: noteList,
    }));
  }, [notes, searchNote, selectedTargetId, selectedTaskId, selectedNoteType]);
  /*************** End - Grid View Data ******************/

  /* ####################### Note - END ########################## */


  /* ####################### Target - START ########################## */

  /* Start - Get Project Targets */
  const getProjectTargets = async (projectId: number) => {
    try {
      const response = await API.get('get_projectsTargets', {
        params: { project_id: projectId }
      });

      if (response.data.success && typeof response.data.targets === 'object') {
        setTargets(response.data.targets);
      }
    } catch (error) {
      toast.error('Failed to fetch projects targets');

    }
  }
  /* End - Get Project Targets */

  /* ####################### Target - END ########################## */


  /* ####################### Task - START ########################## */

  /*************** Start - Get The Project Tasks ******************/
  const getProjectTasks = async (projectId: number) => {
    try {
      const response = await API.get('get_projectsTasks', {
        params: { project_id: projectId }
      });

      if (response.data.success && typeof response.data.tasks === 'object') {
        setTasks(response.data.tasks);
      }
    } catch (error) {
      toast.error('Failed to fetch projects tasks');
    }
  }
  /*************** Start - Get The Project Tasks ******************/

  /* ####################### Task - END ########################## */


  /*************** Start - Use effect for notes ******************/
  useEffect(() => {
    if (!selectedProject?.project_id) return;

    if (callGetNoteApi) {
      dispatch(setCallGetNoteApi(false));
    }
    getProjectNotes(selectedProject.project_id);
    getProjectTargets(selectedProject.project_id);
    getProjectTasks(selectedProject.project_id);
  }, [selectedProject?.project_id, callGetNoteApi, dispatch]);


  useEffect(() => {
    // Handle note type changes
    if (selectedNoteType === "target" && selectedTaskId !== 'all') {
      setSelectedTaskId('all');
    } else if (selectedNoteType === "task" && selectedTargetId !== 'all') {
      setSelectedTargetId('all');
    } else if (selectedNoteType === "general") {
      if (selectedTargetId !== 'all') setSelectedTargetId('all');
      if (selectedTaskId !== 'all') setSelectedTaskId('all');
    }

    // Handle target/task selection changes - auto-set note type only when appropriate
    else if (selectedNoteType === "all") {
      if (selectedTargetId !== 'all' && selectedTaskId === 'all') {
        setSelectedNoteType("target");
      } else if (selectedTaskId !== 'all' && selectedTargetId === 'all') {
        setSelectedNoteType("task");
      }
    }
  }, [selectedNoteType, selectedTargetId, selectedTaskId]);


  /*************** End - Use effect for notes ******************/


  return (
    <>
      <div className="flex sm:flex-row flex-col space-y-2.5 sm:space-y-0 p-6 justify-between">
        {/* Header */}
        <div className='flex items-center gap-2 sm:justify-start justify-center'>
          <h5 className='text-gray-700'>Project Notes</h5>
        </div>

        <div className='flex flex-wrap gap-2 items-center hover:cursor-pointer'>
          <div className='hidden lg:flex items-center relative'>
            <div className='absolute pl-3'>
              <SearchIcon className='size-5 text-gray-400' />
            </div>
            <input
              id='search_note'
              type='text'
              placeholder='Search Note...'
              className='border rounded-md py-[9px] px-2 pl-10 placeholder-gray-400 focus:outline-none text-xs'
              onChange={(e) => setSearchNote(e.target.value)}
            />
          </div>
          <div className='lg:hidden border p-2 rounded-md'>
            <SearchIcon className='size-5 text-gray-400' />
          </div>

          <SelectFilterStatus
            options={NoteTypeOptions}
            value={selectedNoteType}
            onChange={(val) => setSelectedNoteType(val ?? "all")}
          />

          {selectedNoteType === "target" && (
            <CustomComboboxSelect
              placeholder="Select Target"
              value={selectedTargetId}
              onValueChange={(val) => setSelectedTargetId(val || 'all')}
              options={[{ id: "all", title: "All Targets" }, ...allTargets]}
              className="w-35 py-[9px] px-3 text-xs"
              popoverClassName="min-w-[250px] lg:min-w-[300px]"
              disabled={selectedTaskId != 'all'}
              clearable={selectedTargetId !== 'all'}
            />
          )}

          {selectedNoteType === "task" && (
            <CustomComboboxSelect
              placeholder="Select Task"
              value={selectedTaskId}
              onValueChange={(val) => setSelectedTaskId(val || 'all')}
              options={[{ id: "all", title: "All Task" }, ...allTasks]}

              className="w-35 py-[9px] px-3 text-xs"
              popoverClassName="min-w-[250px] lg:min-w-[300px]"
              disabled={selectedTargetId != 'all'}
              clearable={selectedTaskId !== 'all'}
            />
          )}
        </div>
      </div>


      <div className="px-0 py-1">
        {Array.isArray(columns) && columns.some(col => col.notes.length > 0) ? (
          <div
            className={`grid px-6 py-1 gap-8 
              ${['general', 'target', 'task'].includes(selectedNoteType) ||
                selectedTargetId !== 'all' ||
                selectedTaskId !== 'all'
                ? 'grid-cols-1'
                : 'grid-cols-1 lg:grid-cols-3'
              }`}
          >
            {columns
              .filter((column) => {
                if (selectedNoteType === 'target') return column.type === 'Target';
                if (selectedNoteType === 'task') return column.type === 'Task';
                if (selectedNoteType === 'general') return column.type === 'General';
                return true;
              })
              .map((column) => (
                <div key={column.type}>
                  {/* Column Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 items-center">
                      {getNoteTypeIcon(column.type)}
                      <h6>{column.title}</h6>
                      <span className="font-semibold text-sm text-gray-400">
                        {column.notes.length}
                      </span>
                    </div>
                  </div>

                  <Separator className={`${column.separatorColor} my-1.5 py-[1.5px]`} />

                  <div className="py-5 space-y-5">
                    {column.notes.map((note) => (
                      <Card
                        key={note.id}
                        className="py-5 h-auto max-h-[350px] cursor-pointer hover:border-blue-400"
                      >
                        <CardHeader>
                          <div className="flex justify-between items-center">
                            <h5 className="mt-2">{note.title}</h5>


                            {/* Action Button */}
                            {note.note_type != 'General' && (
                              <CustomDropdownMenuWithTooltip
                                tooltip="More actions"
                                trigger={
                                  <Grid2X2Plus className="w-8 h-8 rounded-sm p-2 cursor-pointer bg-gray-100 hover:bg-blue-400 hover:text-white text-gray-400" />
                                }
                                align="end"
                                side="bottom"
                                sideOffset={5}
                                dropdownLabel="Actions"
                                className="w-30 text-center"

                              >
                                {note.note_type == 'Target' && (
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/dashboard?page=targets&target_id=${note.target_id}`);
                                  }}>
                                    <div className="w-full">
                                      View Target
                                    </div>
                                  </DropdownMenuItem>
                                )}
                                {note.note_type == 'Task' && (
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation()
                                    navigate(`/dashboard?page=tasks&task_id=${note.task_id}`);
                                  }}>
                                    <div className="w-full">
                                      View Task
                                    </div>
                                  </DropdownMenuItem>
                                )}
                              </CustomDropdownMenuWithTooltip>
                            )}
                          </div>
                          <Separator className="py-[1.5px] bg-amber-400" />
                        </CardHeader>

                        <CardContent className="max-h-[200px]">
                          <div
                            className="line-clamp-8"
                            dangerouslySetInnerHTML={{
                              __html: note.content.replace(/style="[^"]*"/g, ''),
                            }}
                          ></div>
                        </CardContent>

                        <CardFooter className="justify-between">
                          <div className="flex flex-wrap gap-2 mt-2">
                            {note.tags.map((tag) => (
                              <Badge
                                key={tag.id}
                                size="xs"
                                fontSize="xs"
                                className={`${tagColors[tag.id] ?? 'bg-gray-100 text-gray-600'}`}
                              >
                                {tag.name}
                              </Badge>
                            ))}
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-16 text-lg font-medium">
            No Note found
          </div>
        )}
      </div >


    </>
  );
};

export default Notes; 