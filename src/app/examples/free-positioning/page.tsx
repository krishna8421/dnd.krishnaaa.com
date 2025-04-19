"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  DndContext,
  useDraggable,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
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

// Define interface for a draggable item with position
interface PositionableItem {
  id: string;
  label: string;
  position: {
    x: number;
    y: number;
  };
}

// Initial items with positions
const initialItems: PositionableItem[] = [
  { id: "item-1", label: "Item 1", position: { x: 50, y: 50 } },
  { id: "item-2", label: "Item 2", position: { x: 200, y: 100 } },
  { id: "item-3", label: "Item 3", position: { x: 350, y: 150 } },
];

function DraggableItem({ item }: { item: PositionableItem }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: item.id,
    });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : `translate3d(${item.position.x}px, ${item.position.y}px, 0)`,
    position: "absolute",
    top: 0,
    left: 0,
    width: 100,
    height: 100,
    transition: isDragging ? undefined : "transform 200ms ease",
    zIndex: isDragging ? 10 : 1,
    touchAction: "none",
    cursor: "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`bg-white border rounded-lg p-3 flex flex-col items-center justify-center shadow-sm ${
        isDragging ? "shadow-xl border-blue-400" : ""
      }`}
    >
      <span className="font-medium">{item.label}</span>
      <span className="text-xs text-muted-foreground mt-1">
        {Math.round(item.position.x)}, {Math.round(item.position.y)}
      </span>
    </div>
  );
}

export default function FreePositioningPage() {
  // Create state for items
  const [items, setItems] = useState<PositionableItem[]>(initialItems);

  // Create sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Only activate after moving 5px to avoid accidental drags
      },
    })
  );

  // Load saved positions from localStorage on mount
  useEffect(() => {
    // Ensure we're running on the client before accessing localStorage
    if (typeof window !== "undefined") {
      const savedItems = localStorage.getItem("free-positioning-items");
      if (savedItems) {
        try {
          setItems(JSON.parse(savedItems));
        } catch (e) {
          console.error("Failed to parse saved items:", e);
        }
      }
    }
  }, []);

  // Save positions to localStorage when they change
  useEffect(() => {
    // Ensure we're running on the client before accessing localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("free-positioning-items", JSON.stringify(items));
    }
  }, [items]);

  // Handle drag end to update positions
  function handleDragEnd(event: DragEndEvent) {
    const { active, delta } = event;

    setItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === active.id) {
          return {
            ...item,
            position: {
              x: item.position.x + delta.x,
              y: item.position.y + delta.y,
            },
          };
        }
        return item;
      });
    });
  }

  // Reset items to initial positions
  function resetPositions() {
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
          <h1 className="text-3xl font-bold mt-4">Free Positioning</h1>
          <p className="text-muted-foreground mt-2">
            Drag items freely and persist their positions
          </p>
        </div>

        <Separator />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Example</CardTitle>
                <CardDescription>
                  Drag the elements freely and watch positions persist
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="relative h-96 w-full bg-slate-50 rounded-lg overflow-hidden border">
                  <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                    {items.map((item) => (
                      <DraggableItem key={item.id} item={item} />
                    ))}
                  </DndContext>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Item positions are saved in localStorage
                  </div>
                  <Button variant="outline" size="sm" onClick={resetPositions}>
                    Reset Positions
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
                  Understanding how to create freely positionable elements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">1. Absolute positioning</h3>
                  <p className="text-sm text-muted-foreground">
                    Each draggable element uses absolute positioning with
                    transforms to allow free movement within the container.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">2. Delta-based movement</h3>
                  <p className="text-sm text-muted-foreground">
                    The position of each item is updated based on the delta
                    (change) in position from the drag operation, not the final
                    cursor position.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">3. State persistence</h3>
                  <p className="text-sm text-muted-foreground">
                    Item positions are saved to localStorage whenever they
                    change, and loaded when the component mounts to persist
                    across sessions.
                  </p>
                </div>

                <div className="bg-muted p-4 rounded-lg mt-4">
                  <h3 className="font-medium mb-2">Key concepts:</h3>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>
                      <span className="font-mono">transform</span> - Used for
                      smooth positioning and transitions
                    </li>
                    <li>
                      <span className="font-mono">delta</span> - The change in
                      position from the drag event
                    </li>
                    <li>
                      <span className="font-mono">localStorage</span> - Browser
                      storage used to persist positions
                    </li>
                    <li>
                      <span className="font-mono">absolute positioning</span> -
                      Allows elements to freely overlap
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/">
                  <Button>Back to Home</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
