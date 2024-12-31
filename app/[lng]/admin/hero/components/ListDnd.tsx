"use client";

import Form from "./Form";
import { useEffect, useState } from "react";
import { updateHeroesOrder } from "@/app/shared/services/hero/controller";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { IHero } from "@/app/shared/interfaces";

const ListDnd = ({ heroes }: { heroes: IHero[] }) => {
  const [newHeroes, setNewHeroes] = useState<IHero[]>(heroes);

  useEffect(() => {
    setNewHeroes(heroes);
  }, [heroes]);

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const reorderedHeroes = Array.from(newHeroes);
    const [movedHero] = reorderedHeroes.splice(result.source.index, 1);
    reorderedHeroes.splice(result.destination.index, 0, movedHero);

    const updatedHeroes = reorderedHeroes.map((hero, index) => ({
      ...hero,
      order: index,
    }));

    setNewHeroes(updatedHeroes);
    await updateHeroesOrder({ heroes: updatedHeroes });
  };

  return (
    <div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="hero-list">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {newHeroes.map((hero, index) => (
                <Draggable key={hero.id} draggableId={hero.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="p-4 border rounded shadow bg-white"
                    >
                      <h3 className="text-lg font-bold">{hero.title}</h3>
                      <p>{hero.subtitle}</p>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Form />
    </div>
  );
};

export default ListDnd;
