import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  const examples = [
    {
      title: 'Basic Draggable',
      description: 'Learn the fundamentals of creating a draggable element',
      path: '/examples/basic-draggable',
      level: 'Beginner'
    },
    {
      title: 'Basic Droppable',
      description: 'Create your first droppable area',
      path: '/examples/basic-droppable',
      level: 'Beginner'
    },
    {
      title: 'Multiple Containers',
      description: 'Drag between different container elements',
      path: '/examples/multiple-containers',
      level: 'Intermediate'
    },
    {
      title: 'Sortable List',
      description: 'Create a sortable list with drag and drop',
      path: '/examples/sortable-list',
      level: 'Intermediate'
    },
    {
      title: 'Kanban Board',
      description: 'Build a Kanban board with sortable columns and items',
      path: '/examples/kanban-board',
      level: 'Advanced'
    },
    {
      title: 'Customized Drag Overlay',
      description: 'Learn how to customize the drag overlay',
      path: '/examples/custom-overlay',
      level: 'Advanced'
    }
  ];

  return (
    <main className="container mx-auto py-12 px-4">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">dnd-kit Learning Journey</h1>
          <p className="mt-4 text-xl text-muted-foreground">
            A collection of examples to learn dnd-kit from basic to advanced
          </p>
        </div>

        <Separator className="my-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {examples.map((example) => (
            <Link href={example.path} key={example.path}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{example.title}</CardTitle>
                    <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${example.level === 'Beginner' ? 'bg-green-100 text-green-800' : 
                        example.level === 'Intermediate' ? 'bg-blue-100 text-blue-800' : 
                        'bg-purple-100 text-purple-800'}`}>
                      {example.level}
                    </div>
                  </div>
                  <CardDescription>{example.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="ghost" className="w-full justify-start">
                    Explore Example →
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
