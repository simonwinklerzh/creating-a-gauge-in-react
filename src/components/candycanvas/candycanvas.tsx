import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Matter from 'matter-js';
import { CandyCounter } from '../../candies';
import { store, getDifference, getCounterById } from '../../store';
import { randomIntFromInterval } from '../../utility';

/* ==========================================================================
   Settings
   ========================================================================== */

const canvas_width: number = 800;
const canvas_height: number = 600;
const candy_diameter: number = (canvas_width / 50) / 2;
const default_circle_color = '#ffffff';
/**
 * Add a padding to make sure that candies are not created on the very
 * left or right hand border of the canvas.
 */
const canvas_padding: number = 10;

/* ==========================================================================
   Helper functions
   ========================================================================== */

const getRandomCandyStartPosition = (canvas_width: number) : number => {
  return randomIntFromInterval(
    Math.round(candy_diameter) + canvas_padding,
    canvas_width - (2 * Math.round(candy_diameter)) - (2 * canvas_padding)
  );
}

/* ==========================================================================
   Prepare initialization
   ========================================================================== */

// module aliases
const Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;

// create an engine
const engine = Engine.create();

const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

World.add(engine.world, [ground]);

let circles: Matter.Body[] = [];

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
          getRandomCandyStartPosition(canvas_width),
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
      interface Accumulator {
        circlesToRemove: Matter.Body[];
        newCircles: Matter.Body[];
      }
      const { circlesToRemove, newCircles } =
      circles.reduce((accumulator: Accumulator, current: Matter.Body): Accumulator => {
        if (current.render.fillStyle === color && accumulator.circlesToRemove.length < Math.abs(difference)) {
          return {
            ...accumulator,
            circlesToRemove: [...accumulator.circlesToRemove, current]
          }
        }
        return {
          ...accumulator,
          newCircles: [...accumulator.newCircles, current]
        };
      }, {
        circlesToRemove: [],
        newCircles: []
      });
      circlesToRemove.forEach(circle => World.remove(engine.world, circle));
      circles = newCircles;
    }
  }, [difference_container]);

  return (
    <div
      ref={canvasContainerRef}
      className="candycanvas">
    </div>
  );
}
