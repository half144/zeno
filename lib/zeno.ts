import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Class that manages a state and its listeners
 * @template T Type of stored value
 */
class ZenoState<T> {
  private currentValue: T | null = null;
  private listeners: ((value: T) => void)[] = [];

  /**
   * Adds a listener to this state
   * @param listener Function that will be called when the value is updated
   */
  addListener(listener: (value: T) => void): void {
    this.listeners.push(listener);
  }

  /**
   * Removes a listener from this state
   * @param listener Function to be removed
   */
  removeListener(listener: (value: T) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * Gets all registered listeners
   * @returns Array of listener functions
   */
  getListeners(): ((value: T) => void)[] {
    return this.listeners;
  }

  /**
   * Gets the current state value
   * @returns Current value or null
   */
  getCurrentValue(): T | null {
    return this.currentValue;
  }

  /**
   * Sets the current state value
   * @param value New value
   */
  setCurrentValue(value: T): void {
    this.currentValue = value;
  }
}

/**
 * Main controller that manages all application states
 */
class ZenoController {
  // Using any here is necessary as the Map stores ZenoState instances of different generic types
  // We use type assertions in the methods to ensure type safety when accessing the values
  private listeners: Map<string, ZenoState<any>> = new Map();

  /**
   * Adds a setState function to a specific state
   * @param setState Function to update component state
   * @param key Unique state key
   * @returns Function to remove the listener when component unmounts
   */
  addSetStateByKey<T>(setState: (value: T) => void, key: string): () => void {
    const existingState = this.listeners.get(key) as ZenoState<T> | undefined;

    if (!existingState) {
      const zenoState = new ZenoState<T>();
      zenoState.addListener(setState);
      this.listeners.set(key, zenoState);
      return () => zenoState.removeListener(setState);
    }

    existingState.addListener(setState);
    return () => existingState.removeListener(setState);
  }

  /**
   * Notifies all listeners about a state update
   * @param key State key
   * @param value New value
   */
  notify<T>(key: string, value: T): void {
    const zenoState = this.listeners.get(key) as ZenoState<T> | undefined;
    if (zenoState) {
      zenoState.setCurrentValue(value);
      zenoState.getListeners().forEach((listener) => {
        listener(value);
      });
    }
  }

  /**
   * Gets the current state for a specific key
   * @param key State key
   * @returns Current state value or null
   */
  getCurrentState<T>(key: string): T | null {
    const state = this.listeners.get(key) as ZenoState<T> | undefined;
    if (state) {
      return state.getCurrentValue();
    }
    return null;
  }

  /**
   * Checks if a state exists for a key
   * @param key State key
   * @returns true if state exists, false otherwise
   */
  hasState(key: string): boolean {
    return this.listeners.has(key);
  }
}

// Singleton instance of the controller
const zenoControllerInstance = new ZenoController();

/**
 * Hook for managing shared state between React components
 *
 * This hook allows different components to share and synchronize
 * their state, even without hierarchical relationship between them.
 *
 * @template T Type of value stored in the state
 * @param key Unique key to identify the shared state
 * @param initialState Initial state value (optional)
 * @returns [currentState, function to update the state]
 *
 * @example
 * // Component A
 * const [count, setCount] = useZeno('count', 0);
 *
 * // Component B (in another part of the application)
 * const [count, setCount] = useZeno('count', 0);
 * // Both components share the same value
 */
export function useZeno<T>(
  key: string,
  initialState: T | null = null
): [T | null, (newState: T) => void] {
  const zenoController = useRef<ZenoController>(zenoControllerInstance);
  const [internalState, setInternalState] = useState<T | null>(() => {
    const currentState = zenoController.current.getCurrentState<T>(key);
    if (currentState !== null) {
      return currentState;
    }
    if (initialState !== null && !zenoController.current.hasState(key)) {
      zenoController.current.notify(key, initialState);
    }
    return initialState;
  });

  useEffect(() => {
    const cleanup = zenoController.current.addSetStateByKey<T>(
      setInternalState,
      key
    );
    return cleanup;
  }, [key]);

  const setState = useCallback(
    (newState: T): void => {
      zenoController.current.notify(key, newState);
    },
    [key]
  );

  return [internalState, setState];
}
