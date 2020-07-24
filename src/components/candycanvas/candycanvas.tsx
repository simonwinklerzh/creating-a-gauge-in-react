import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Matter from 'matter-js';
import { candyCounters, getCandyCountersById } from '../../candies';
import {
  getDifference,
  setSerializedCanvasState,
  getSerializedCanvasState,
  getCounters,
  store
} from '../../store';
import { randomIntFromInterval } from '../../utility';

/* ==========================================================================
   Settings
   ========================================================================== */

const canvas_width: number = 800;
const canvas_height: number = 600;
const candy_diameter: number = (canvas_width / 40) / 2;
const default_circle_color: string = '#ffffff';
const canvas_background_color: string = '#1d3557';
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

const createCircle = (color: string): Matter.Body => {
  return Bodies.circle(
    getRandomCandyStartPosition(canvas_width),
    canvas_height / 10,
    candy_diameter,
    {
      render: {
        fillStyle: color
      }
    }
  );
}

function storeSerializedStateOfCanvas() {
  const serializedWorldState = JSON.stringify(
    Composite.allBodies(engine.world),
    (key, value) => (key === 'parent' || key === 'parts' || key === 'body') ? undefined : value
  );
  store.dispatch(setSerializedCanvasState(serializedWorldState));
}

/* ==========================================================================
   Prepare initialization
   ========================================================================== */

// module aliases
const Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Composite = Matter.Composite;

// create an engine
const engine = Engine.create();

const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

World.add(engine.world, [ground]);

let circles: Matter.Body[] = [];

export const CandyCanvas = () => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const difference_container = useSelector(getDifference);
  const serializedWorldState = useSelector(getSerializedCanvasState);
  const counters = useSelector(getCounters);
  const dispatch = useDispatch();

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
            background: canvas_background_color,
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
   * Add or remove elements to and from the canvas when counters
   * in the store change.
   */
  useEffect(() => {
    const difference = difference_container.difference;
    const candyCounter = getCandyCountersById(difference_container.counterId, candyCounters);
    const color = candyCounter
      ? candyCounter.color
      : default_circle_color;
    // Add new elements
    if (difference > 0) {
      for (let i = 0; i < difference; i += 1) {
        const circle = createCircle(color);
        World.add(engine.world, [circle]);
        circles.push(circle);
      }
    // Remove elements
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
  }, [difference_container, dispatch]);

  /**
   * Serialize the state of all the objects on the canvas and store
   * it in localstorage.
   * With this serialized information, we can later restore the state
   * of the canvas.
   */
  useEffect(() => {
    window.addEventListener('beforeunload', storeSerializedStateOfCanvas);
    return () => {
      window.removeEventListener('beforeunload', storeSerializedStateOfCanvas);
    }
  });

  /**
   * Parse the serialized state from local storage
   * Restore the state of the objects in the canvas
   */
  useEffect(() => {
    const difference = difference_container.difference;
    if (difference === 0 && difference_container.counterId === 'restored_state_no_counter_id') {
      try {
        JSON.parse(serializedWorldState).forEach((bodyJSON: object) => {
          const body = Body.create(bodyJSON);
          World.add(engine.world, body);
          circles.push(body);
        });
      } catch (e) {
        // No serializedWorldState found in localstorage
      }
    }
  }, [difference_container, serializedWorldState, dispatch]);

  /**
   * Remove all objects from the canvas when the counters have been reset.
   */
  useEffect(() => {
    if (!counters.length) {
      World.clear(engine.world, true);
      circles = [];
    }
  }, [counters]);

  return (
    <div
      ref={canvasContainerRef}
      className="candycanvas">
    </div>
  );
}
