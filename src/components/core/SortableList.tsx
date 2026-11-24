import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import { useId } from "react";

import type { DragEndEvent } from "@dnd-kit/core";
import type { ReactNode } from "react";

interface SortableItemProps {
  id: string;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  children: ReactNode;
}

const SortableItem = ({
  id,
  index,
  total,
  onMoveUp,
  onMoveDown,
  children,
}: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="flex gap-2">
        <div className="flex flex-col items-center gap-0.5 pt-4">
          <button
            type="button"
            className="cursor-grab touch-none rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Drag to reorder"
            {...attributes}
            {...listeners}
          >
            <GripVertical size={16} />
          </button>
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
            aria-label="Move up"
          >
            <ChevronUp size={14} />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
            aria-label="Move down"
          >
            <ChevronDown size={14} />
          </button>
        </div>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
};

interface SortableListProps<T extends { id?: string }> {
  items: T[];
  onReorder: (items: T[]) => void;
  renderItem: (item: T, index: number) => ReactNode;
}

const SortableList = <T extends { id?: string }>({
  items,
  onReorder,
  renderItem,
}: SortableListProps<T>) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const ids = items.map((item) => item.id ?? "");

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    onReorder(arrayMove(items, oldIndex, newIndex));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    onReorder(arrayMove(items, index, index - 1));
  };

  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return;
    onReorder(arrayMove(items, index, index + 1));
  };

  // dnd-kit numbers its accessibility ids with a global counter that differs
  // between server and client; a React id keeps them stable across hydration
  const dndId = useId();

  return (
    <DndContext
      id={dndId}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        {items.map((item, index) => (
          <SortableItem
            key={item.id}
            id={item.id ?? ""}
            index={index}
            total={items.length}
            onMoveUp={() => handleMoveUp(index)}
            onMoveDown={() => handleMoveDown(index)}
          >
            {renderItem(item, index)}
          </SortableItem>
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default SortableList;
