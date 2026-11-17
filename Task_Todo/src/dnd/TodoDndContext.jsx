/* eslint-disable react-refresh/only-export-components */
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  pointerWithin,
} from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const arrayMove = (array, fromIndex, toIndex) => {
  const newArray = [...array];
  const [movedItem] = newArray.splice(fromIndex, 1);
  newArray.splice(toIndex, 0, movedItem);
  return newArray;
};

export const useSortableGroup = (group) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({
      id: `group-${group.id}`,
      data: {
        type: "group",
        group,
      },
      animateLayoutChanges: () => false,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: "none",
  };

  const dragHandleProps = {
    ...attributes,
    ...listeners,
  };

  return {
    setNodeRef,
    style,
    isDragging,
    dragHandleProps,
  };
};

export const useSortableTask = (task) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({
      id: task.id,
      data: {
        type: "task",
        task,
      },
      animateLayoutChanges: () => false,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: "none",
    opacity: isDragging ? 0.4 : 1,
  };

  const dragProps = {
    ...attributes,
    ...listeners,
  };

  return {
    setNodeRef,
    style,
    isDragging,
    dragProps,
  };
};

export function DragHandle({ className = "", ...props }) {
  return (
    <button
      type="button"
      title="Drag column"
      className={`p-1 text-[#64748b] hover:text-[#0f172a] hover:bg-[#e2e8f0] rounded cursor-grab active:cursor-grabbing flex items-center justify-center border-0 bg-transparent touch-none select-none ${className}`}
      {...props}
    >
      <img
        src="https://www.svgrepo.com/show/459043/drag-handle.svg"
        alt="Drag"
        className="w-4 h-4 pointer-events-none"
      />
    </button>
  );
}

export const handleDndDragEnd = (event, setGroups) => {
  const { active, over } = event;

  if (!over || String(active.id) === String(over.id)) return;

  const isDraggingGroup =
    active.data.current?.type === "group" ||
    String(active.id).startsWith("group-");

  if (isDraggingGroup) {
    setGroups((prevGroups) => {
      const activeGroupId = String(active.id).replace("group-", "");
      let overGroupId = String(over.id).replace("group-", "");

      const overTask = prevGroups
        .flatMap((g) => g.tasks || [])
        .find((t) => String(t.id) === String(over.id));
      if (overTask) {
        overGroupId = String(overTask.groupId);
      }

      if (activeGroupId === overGroupId) return prevGroups;

      const oldIndex = prevGroups.findIndex(
        (g) => String(g.id) === activeGroupId,
      );
      const newIndex = prevGroups.findIndex(
        (g) => String(g.id) === overGroupId,
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        return arrayMove(prevGroups, oldIndex, newIndex);
      }
      return prevGroups;
    });
    return;
  }

  setGroups((prevGroups) => {
    const newGroups = prevGroups.map((group) => ({
      ...group,
      tasks: [...(group.tasks || [])],
    }));

    const sourceGroup = newGroups.find((group) =>
      group.tasks.some((task) => String(task.id) === String(active.id)),
    );

    const targetGroup = newGroups.find(
      (group) =>
        String(group.id) === String(over.id) ||
        `group-${group.id}` === String(over.id) ||
        group.tasks.some((task) => String(task.id) === String(over.id)),
    );

    if (!sourceGroup || !targetGroup) return prevGroups;

    const oldIndex = sourceGroup.tasks.findIndex(
      (task) => String(task.id) === String(active.id),
    );
    if (oldIndex === -1) return prevGroups;

    if (String(sourceGroup.id) === String(targetGroup.id)) {
      const newIndex = sourceGroup.tasks.findIndex(
        (task) => String(task.id) === String(over.id),
      );

      if (newIndex !== -1 && oldIndex !== newIndex) {
        sourceGroup.tasks = arrayMove(sourceGroup.tasks, oldIndex, newIndex);
      }
    } else {
      const [movedTask] = sourceGroup.tasks.splice(oldIndex, 1);

      const updatedTask = {
        ...movedTask,
        groupId: targetGroup.id,
        status: targetGroup.id,
      };

      const overTaskIndex = targetGroup.tasks.findIndex(
        (task) => String(task.id) === String(over.id),
      );

      if (overTaskIndex >= 0) {
        targetGroup.tasks.splice(overTaskIndex, 0, updatedTask);
      } else {
        targetGroup.tasks.push(updatedTask);
      }
    }

    return newGroups;
  });
};

export default function TodoDndContext({ children, onDragEnd }) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const collisionDetectionStrategy = (args) => {
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) {
      return pointerCollisions;
    }
    return closestCorners(args);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={(event) => {
        console.log("Drag Start:", event.active.id);
      }}
      onDragEnd={(event) => {
        console.log("Drag End:", event.active.id, event.over?.id);
        onDragEnd(event);
      }}
      onDragCancel={() => {
        console.log("Drag Cancel");
      }}
    >
      {children}
    </DndContext>
  );
}
