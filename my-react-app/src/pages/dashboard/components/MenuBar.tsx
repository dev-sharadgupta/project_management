import { useLocation, useSearchParams } from "react-router";

export default function MenuBar() {
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const tabs = ["Overview", "Targets", "Tasks", "Notes", "Meetings", "Reports", "Settings"];

    const currentTabParam = searchParams.get("page");
    const currentPath = location.pathname.slice(1).toLowerCase();
    const activeTab = currentTabParam
        ? capitalizeFirstLetter(currentTabParam)
        : currentPath === ""
            ? "Overview"
            : capitalizeFirstLetter(currentPath);

    function capitalizeFirstLetter(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return (
        <nav>
            <ul className="flex flex-wrap gap-8 font-medium text-md text-gray-600 py-5">
                {tabs.map((tab) => (
                    <li key={tab}>
                        <span
                            className={`relative pb-5 cursor-pointer ${activeTab === tab
                                ? "text-blue-600 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-blue-600"
                                : "hover:text-blue-600 hover:after:content-[''] hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:h-[2px] hover:after:w-full hover:after:bg-blue-600"
                                }`}
                            onClick={() => setSearchParams({ page: tab.toLowerCase() })}
                        >
                            {tab}
                        </span>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
