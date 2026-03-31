import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { SearchIcon } from "lucide-react";

interface ProjectUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    searchUser: string;
    setSearchUser: (val: string) => void;
    filteredProjectUsers: any[];
}

const ProjectUserDialog = ({
    open,
    onOpenChange,
    searchUser,
    setSearchUser,
    filteredProjectUsers,
}: ProjectUserDialogProps) => {

    return (
        <Dialog open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="w-full max-h-[100vh] overflow-y-auto ">
                <DialogHeader>
                    <DialogTitle className="text-center !text-[22px] !font-semibold">Browse Users</DialogTitle>
                    <DialogDescription className="text-center text-gray-400 text-base font-semibold">Project User List</DialogDescription>
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
                    {filteredProjectUsers.map((user) => {
                        return (
                            <div
                                key={user.id}
                                className={`flex  items-center pl-3 pr-3 gap-4 rounded-lg hover:bg-gray-100 border-2 border-transparent`}>
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
                            </div>
                        );
                    }
                    )}
                </div>
            </DialogContent>
        </Dialog >
    );
};
export default ProjectUserDialog;
