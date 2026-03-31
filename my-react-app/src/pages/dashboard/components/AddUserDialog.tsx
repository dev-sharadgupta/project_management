import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X, CheckIcon, SearchIcon, XIcon } from "lucide-react";
import { useState } from "react";

interface AddUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    searchUser: string;
    setSearchUser: (val: string) => void;
    filteredUsers: any[];
    selectedUser: any[];
    handleUserToggle: (user: any) => void;
    handleCancel: () => void;
    handleConfirm: () => void;
    handleRemoveAllUser :() => void;
}

const AddUserDialog = ({
    open,
    onOpenChange,
    searchUser,
    setSearchUser,
    filteredUsers,
    selectedUser,
    handleUserToggle,
    handleCancel,
    handleConfirm,
    // handleRemoveAllUser,
}: AddUserDialogProps) => {
    const [hoveredUserId, setHoveredUserId] = useState<number | null>(null);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-h-[100vh] overflow-y-auto ">
                <DialogHeader>
                    <DialogTitle className="text-center !text-[22px] !font-semibold">Search Users</DialogTitle>
                    <DialogDescription className="text-center text-gray-400 text-base font-semibold">Invite Collaborators To Your Project</DialogDescription>
                </DialogHeader>
                <div className="relative my-4 px-4 flex items-center bg-[#f9f9f9] hover:bg-gray-100  rounded-md h-10">
                    <SearchIcon className="absolute text-gray-500 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by username, full name or email..."
                        value={searchUser}
                        onChange={(e) => setSearchUser(e.target.value)}
                        className="w-full focus:outline-none px-6 py-3 text-sm font-semibold text-gray-600  rounded-md h-10" />
                </div>
                <div className="px-4 space-y-4 max-h-[35vh] min-h-[25vh] overflow-y-auto scroll-smooth">
                    {filteredUsers.map((user) => {
                        const isSelected = selectedUser.find(u => u.id === user.id);
                        const isHovered = hoveredUserId === user.id;
                        return (
                            <div
                                key={user.id}
                                onClick={() => handleUserToggle(user)}
                                onMouseEnter={() => setHoveredUserId(user.id)}
                                onMouseLeave={() => setHoveredUserId(null)}

                                className={`flex  items-center pl-3 pr-3 gap-4 rounded-lg cursor-pointer transition-colors
                                    
                                    ${isSelected
                                        ?
                                        isHovered
                                            ? 'bg-red-50 border-2 border-red-200'
                                            : 'bg-blue-50 border-2 border-blue-200'
                                        : 'hover:bg-gray-100 border-2 border-transparent'
                                    }
                                    }`
                                }>
                                <Avatar className="h-10 w-10">
                                    {user.image ? (
                                        <AvatarImage src={user.image} alt={user.full_name} />
                                    ) : (
                                        <AvatarFallback>{user.full_name.charAt(0)}</AvatarFallback>
                                    )}
                                </Avatar>
                                <div>
                                    <p className="font-medium">{user.full_name}</p>
                                    <span className="text-sm text-muted-foreground py-0.5 rounded-md">
                                        {user.email}
                                    </span>
                                </div>
                                {isSelected && (
                                    isHovered ? (
                                        <div className="flex ml-auto bg-red-400 rounded-full">
                                            <XIcon className="w-6 h-6 px-1 text-white" />
                                        </div>

                                    ) : (
                                        <div className="flex ml-auto bg-blue-500 rounded-full">
                                            <CheckIcon className="w-6 h-6 px-1 text-white" />
                                        </div>
                                    ))
                                }
                            </div>
                        );
                    }
                    )}
                </div>
                {selectedUser.length > 0 && (
                    <div className="">
                        <p className="text-gray-500 mb-2 text-sm">Selected : {selectedUser.length} user{selectedUser.length !== 1 ? 's' : ''}</p>
                        <div className="flex flex-wrap gap-2">
                            {selectedUser.map((user) => (
                                <span
                                    key={user.id}
                                    className="rounded-full text-xs px-2 py-1 bg-blue-100 text-blue-800 flex items-center gap-1">
                                    {user.full_name}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleUserToggle(user);
                                        }}
                                        className="text-blue-500 hover:text-blue-800 cursor-pointer">
                                        <X size={14} className="" />
                                    </button>
                                </span>
                            )
                            )}
                        </div>
                    </div>
                )}
                <DialogFooter className="flex w-full mt-2">
                    {/* <Button color="red"
                    className="justify-start"
                        onClick={handleRemoveAllUser}
                        disabled={selectedUser.length === 0}>Remove All Users
                    </Button> */}
                    <div className="flex gap-2">
                    <DialogClose asChild>
                        <Button variant="outline"
                            onClick={handleCancel}
                        >Cancel</Button>
                    </DialogClose>
                    <Button color="green"
                        onClick={handleConfirm}
                        disabled={selectedUser.length === 0}>Save changes
                    </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    );
};

export default AddUserDialog;
