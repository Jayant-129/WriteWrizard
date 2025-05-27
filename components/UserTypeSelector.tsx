import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UserTypeSelector = ({
  userType,
  setUserType,
  onClickHandler,
}: UserTypeSelectorParams) => {
  const accessChangeHandler = (type: UserType) => {
    setUserType(type);
    onClickHandler && onClickHandler(type);
  };

  return (
    <Select
      value={userType}
      onValueChange={(type: UserType) => accessChangeHandler(type)}
    >
      <SelectTrigger className="shad-select h-11 w-full border border-gray-700/50 bg-gray-800/50 focus:ring-0 focus:ring-offset-0 focus:border-red-500/50 transition-colors">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="border border-gray-700/50 bg-gray-900 shadow-xl z-[10000] backdrop-blur-sm">
        <SelectItem
          value="viewer"
          className="shad-select-item focus:bg-red-800/20 hover:bg-red-800/20 text-gray-300 hover:text-white transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>Can view</span>
          </div>
        </SelectItem>
        <SelectItem
          value="editor"
          className="shad-select-item focus:bg-red-800/20 hover:bg-red-800/20 text-gray-300 hover:text-white transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Can edit</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default UserTypeSelector;
