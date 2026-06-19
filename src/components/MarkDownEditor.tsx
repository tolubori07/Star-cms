import MDEditor from "@uiw/react-md-editor";
import { Label } from "./ui/label";

type Props = {
  placeholder?: string;
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  name?: string;
};

const MarkDownEditor: React.FC<Props> = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
}) => {
  return (
    <div className="w-full">
      <Label htmlFor={name} className="mb-2">
        {label}
      </Label>
      <MDEditor
        value={value}
        onChange={(val) => onChange?.(val || "")}
        onBlur={onBlur}
        textareaProps={{ placeholder: placeholder }}
        visibleDragbar={true}
        height={800}
        className="bg-card border-2 border-black "
      />
    </div>
  );
};
export default MarkDownEditor;
