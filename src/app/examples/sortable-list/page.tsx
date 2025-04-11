"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
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

// Initial items data
const initialItems = [
  { id: "1", content: "Learn React basics", completed: true },
  { id: "2", content: "Build a to-do app", completed: false },
  { id: "3", content: "Learn about React hooks", completed: false },
  { id: "4", content: "Explore dnd-kit library", completed: true },
  { id: "5", content: "Create a sortable list", completed: false },
  { id: "6", content: "Add keyboard accessibility", completed: false },
];

// Sortable list item component
function SortableItem({
  id,
  content,
  completed,
}: {
  id: string;
  content: string;
  completed: boolean;
}) {
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
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border p-4 mb-2 rounded-lg bg-white flex items-center gap-3 cursor-grab ${
        isDragging ? "shadow-lg" : ""
      }`}
      {...attributes}
      {...listeners}
    >
      <div className="flex-none">
        <div className="h-6 w-6 grid place-items-center bg-slate-100 rounded">
          ⇅
        </div>
      </div>
      <div className="flex-1">
        <span className={completed ? "line-through text-muted-foreground" : ""}>
          {content}
        </span>
      </div>
      <div className="flex-none">
        <div
          className={`h-4 w-4 rounded-full ${
            completed ? "bg-green-500" : "bg-slate-200"
          }`}
        ></div>
      </div>
    </div>
  );
}

export default function SortableListPage() {
  // State for sortable items
  const [items, setItems] = useState(initialItems);

  // Set up sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Delay to distinguish between click and drag
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle end of drag operation
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  // Reset list order
  function resetList() {
    setItems(initialItems);
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
          <h1 className="text-3xl font-bold mt-4">Sortable List</h1>
          <p className="text-muted-foreground mt-2">
            Learn how to create a sortable list with drag and drop
          </p>
        </div>

        <Separator />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Example</CardTitle>
                <CardDescription>
                  Drag and drop to rearrange items in this to-do list
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={items.map((item) => item.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2">
                      {items.map((item) => (
                        <SortableItem
                          key={item.id}
                          id={item.id}
                          content={item.content}
                          completed={item.completed}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" onClick={resetList}>
                    Reset Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>How it works</CardTitle>
                <CardDescription>
                  Understanding the sortable functionality in dnd-kit
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">
                    1. Set up sortable context
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    The SortableContext from @dnd-kit/sortable manages the
                    ordering state and provides the necessary data to make items
                    sortable.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">2. Create sortable items</h3>
                  <p className="text-sm text-muted-foreground">
                    The useSortable hook enhances useDraggable with
                    sorting-specific functionality, making it easier to create
                    sortable interfaces.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">3. Handle reordering</h3>
                  <p className="text-sm text-muted-foreground">
                    The arrayMove utility helps reorder items when a drag
                    operation completes, moving the item from its original
                    position to the new position.
                  </p>
                </div>

                <div className="bg-muted p-4 rounded-lg mt-4">
                  <h3 className="font-medium mb-2">
                    Key features of sortable lists:
                  </h3>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>
                      <span className="font-mono">SortableContext</span> -
                      Manages the sorting state and provides context for
                      sortable items
                    </li>
                    <li>
                      <span className="font-mono">useSortable</span> - Extended
                      hook with sorting capabilities
                    </li>
                    <li>
                      <span className="font-mono">sortingStrategy</span> -
                      Determines how items reposition during sorting (vertical,
                      horizontal, grid)
                    </li>
                    <li>
                      <span className="font-mono">arrayMove</span> - Helper
                      utility to properly reorder arrays based on drag
                      operations
                    </li>
                    <li>
                      <span className="font-mono">sensors</span> - Detect input
                      methods (pointer, keyboard) for better accessibility
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/examples/kanban-board">
                  <Button>Next Example: Kanban Board →</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
