interface SkillBarProps {
  name: string;
  level: number;
}

export default function SkillBar({ name, level }: SkillBarProps) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span>{name}</span>
        <span>{level}%</span>
      </div>
      <div className="h-2 bg-gray-800 rounded">
        <div
          className="h-full bg-secondary rounded"
          style={{ width: `${level}%` }}
        />
      </div>
    </div>
  );
}