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

// Simple draggable component with visual feedback
function DraggableItem() {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: "draggable-1",
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
      className="bg-white border rounded-lg p-4 w-32 h-32 flex items-center justify-center font-medium"
    >
      Drag me
    </div>
  );
}

// Droppable area component
function DroppableArea({
  id,
  children,
}: {
  id: string;
  children?: React.ReactNode;
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
    <div
      ref={setNodeRef}
      style={style}
      className="w-full h-full border-2 border-dashed rounded-lg flex items-center justify-center"
    >
      {children || <p className="text-muted-foreground text-sm">Drop here</p>}
    </div>
  );
}

export default function BasicDroppablePage() {
  const [parent, setParent] = useState<string | null>(null);

  function handleDragEnd(event: DragEndEvent) {
    const { over } = event;
    setParent(over ? over.id : null);
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
          <h1 className="text-3xl font-bold mt-4">Basic Droppable Area</h1>
          <p className="text-muted-foreground mt-2">
            Learn how to create droppable areas to receive draggable elements
          </p>
        </div>

        <Separator />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Example</CardTitle>
                <CardDescription>
                  Drag the element into the highlighted area
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-8">
                  <DndContext onDragEnd={handleDragEnd}>
                    <div className="flex-1 h-64 bg-slate-50 rounded-lg flex items-center justify-center">
                      {parent !== "droppable-area" && <DraggableItem />}
                    </div>
                    <div className="flex-1 h-64">
                      <DroppableArea id="droppable-area">
                        {parent === "droppable-area" && <DraggableItem />}
                      </DroppableArea>
                    </div>
                  </DndContext>
                </div>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="font-mono text-sm">
                    Status:{" "}
                    {parent === "droppable-area"
                      ? "Item dropped in target area! ✅"
                      : "Item outside target area"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>How it works</CardTitle>
                <CardDescription>
                  Understanding how to make areas accept draggable elements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">
                    1. Create droppable containers
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Use the useDroppable hook to designate an area as a drop
                    target. This hook provides information about the drop state
                    and a ref to attach.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">
                    2. Detect droppable interactions
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    The onDragEnd event provides information about which
                    droppable area the item was dropped on via the 'over'
                    property.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">
                    3. Provide visual feedback
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    The isOver property from useDroppable lets you know when a
                    draggable item is hovering over the droppable area for
                    visual feedback.
                  </p>
                </div>

                <div className="bg-muted p-4 rounded-lg mt-4">
                  <h3 className="font-medium mb-2">
                    Key properties from useDroppable:
                  </h3>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>
                      <span className="font-mono">isOver</span> - Boolean
                      indicating if a draggable is currently over this area
                    </li>
                    <li>
                      <span className="font-mono">setNodeRef</span> - Ref
                      callback to attach to the droppable element
                    </li>
                    <li>
                      <span className="font-mono">rect</span> - The bounding
                      rectangle of the droppable area
                    </li>
                    <li>
                      <span className="font-mono">active</span> - Information
                      about the active draggable element
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/examples/multiple-containers">
                  <Button>Next Example: Multiple Containers →</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
