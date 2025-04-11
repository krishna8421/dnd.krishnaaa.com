"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragEndEvent,
} from "@dnd-kit/core";
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

// Container labels
const containers = ["Container A", "Container B", "Container C"];

// Simple draggable item component
function DraggableItem({ id, label }: { id: string; label: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
    });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    boxShadow: isDragging
      ? "0 0 0 1px rgba(63, 63, 68, 0.05), 0px 15px 15px 0 rgba(34, 33, 81, 0.25)"
      : undefined,
    zIndex: isDragging ? 1 : undefined,
    cursor: "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-white border rounded-lg p-3 mb-2 flex items-center justify-center font-medium"
    >
      {label}
    </div>
  );
}

// Droppable container component
function DroppableContainer({
  id,
  items,
  label,
}: {
  id: string;
  items: string[];
  label: string;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  const style = {
    backgroundColor: isOver ? "rgba(0, 150, 136, 0.1)" : undefined,
    borderColor: isOver ? "rgb(0, 150, 136)" : undefined,
    transition: "background-color 200ms, border-color 200ms",
  };

  return (
    <div className="flex flex-col h-full">
      <div className="font-medium mb-2 text-center">{label}</div>
      <div
        ref={setNodeRef}
        style={style}
        className="flex-1 border-2 border-dashed rounded-lg p-3 min-h-[200px]"
      >
        {items.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
            Drop here
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((itemId) => (
              <DraggableItem
                key={itemId}
                id={itemId}
                label={`Item ${itemId.split("-")[1]}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MultipleContainersPage() {
  // State to track items in each container
  const [items, setItems] = useState({
    "Container A": ["item-1", "item-2"],
    "Container B": ["item-3"],
    "Container C": ["item-4", "item-5"],
    // Items not in any container
    root: [] as string[],
  });

  function findContainer(itemId: string) {
    if (itemId in items) {
      return itemId;
    }

    return Object.keys(items).find((key) =>
      items[key as keyof typeof items].includes(itemId)
    );
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    // Find the containers
    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId) || overId;

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setItems((prev) => {
      const activeItems = [...prev[activeContainer as keyof typeof prev]];
      const overItems = [...prev[overContainer as keyof typeof prev]];

      // Find the index of the item
      const activeIndex = activeItems.indexOf(activeId);

      // Remove from the source container
      activeItems.splice(activeIndex, 1);

      // Add to the destination container
      overItems.push(activeId);

      return {
        ...prev,
        [activeContainer]: activeItems,
        [overContainer]: overItems,
      };
    });
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
          <h1 className="text-3xl font-bold mt-4">Multiple Containers</h1>
          <p className="text-muted-foreground mt-2">
            Learn how to drag items between multiple drop zones
          </p>
        </div>

        <Separator />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Example</CardTitle>
                <CardDescription>
                  Try dragging items between the different containers
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <DndContext onDragEnd={handleDragEnd}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {containers.map((id) => (
                      <DroppableContainer
                        key={id}
                        id={id}
                        label={id}
                        items={items[id as keyof typeof items]}
                      />
                    ))}
                  </div>
                </DndContext>
                <div className="mt-4 p-4 bg-muted rounded-lg text-sm">
                  <p className="font-medium mb-2">Container Contents:</p>
                  <ul className="space-y-1 font-mono">
                    {containers.map((id) => (
                      <li key={id}>
                        {id}: [{items[id as keyof typeof items].join(", ")}]
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>How it works</CardTitle>
                <CardDescription>
                  Understanding how to work with multiple drop containers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">1. Track container state</h3>
                  <p className="text-sm text-muted-foreground">
                    Maintain state to track which items belong to which
                    container. This allows you to move items between containers
                    when they're dropped.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">2. Identify containers</h3>
                  <p className="text-sm text-muted-foreground">
                    When a drag ends, determine the source and destination
                    containers to update the state appropriately.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">3. Update state on drop</h3>
                  <p className="text-sm text-muted-foreground">
                    Move items from one container array to another when a drag
                    operation completes over a different container.
                  </p>
                </div>

                <div className="bg-muted p-4 rounded-lg mt-4">
                  <h3 className="font-medium mb-2">
                    Key implementation points:
                  </h3>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>
                      Each container has a unique ID and maintains its own array
                      of items
                    </li>
                    <li>
                      The onDragEnd handler identifies source and target
                      containers
                    </li>
                    <li>
                      Items are removed from source containers and added to
                      destination containers
                    </li>
                    <li>
                      Each droppable container renders the items assigned to it
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/examples/sortable-list">
                  <Button>Next Example: Sortable List →</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
