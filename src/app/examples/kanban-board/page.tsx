"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Initial kanban board data
const initialTasks: Record<string, Task[]> = {
  "to-do": [
    { id: "task-1", content: "Research competitors", priority: "High" },
    { id: "task-2", content: "Update documentation", priority: "Medium" },
    { id: "task-3", content: "Review project scope", priority: "Low" },
  ],
  "in-progress": [
    { id: "task-4", content: "Design landing page", priority: "High" },
    { id: "task-5", content: "Implement drag and drop", priority: "Medium" },
  ],
  completed: [
    { id: "task-6", content: "Team meeting", priority: "High" },
    { id: "task-7", content: "Set up project repository", priority: "Medium" },
  ],
};

// Task card component
interface Task {
  id: string;
  content: string;
  priority: "High" | "Medium" | "Low";
}

function TaskCard({ task, isDragging }: { task: Task; isDragging?: boolean }) {
  // Priority color mapping
  const priorityColor = {
    High: "bg-red-100 text-red-800",
    Medium: "bg-blue-100 text-blue-800",
    Low: "bg-green-100 text-green-800",
  };

  return (
    <div
      className={`p-3 bg-white rounded-md border shadow-sm ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <p className="font-medium">{task.content}</p>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            priorityColor[task.priority]
          }`}
        >
          {task.priority}
        </span>
      </div>
      <div className="text-xs text-muted-foreground">
        Task #{task.id.split("-")[1]}
      </div>
    </div>
  );
}

// Sortable task component
function SortableTaskCard({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mb-2 cursor-grab"
      {...attributes}
      {...listeners}
    >
      <TaskCard task={task} isDragging={isDragging} />
    </div>
  );
}

// Column component
function KanbanColumn({
  id,
  title,
  tasks,
  tasksIds,
}: {
  id: string;
  title: string;
  tasks: Record<string, Task[]>;
  tasksIds: string[];
}) {
  return (
    <div className="flex flex-col bg-slate-50 rounded-md p-3 h-full min-h-[400px]">
      <div className="flex items-center justify-between pb-3 mb-3 border-b">
        <h3 className="font-medium">{title}</h3>
        <div className="text-xs text-muted-foreground bg-slate-200 px-2 py-1 rounded-full">
          {tasksIds.length}
        </div>
      </div>

      <div className="flex-1">
        <SortableContext
          items={tasksIds}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {tasksIds.map((taskId) => (
              <SortableTaskCard
                key={taskId}
                task={tasks[id].find((task) => task.id === taskId)!}
              />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}

// Find column of a task
function findColumnOfTask(
  tasks: Record<string, Task[]>,
  taskId: UniqueIdentifier
): string | undefined {
  return Object.keys(tasks).find((columnId) =>
    tasks[columnId].some((task) => task.id === taskId)
  );
}

export default function KanbanBoardPage() {
  // State
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Get all column IDs
  const columns = Object.keys(tasks);

  // Set up sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag start
  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const taskId = active.id.toString();
    const columnId = findColumnOfTask(tasks, taskId);

    if (columnId) {
      const task = tasks[columnId].find((task) => task.id === taskId);
      if (task) setActiveTask(task);
    }
  }

  // Handle drag end
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    if (activeId === overId) return;

    // Find the source and destination columns
    const activeColumn = findColumnOfTask(tasks, activeId);
    const overColumn = findColumnOfTask(tasks, overId);

    if (!activeColumn) return;

    setTasks((prevTasks) => {
      // The active task is moving to a new column
      if (overColumn && activeColumn !== overColumn) {
        const activeItems = Array.from(prevTasks[activeColumn]);
        const overItems = Array.from(prevTasks[overColumn]);

        const activeIndex = activeItems.findIndex(
          (task) => task.id === activeId
        );
        const overIndex = overItems.findIndex((task) => task.id === overId);

        const task = activeItems[activeIndex];

        // Remove from source
        activeItems.splice(activeIndex, 1);

        // Add to destination at the position of the overId task
        // or at the end if it's a column
        if (overId in prevTasks) {
          // It's a column, add at the end
          return {
            ...prevTasks,
            [activeColumn]: activeItems,
            [overId]: [...prevTasks[overId], task],
          };
        } else {
          // It's a task, add near it
          overItems.splice(
            overIndex >= 0 ? overIndex : overItems.length,
            0,
            task
          );
          return {
            ...prevTasks,
            [activeColumn]: activeItems,
            [overColumn]: overItems,
          };
        }
      }
      // Same column reordering
      else if (activeColumn === overColumn) {
        const items = Array.from(prevTasks[activeColumn]);
        const activeIndex = items.findIndex((task) => task.id === activeId);
        const overIndex = items.findIndex((task) => task.id === overId);

        return {
          ...prevTasks,
          [activeColumn]: arrayMove(items, activeIndex, overIndex),
        };
      }

      return prevTasks;
    });

    setActiveTask(null);
  }

  // Reset kanban board
  function resetBoard() {
    setTasks(initialTasks);
  }

  return (
    <main className="container mx-auto py-12 px-4">
      <div className="space-y-6">
        <div>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:underline"
          >
            ← Back to all examples
          </Link>
          <h1 className="text-3xl font-bold mt-4">Kanban Board</h1>
          <p className="text-muted-foreground mt-2">
            Create a Kanban board with sortable columns and tasks
          </p>
        </div>

        <Separator />

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Kanban Board Example</CardTitle>
                  <CardDescription>
                    Drag tasks within and between columns
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={resetBoard}>
                  Reset Board
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {columns.map((columnId) => (
                    <KanbanColumn
                      key={columnId}
                      id={columnId}
                      title={
                        columnId === "to-do"
                          ? "To Do"
                          : columnId === "in-progress"
                          ? "In Progress"
                          : "Completed"
                      }
                      tasks={tasks}
                      tasksIds={tasks[columnId].map((task) => task.id)}
                    />
                  ))}
                </div>
                <DragOverlay>
                  {activeTask ? <TaskCard task={activeTask} /> : null}
                </DragOverlay>
              </DndContext>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How it works</CardTitle>
              <CardDescription>
                Understanding the advanced concepts of dnd-kit used in the
                Kanban board
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">
                      1. Multiple sortable containers
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Tasks can be sorted within a single column and also moved
                      between different columns. Each column is a separate
                      sortable context.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">
                      2. Drag overlay for better UX
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      The DragOverlay component provides a visual representation
                      of the dragged item that follows the cursor, providing
                      better feedback during drag operations.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">
                      3. Complex state management
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Managing tasks across multiple columns requires careful
                      tracking of which column a task belongs to and handling
                      moves between columns.
                    </p>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium mb-2">
                    Key implementation details:
                  </h3>
                  <ul className="text-sm space-y-3 text-muted-foreground">
                    <li>
                      <span className="font-medium">DragOverlay</span> - Creates
                      a floating element that follows the cursor during drag
                    </li>
                    <li>
                      <span className="font-medium">Multiple Contexts</span> -
                      Each column has its own SortableContext
                    </li>
                    <li>
                      <span className="font-medium">onDragStart</span> - Sets
                      the active task for the overlay when dragging begins
                    </li>
                    <li>
                      <span className="font-medium">Column Transfers</span> -
                      Tasks can be moved between columns by detecting the source
                      and destination containers
                    </li>
                    <li>
                      <span className="font-medium">Advanced State</span> - The
                      board maintains a complex state structure to track tasks
                      in each column
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/examples/custom-overlay">
                <Button>Next Example: Customized Drag Overlay →</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}
