"use client";

import Form from "./Form";
import { useEffect, useState } from "react";
import useModal from "@/app/shared/hooks/useModal";
import { Card404, Modal } from "@/app/shared/components";
import { updateHeroesOrder } from "@/app/shared/services/hero/controller";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  EyeIcon,
  TrashIcon,
  PencilIcon,
  PlusCircle,
  EyeSlashIcon,
} from "@/app/shared/icons";
import type { ICollection, IHero } from "@/app/shared/interfaces";

type IAction = "create" | "update" | "delete" | "activate" | "deactivate";

interface IListDnd {
  heroes: IHero[];
  collections: ICollection[];
}

const ListDnd = ({ heroes, collections }: IListDnd) => {
  const { isOpen, onClose, onOpen } = useModal();
  const [action, setAction] = useState<IAction>("create");
  const [newHeroes, setNewHeroes] = useState<IHero[]>(heroes);
  const [heroSelected, setHeroSelected] = useState<IHero | null>(null);

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

  const handleAction = (action: IAction, hero?: IHero) => {
    setAction(action);
    setHeroSelected(hero || null);
    onOpen();
  };

  return (
    <>
      <div className="flex justify-between items-start gap-2 mb-4">
        <p>
          El orden de los heroes se puede cambiar arrastrando y soltando
          <br />
          <span>
            <small>
              Nota: El orden de mostrado en la web es el mismo que el de la
              lista, de arriba hacía abajo
            </small>
          </span>
        </p>
        {collections.length > 0 && (
          <button
            className="bg-accent hover:bg-accent-dark focus:ring-accent text-white px-4 py-2 rounded-lg"
            onClick={() => handleAction("create")}
          >
            <PlusCircle />
          </button>
        )}
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <Form
          action={action}
          onClose={onClose}
          hero={heroSelected}
          collections={collections}
        />
      </Modal>
      {heroes.length > 0 ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="hero-list">
            {(provided) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4 overflow-y-auto max-h-[550px]"
              >
                {newHeroes.map((hero, index) => (
                  <Draggable key={hero.id} draggableId={hero.id} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="h-[200px] relative rounded-md text-center"
                      >
                        <div
                          className="w-full h-full rounded-md bg-cover"
                          style={{
                            backgroundImage: `url(${hero.imageUrl})`,
                          }}
                        />
                        <div className="absolute size-full top-0 left-0 p-4 bg-black bg-opacity-50 text-white flex flex-col justify-end items-center">
                          <p className="font-thin text-base">{hero.title}</p>
                          <h3 className="font-extrabold text-lg">
                            {hero.subtitle}
                          </h3>
                          <small className="font-extralight text-xs">
                            {hero.description}
                          </small>
                          {hero.buttonLink && (
                            <p className="border border-white rounded-md py-2 px-4 mt-4 bg-white text-black">
                              {hero.buttonLink}
                            </p>
                          )}
                        </div>
                        {!hero.isActive && (
                          <div className="absolute size-full top-0 left-0 p-4 bg-black bg-opacity-50 text-white flex flex-col justify-center items-center">
                            <EyeSlashIcon size="size-10" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2 flex gap-2">
                          <button
                            className="bg-accent hover:bg-accent-dark focus:ring-accent text-white px-4 py-2 rounded-lg"
                            onClick={() =>
                              handleAction(
                                hero.isActive ? "deactivate" : "activate",
                                hero
                              )
                            }
                          >
                            {hero.isActive ? <EyeSlashIcon /> : <EyeIcon />}
                          </button>
                          <button
                            className="bg-accent hover:bg-accent-dark focus:ring-accent text-white px-4 py-2 rounded-lg"
                            onClick={() => handleAction("update", hero)}
                          >
                            <PencilIcon />
                          </button>
                          <button
                            className="bg-accent hover:bg-accent-dark focus:ring-accent text-white px-4 py-2 rounded-lg"
                            onClick={() => handleAction("delete", hero)}
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <Card404
          title="No se encontraron heroes"
          description="Agrega uno nuevo para comenzar"
        />
      )}
    </>
  );
};

export default ListDnd;
