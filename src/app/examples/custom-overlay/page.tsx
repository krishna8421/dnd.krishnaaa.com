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
  DragStartEvent,
  DragOverlay,
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

// Images for the items
const fileItems = [
  { id: "file-1", name: "Document.pdf", type: "pdf", size: "2.4 MB" },
  { id: "file-2", name: "Photo.jpg", type: "image", size: "3.8 MB" },
  {
    id: "file-3",
    name: "Presentation.pptx",
    type: "presentation",
    size: "5.2 MB",
  },
  {
    id: "file-4",
    name: "Spreadsheet.xlsx",
    type: "spreadsheet",
    size: "1.7 MB",
  },
  { id: "file-5", name: "Archive.zip", type: "archive", size: "8.1 MB" },
];

// File type icons (simple emoji representation)
function getFileIcon(type: string) {
  switch (type) {
    case "pdf":
      return "📄";
    case "image":
      return "🖼️";
    case "presentation":
      return "📊";
    case "spreadsheet":
      return "📈";
    case "archive":
      return "🗄️";
    default:
      return "📁";
  }
}

// Regular file item
function FileItem({
  id,
  name,
  type,
  size,
}: {
  id: string;
  name: string;
  type: string;
  size: string;
}) {
  return (
    <div className="flex items-center p-3 border rounded-lg bg-white">
      <div className="text-2xl mr-3">{getFileIcon(type)}</div>
      <div className="flex-1">
        <div className="font-medium">{name}</div>
        <div className="text-xs text-muted-foreground">{size}</div>
      </div>
    </div>
  );
}

// Sortable file item
function SortableFileItem({
  id,
  name,
  type,
  size,
}: {
  id: string;
  name: string;
  type: string;
  size: string;
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
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`mb-2 cursor-grab ${isDragging ? "z-10" : ""}`}
      {...attributes}
      {...listeners}
    >
      <FileItem id={id} name={name} type={type} size={size} />
    </div>
  );
}

// Custom overlay when dragging
function DragOverlayContent({
  id,
  name,
  type,
  size,
}: {
  id: string;
  name: string;
  type: string;
  size: string;
}) {
  return (
    <div className="transform scale-105">
      <div className="flex items-center p-3 border rounded-lg bg-white shadow-lg border-blue-400">
        <div className="text-2xl mr-3">{getFileIcon(type)}</div>
        <div className="flex-1">
          <div className="font-medium">{name}</div>
          <div className="text-xs text-muted-foreground">{size}</div>
        </div>
        <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
          Moving
        </div>
      </div>
    </div>
  );
}

export default function CustomOverlayPage() {
  // State
  const [items, setItems] = useState(fileItems);
  const [activeItem, setActiveItem] = useState<(typeof fileItems)[0] | null>(
    null
  );

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
    const activeItem = items.find((item) => item.id === active.id);

    if (activeItem) {
      setActiveItem(activeItem);
    }
  }

  // Handle drag end
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveItem(null);
  }

  // Reset items
  function resetItems() {
    setItems(fileItems);
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
          <h1 className="text-3xl font-bold mt-4">Customized Drag Overlay</h1>
          <p className="text-muted-foreground mt-2">
            Learn how to create customized drag overlays for better user
            experience
          </p>
        </div>

        <Separator />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Example</CardTitle>
                <CardDescription>
                  Try dragging the files and notice the customized drag overlay
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="bg-slate-50 p-4 rounded-lg mb-4">
                  <div className="font-medium mb-2">Files</div>

                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={items.map((item) => item.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2">
                        {items.map((item) => (
                          <SortableFileItem
                            key={item.id}
                            id={item.id}
                            name={item.name}
                            type={item.type}
                            size={item.size}
                          />
                        ))}
                      </div>
                    </SortableContext>

                    <DragOverlay>
                      {activeItem ? (
                        <DragOverlayContent
                          id={activeItem.id}
                          name={activeItem.name}
                          type={activeItem.type}
                          size={activeItem.size}
                        />
                      ) : null}
                    </DragOverlay>
                  </DndContext>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" onClick={resetItems}>
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
                  Understanding how to create customized drag overlays
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">
                    1. Create a custom overlay component
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    The DragOverlay component allows you to define a custom
                    component that appears when an item is being dragged,
                    providing a better visual cue to the user.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">2. Track the active item</h3>
                  <p className="text-sm text-muted-foreground">
                    Use the onDragStart event to identify which item is being
                    dragged and set it as the active item to be displayed in the
                    overlay.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">
                    3. Style the overlay differently
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    You can make the overlay more prominent by applying
                    different styles like shadows, scaling, and accent colors.
                  </p>
                </div>

                <div className="bg-muted p-4 rounded-lg mt-4">
                  <h3 className="font-medium mb-2">
                    Key implementation points:
                  </h3>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>
                      <span className="font-mono">DragOverlay</span> - Wrapper
                      component that renders a floating overlay during drag
                    </li>
                    <li>
                      <span className="font-mono">onDragStart</span> - Event
                      handler to set the active item for the overlay
                    </li>
                    <li>
                      <span className="font-mono">Custom styling</span> -
                      Enhanced visuals for the overlay compared to the original
                      item
                    </li>
                    <li>
                      <span className="font-mono">Active item state</span> -
                      Tracks which item is currently being dragged
                    </li>
                    <li>
                      <span className="font-mono">Different component</span> -
                      The overlay can be a completely different component from
                      the original
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href="/">
                  <Button variant="outline">Back to Home</Button>
                </Link>
                <Link href="/examples/basic-draggable">
                  <Button>Restart Journey →</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
