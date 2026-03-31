import { faker } from '@faker-js/faker';
import {
    KanbanBoard,
    KanbanCard,
    KanbanCards,
    KanbanHeader,
    KanbanProvider,
} from '@/components/ui/shadcn-io/kanban';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from '@/components/ui/dialog';

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
const columns = [
    { id: faker.string.uuid(), name: 'Planned', color: '#6B7280' },
    { id: faker.string.uuid(), name: 'In Progress', color: '#F59E0B' },
    { id: faker.string.uuid(), name: 'Done', color: '#10B981' },
];
const users = Array.from({ length: 4 })
    .fill(null)
    .map(() => ({
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        image: faker.image.avatar(),
    }));
const exampleFeatures = Array.from({ length: 20 })
    .fill(null)
    .map(() => ({
        id: faker.string.uuid(),
        name: capitalize(faker.company.buzzPhrase()),
        startAt: faker.date.past({ years: 0.5, refDate: new Date() }),
        endAt: faker.date.future({ years: 0.5, refDate: new Date() }),
        column: faker.helpers.arrayElement(columns).id,
        owner: faker.helpers.arrayElement(users),
    }));
const dateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
});
const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
});

const KanbonExample = () => {
    const [features, setFeatures] = useState(exampleFeatures);
    const [selectedCard, setSelectedCard] = useState<typeof features[0] | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    return (
        <>
            <KanbanProvider
                columns={columns}
                data={features}
                onDataChange={setFeatures}
            >
                {(column) => (
                    <KanbanBoard id={column.id} key={column.id}
                        className="flex flex-col h-full max-h-[80vh]">
                        <KanbanHeader>
                            <div className="flex items-center gap-2">
                                <div
                                    className="h-2 w-2 rounded-full"
                                    style={{ backgroundColor: column.color }}
                                />
                                <span>{column.name}</span>
                            </div>
                        </KanbanHeader>
                        <KanbanCards id={column.id}>
                            {(feature: (typeof features)[number]) => (
                                <div
                                    key={feature.id}

                                    className="cursor-pointer"
                                >
                                    <KanbanCard
                                        column={column.id}
                                        id={feature.id}
                                        key={feature.id}
                                        name={feature.name}
                                        onClick={() => {
                                            console.log("Card clicked");
                                            setSelectedCard(feature);
                                            setDialogOpen(true);
                                        }}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex flex-col gap-1">
                                                <p className="m-0 flex-1 font-medium text-sm">
                                                    {feature.name}
                                                </p>
                                            </div>
                                            {feature.owner && (
                                                <Avatar className="h-4 w-4 shrink-0">
                                                    <AvatarImage src={feature.owner.image} />
                                                    <AvatarFallback>
                                                        {feature.owner.name?.slice(0, 2)}
                                                    </AvatarFallback>
                                                </Avatar>
                                            )}
                                        </div>
                                        <p className="m-0 text-muted-foreground text-xs">
                                            {shortDateFormatter.format(feature.startAt)} -{' '}
                                            {dateFormatter.format(feature.endAt)}
                                        </p>
                                    </KanbanCard>
                                </div>
                            )}
                        </KanbanCards>
                    </KanbanBoard>
                )
                }
            </KanbanProvider >

            {/* Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedCard?.name}</DialogTitle>
                        <DialogDescription>
                            <p className="text-sm text-muted-foreground">
                                Duration:{' '}
                                {shortDateFormatter.format(selectedCard?.startAt ?? new Date())} -{' '}
                                {dateFormatter.format(selectedCard?.endAt ?? new Date())}
                            </p>
                            <p className="mt-2">
                                Owner:{' '}
                                <strong>{selectedCard?.owner?.name ?? 'Unassigned'}</strong>
                            </p>
                        </DialogDescription>
                        <DialogClose />
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default KanbonExample;