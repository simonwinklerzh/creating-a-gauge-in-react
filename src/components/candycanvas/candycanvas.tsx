import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Matter from 'matter-js';
import { CandyCounter } from '../../candies';
import { store, getDifference, getCounterById } from '../../store';

const canvas_width: number = 800;
const canvas_height: number = 600;
const candy_diameter: number = (canvas_width / 100) / 2;
const default_circle_color = '#ffffff';

// module aliases
const Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;

// create an engine
const engine = Engine.create();

const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

World.add(engine.world, [ground]);

const circles: Matter.Body[] = [];

export const CandyCanvas = () => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const difference_container = useSelector(getDifference);

  /**
   * Create and render our canvas when the component has mounted
   */
  useEffect(() => {
    if (canvasContainerRef && canvasContainerRef.current) {
      // create a renderer
      const render = Render.create({
          element: canvasContainerRef.current,
          engine: engine,
          options: {
            wireframes: false,
            background: '#120e2d',
            width: canvas_width,
            height: canvas_height
          }
      });

      // run the engine
      Engine.run(engine);

      // run the renderer
      Render.run(render);
    }
  }, []);

  /**
   * Add or remove elements from the canvas when counters
   * in the store change.
   */
  useEffect(() => {
    const difference = difference_container.difference;
    const state = store.getState();
    const counter = getCounterById(state, difference_container.counterId) as CandyCounter;
    const color = counter
      ? counter.color
      : default_circle_color;

    if (difference > 0) {
      for (let i = 0; i < difference; i += 1) {
        const circle = Bodies.circle(
          canvas_width / 2,
          canvas_height / 10,
          candy_diameter,
          {
            render: {
              fillStyle: color
            }
          }
        );
        World.add(engine.world, [circle]);
        circles.push(circle);
      }
    } else if (difference < 0) {
      circles
        .splice(0, Math.abs(difference))
        .forEach(circle => {
          World.remove(engine.world, circle);
        });
    }
  }, [difference_container]);

  return (
    <div
      ref={canvasContainerRef}
      className="candycanvas">
    </div>
  );
}
