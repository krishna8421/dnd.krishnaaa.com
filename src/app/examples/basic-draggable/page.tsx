"use client";

import { useState } from "react";
import Link from "next/link";
import { DndContext, useDraggable, DragEndEvent } from "@dnd-kit/core";
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
      className="bg-white border rounded-lg p-4 w-64 h-24 flex items-center justify-center font-medium text-lg"
    >
      Drag me
    </div>
  );
}

// Demo container showing the position after drag
function PositionInfo({ position }: { position: { x: number; y: number } }) {
  return (
    <div className="mt-8 p-4 bg-muted rounded-lg">
      <p className="font-mono text-sm">
        Position: x: {position.x.toFixed(0)}px, y: {position.y.toFixed(0)}px
      </p>
    </div>
  );
}

export default function BasicDraggablePage() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  function handleDragEnd(event: DragEndEvent) {
    const { delta } = event;
    if (delta) {
      setPosition((prev) => ({
        x: prev.x + delta.x,
        y: prev.y + delta.y,
      }));
    }
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
          <h1 className="text-3xl font-bold mt-4">Basic Draggable Element</h1>
          <p className="text-muted-foreground mt-2">
            Learn how to create a simple draggable element with dnd-kit
          </p>
        </div>

        <Separator />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Example</CardTitle>
                <CardDescription>
                  Drag the element below and observe how it moves
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center pt-6">
                <div className="w-full h-[300px] flex items-center justify-center bg-slate-50 rounded-lg relative">
                  <DndContext onDragEnd={handleDragEnd}>
                    <DraggableItem />
                  </DndContext>
                </div>
                <PositionInfo position={position} />
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>How it works</CardTitle>
                <CardDescription>
                  Understanding the basics of dnd-kit&apos;s draggable functionality
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">1. Set up DndContext</h3>
                  <p className="text-sm text-muted-foreground">
                    The DndContext provider is the foundation of dnd-kit. It
                    manages the state and coordinates between draggable
                    elements.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">
                    2. Create a draggable element
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Use the useDraggable hook to make an element draggable. The
                    hook provides event listeners, attributes, and
                    transformation data.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">3. Handle drag events</h3>
                  <p className="text-sm text-muted-foreground">
                    The onDragEnd callback in DndContext lets you respond when
                    drag operations complete.
                  </p>
                </div>

                <div className="bg-muted p-4 rounded-lg mt-4">
                  <h3 className="font-medium mb-2">
                    Key properties from useDraggable:
                  </h3>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>
                      <span className="font-mono">attributes</span> - ARIA
                      attributes for accessibility
                    </li>
                    <li>
                      <span className="font-mono">listeners</span> - Event
                      listeners for drag interactions
                    </li>
                    <li>
                      <span className="font-mono">setNodeRef</span> - Ref
                      callback to attach to the draggable element
                    </li>
                    <li>
                      <span className="font-mono">transform</span> - Current
                      transform values during dragging
                    </li>
                    <li>
                      <span className="font-mono">isDragging</span> - Boolean
                      indicating if the element is being dragged
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/examples/basic-droppable">
                  <Button>Next Example: Basic Droppable →</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
