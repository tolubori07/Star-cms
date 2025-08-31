import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

type Props = {
  label: string;
};

const BooleanField = ({ label }: Props) => {
  return (
    <div>
      <Label>{label}</Label>
      <Checkbox />
    </div>
  );
};

export default BooleanField;
