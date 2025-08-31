import { Label } from "./ui/label";
import { Input } from "./ui/input";
type Props = {
  placeholder: string;
  label: string;
};
const NumberField = ({ placeholder, label }: Props) => {
  return (
    <div className="w-3/5">
      <Label>{label}</Label>
      <Input placeholder={placeholder} type="number"/>
    </div>
  );
};

export default NumberField;
